// Socket.jsx
import { io } from "socket.io-client";

const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];

const socket = io("https://chat-app-gamma-sage.vercel.app", {
  auth: { token },
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
