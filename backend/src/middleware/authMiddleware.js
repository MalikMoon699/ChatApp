// authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../Models/Users_Models.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Invalid token", err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
