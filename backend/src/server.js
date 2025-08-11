// src/server.js
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
import rateLimit from "express-rate-limit";
import { app } from "./sockets/server.js";

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(
  cors({
    origin: [
      "https://chat-app-teal-pi-taupe.vercel.app",
      "https://chat-app-gamma-sage.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: [
      "https://chat-app-teal-pi-taupe.vercel.app",
      "https://chat-app-gamma-sage.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cookieParser());
connectDB();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", authRoutes);
app.use("/message", messageRoutes);
app.use("/api", dashboardRoutes);

export default app;
