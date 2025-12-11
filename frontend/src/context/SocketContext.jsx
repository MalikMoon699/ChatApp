import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchCurrentUser } from "../Utils/Message";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

 useEffect(() => {
   const setupSocket = async () => {
     const token = document.cookie
       .split("; ")
       .find((row) => row.startsWith("token="))
       ?.split("=")[1];
     if (!token) return;

     const user = await fetchCurrentUser();
     if (!user?._id) return;

     setTimeout(() => {
       const socketInstance = io(`${import.meta.env.VITE_BACKEND_URL}`, {
         query: { userId: user._id },
         auth: { token },
         transports: ["websocket"],
         withCredentials: true,
       });

       socketInstance.on("connect", () => {
         console.log("✅ Connected to Socket.io:", socketInstance.id);
       });

       socketInstance.on("connect_error", (err) => {
         console.error("❌ Socket connect error:", err.message);
       });

       setSocket(socketInstance);
     }, 500);
   };

   setupSocket();
 }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
