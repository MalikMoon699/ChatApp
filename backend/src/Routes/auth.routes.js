import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  signUp,
  login,
  logout,
  upload,
  userdata,
  updateProfile,
  currunetUser,
} from "../Controllers/Auth.controller.js";

const router = express.Router();

router.post("/signUp", upload.single("profile"), signUp);
router.post("/login", login);
router.get("/api/check", authMiddleware, (req, res) => {
  res.json({ isAuthenticated: true });
});
router.get("/users", authMiddleware, userdata);
router.get("/current-user", authMiddleware, currunetUser);
router.get("/logout", logout);
router.post(
  "/update-profile/:id",
  authMiddleware,
  upload.single("profile"),
  updateProfile
);

export default router;
// /auth