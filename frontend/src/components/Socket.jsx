import { io } from "socket.io-client";

const socket = io("https://chat-app-backend-one-lemon.vercel.app", {
  query: {
    userId: localStorage.getItem("userId"),
  },
  transports: ["websocket"],
});

export default socket;
