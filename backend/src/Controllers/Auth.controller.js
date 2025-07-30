//Auth.controller.js
import { generateCustomId } from "../public/utils/generateId.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import User from "../Models/Users_Models.js";

export const signUp = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password)
    return res.status(400).json({ msg: "All fields are required" });

  if (password !== confirm_password)
    return res.status(400).json({ msg: "Passwords do not match" });

  let existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: "User already exists" });

  const customId = await generateCustomId();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    customId,
  });

  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    msg: "Signup successful",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ msg: "Invalid email or password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    msg: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

export const userdata = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user?._id; 

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
      _id: { $ne: currentUserId },
    };

    const searchUsers = await User.find(query).select("-password");
    res.json({ users: searchUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const currunetUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const homeData = (req, res) => {
  const user = req.user;
  res.render("home", { user });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const editProfileRoute = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("editProfile", { user, errors: {} });
  } catch (err) {
    console.error("Error loading edit profile page:", err);
    res.status(500).send("Server error");
  }
};

export const updateProfile = async (req, res) => {
  const { name } = req.body;
  const errors = {};
  const userId = req.params.id;

  if (!name) errors.name = "Name is required";

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (Object.keys(errors).length > 0) {
      return res.render("editProfile", {
        user: { ...user.toObject(), name },
        errors,
      });
    }

    user.name = name;

    if (req.file) {
      user.profile = req.file.filename;
    }

    await user.save();

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Server error");
  }
};