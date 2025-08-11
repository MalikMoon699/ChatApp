// Message.routes.js
import express from "express";
import {
  sendMessage,
  getMessage,
  deleteMessage,
  updateMessage,
  sendMessageValidation,
  updateMessageValidation,
} from "../Controllers/Message.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send/:id", authMiddleware, sendMessageValidation, sendMessage);
router.get("/get/:id", authMiddleware, getMessage);
router.delete("/delete/:id", authMiddleware, deleteMessage);
router.put(
  "/update/:id",
  authMiddleware,
  updateMessageValidation,
  updateMessage
);

export default router;
