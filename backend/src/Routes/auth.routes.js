//auth.routes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  signUp,
  login,
  homeData,
  logout,
  upload,
  userdata,
  editProfileRoute,
  updateProfile,
  currunetUser,
} from "../Controllers/Auth.controller.js";

const router = express.Router();

router.post("/signUp", upload.single("profile"), signUp);
router.get("/api/auth/check", authMiddleware, (req, res) => {
  res.json({ isAuthenticated: true });
});
router.get("/users", authMiddleware, userdata);
router.get("/current-user", authMiddleware, currunetUser);

router.post("/login", login);
router.get("/", authMiddleware, homeData);
router.get("/logout", logout);
router.get("/edit-profile/:id", authMiddleware, editProfileRoute);
router.post("/update-profile/:id", upload.single("profile"), updateProfile);

export default router;
