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
import { app } from "./sockets/server.js";

dotenv.config();

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

// Explicitly handle OPTIONS requests
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
