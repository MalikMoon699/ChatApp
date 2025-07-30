import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  query: {
    userId: localStorage.getItem("userId"),
  },
  transports: ["websocket"],
});

export default socket;
