import { io } from "socket.io-client";

let socket;

export function createSocket() {
  if (!socket) {
    const socketUrl = import.meta.env.PROD
      ? window.location.origin
      : import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socket = io(socketUrl, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
}
