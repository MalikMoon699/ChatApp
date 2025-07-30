import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-beryl-three-91.vercel.app",
    methods: ["GET", "POST"],
  },
});

const users = {};

export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

io.on("connection", (socket) => {
  console.log("⚡ New connection:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log(" Registered user:", userId, socket.id);

    io.emit("getOnlineUsers", Object.keys(users));
  }

  socket.on("disconnect", () => {
    console.log(" Disconnected:", socket.id);
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
      console.log(` Message sent to ${receiverId}`);
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


});

export { app, io, server };
