import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../Models/Users_Models.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ msg: "Welcome to the protected dashboard!" });
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
