// Message.controller.js
import { body, validationResult } from "express-validator";
import Conversation from "../Models/Conversation_Models.js";
import Message from "../Models/Message_Models.js";
import { io, getReceiverSocketId } from "../sockets/server.js";

export const sendMessageValidation = [
  body("message").trim().notEmpty().withMessage("Message cannot be empty"),
];

export const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    conversation.lastMessageTime = new Date();

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        ...newMessage.toObject(),
        createdAt: new Date(),
      });
    }

    res.status(201).json({
      message: `Message id:${newMessage._id} sent successfully for conversation with id: ${conversation._id}`,
      newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiverId } = req.body;
    const senderId = req.user._id;

    const message = await Message.findOne({ _id: id, senderId });
    if (!message) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(id);

    await Conversation.updateMany(
      { messages: id },
      { $pull: { messages: id } }
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", {
        messageId: id,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessageValidation = [
  body("newContent").trim().notEmpty().withMessage("Message cannot be empty"),
];

export const updateMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { newContent, receiverId } = req.body;
    const senderId = req.user._id;

    const message = await Message.findOne({ _id: id, senderId });
    if (!message) {
      return res
        .status(403)
        .json({ error: "You can only edit your own messages" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { message: newContent },
      { new: true }
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", {
        messageId: id,
        newContent,
      });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error in updateMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
