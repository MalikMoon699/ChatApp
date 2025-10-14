import express from "express";
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.FRONTEND_URL}`],
    methods: ["GET", "POST"],
    credentials: true,
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
    return next(new Error("Authentication error: Missing userId or token"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );
    if (decoded.id !== userId) {
      return next(new Error("Authentication error: Invalid token"));
    }
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("⚡ New connection:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(users));
  }

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    if (userId) {
      delete users[userId];
      io.emit("getOnlineUsers", Object.keys(users));
    }
  });
});

export { app, io, server };
