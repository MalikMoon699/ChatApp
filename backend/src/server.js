//server.js
import express from "express";
import connectDB from "./config/db.js";
import path from "path";
import authRoutes from "./Routes/auth.routes.js";
import messageRoutes from "./Routes/Message.routes.js";
import dashboardRoutes from "./Routes/Protocted.routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { app, server } from "./sockets/server.js";

const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cookieParser());
connectDB();
app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", authRoutes);
app.use("/message", messageRoutes);
app.use("/api", dashboardRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
