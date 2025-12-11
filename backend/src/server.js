// backend/src/server.js

import connectDB from "./Config/db.js";
import express from "express";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/Message.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { app, server } from "./sockets/server.js";

dotenv.config();

app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
  })
);

app.use(cookieParser());
connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
