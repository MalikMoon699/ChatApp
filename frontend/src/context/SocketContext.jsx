// context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchCurrentUser } from "../Utils/Message";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const setupSocket = async () => {
      const user = await fetchCurrentUser();
      if (!user?._id) return;

      const socketInstance = io(
        "https://chat-app-backend-one-lemon.vercel.app",
        {
          query: { userId: user._id },
        }
      );

      setSocket(socketInstance);
    };

    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
