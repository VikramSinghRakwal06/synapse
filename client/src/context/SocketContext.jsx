import { useState, useContext, createContext, useEffect } from "react";
import io from "socket.io-client";
import useAuthStore from "../store/useAuthStore";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuthStore();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token && user) {
      const newSocket = io(
        import.meta.env.VITE_SERVER_URL || "http://localhost:3001",
        {
          auth: {
            token: token,
          },
          query: {
            userId: user._id || user.id,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          transports: ["websocket"],
        },
      );

      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log("Synapse socket connected: ", newSocket.id);
      });
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error :", error.message);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [token, user]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export const useSocket = () => useContext(SocketContext);
