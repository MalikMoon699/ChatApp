import connectDB from "./Config/db.js";
import express from "express";
import path from "path";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/Message.routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { app, server } from "./sockets/server.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
