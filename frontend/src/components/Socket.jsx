import { io } from "socket.io-client";

const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  query: {
    userId: localStorage.getItem("userId"),
  },
  auth: { token },
  transports: ["websocket"],
});

export default socket;
