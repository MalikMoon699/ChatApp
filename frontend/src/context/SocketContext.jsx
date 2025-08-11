// context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchCurrentUser } from "../Utils/Message";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          console.error("No token found, cannot initialize socket");
          return;
        }

        const user = await fetchCurrentUser();
        if (!user?._id) {
          console.error("No user ID found, cannot initialize socket");
          return;
        }

        const socketInstance = io("https://chat-app-gamma-sage.vercel.app", {
          query: { userId: user._id },
          auth: { token },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
          console.log("Socket connected:", socketInstance.id);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error("Socket setup error:", error.message);
      }
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
