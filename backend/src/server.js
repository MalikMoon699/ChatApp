// server.js
import express from "express";
import connectDB from "./Config/db.js";
import path from "path";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/Message.routes.js";
import dashboardRoutes from "./Routes/Protocted.routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
// import { app, io } from "./sockets/server.js";
import { app } from "./sockets/server.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cookieParser());
connectDB();
app.use(
  cors({
    origin: "https://chat-app-beryl-three-91.vercel.app",
    credentials: true, // Allow cookies if used
  })
);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", authRoutes);
app.use("/message", messageRoutes);
app.use("/api", dashboardRoutes);

// Export as a Vercel serverless function
export default app;
