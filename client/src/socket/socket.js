import { io } from "socket.io-client";

let socket;

export function createSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
}
