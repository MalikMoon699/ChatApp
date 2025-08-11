// Socket.jsx
import { io } from "socket.io-client";

const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];

const socket = io("https://chat-app-teal-pi-taupe.vercel.app", {
  query: {
    userId: localStorage.getItem("userId"),
  },
  auth: { token },
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
