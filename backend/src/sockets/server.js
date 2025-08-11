// sockets/server.js
import express from "express";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://chat-app-teal-pi-taupe.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

const users = {};

export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const userId = socket.handshake.query.userId;

  if (!userId || !token) {
    console.error("Socket auth error: Missing userId or token");
    return next(new Error("Authentication error: Missing userId or token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== userId) {
      console.error("Socket auth error: Token does not match userId");
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.userId = userId;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("⚡ New connection:", socket.id);

  const userId = socket.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Registered user:", userId, socket.id);
    io.emit("getOnlineUsers", Object.keys(users));
  }

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    if (userId) {
      delete users[userId];
      io.emit("getOnlineUsers", Object.keys(users));
    }
  });

  socket.on("sendMessage", ({ receiverId, message }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        message,
        senderId: userId,
        createdAt: new Date(),
      });
      console.log(`Message sent to ${receiverId}`);
    }
  });

  socket.on("messageUpdated", ({ receiverId, messageId, newContent }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageUpdated", {
        messageId,
        newContent,
      });
    }
  });

  socket.on("messageDeleted", ({ messageId, receiverId }) => {
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }
  });
});

export { app, io, server };
