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
import helmet from "helmet";
import { app } from "./sockets/server.js";

dotenv.config();

app.use(helmet()); // Add security headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// Configure CORS to explicitly allow the frontend origin
app.use(
  cors({
    origin: [
      "https://chat-app-teal-pi-taupe.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

// Handle preflight requests for all routes
app.options(
  "*",
  cors({
    origin: [
      "https://chat-app-teal-pi-taupe.vercel.app",
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

// Error handling middleware to catch and log errors
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
