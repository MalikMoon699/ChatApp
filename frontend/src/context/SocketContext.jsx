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

        if (!token) return;

        const user = await fetchCurrentUser();
        if (!user?._id) return;

        const socketInstance = io(
          "https://chat-app-gamma-sage.vercel.app" || "http://localhost:3001",
          {
            query: { userId: user._id },
            auth: { token },
            transports: ["websocket"],
          }
        );

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
        console.error("Socket setup error:", error);
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
