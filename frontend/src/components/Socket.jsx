import { io } from "socket.io-client";

const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];

const socket = io("https://chat-app-gamma-sage.vercel.app", {
  query: {
    userId: localStorage.getItem("userId"),
  },
  auth: { token },
  transports: ["websocket"],
});

export default socket;
