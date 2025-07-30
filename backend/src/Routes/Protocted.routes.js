import express from "express";
import auth from "../middleware/authMiddleware.js";
import User from "../models/Users_Models.js";

const router = express.Router();

router.get("/", auth, (req, res) => {
  res.json({ msg: "Welcome to the protected dashboard!" });
});

router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
