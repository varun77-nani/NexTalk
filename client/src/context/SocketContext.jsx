import { createContext, useEffect, useMemo, useState } from "react";
import { createSocket } from "../socket/socket.js";
import { useAuth } from "../hooks/useAuth.js";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      setOnlineUsers([]);
      return undefined;
    }
    const online = ({ userId }) =>
      setOnlineUsers((current) => [...new Set([...current, userId])]);
    const offline = ({ userId }) =>
      setOnlineUsers((current) => current.filter((id) => id !== userId));
    socket.on("presence:online", online);
    socket.on("presence:offline", offline);
    socket.connect();
    return () => {
      socket.off("presence:online", online);
      socket.off("presence:offline", offline);
      socket.disconnect();
    };
  }, [socket, user]);

  const value = useMemo(() => ({ socket, onlineUsers }), [socket, onlineUsers]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
