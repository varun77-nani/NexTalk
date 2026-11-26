import { Server } from "socket.io";
import { env } from "../config/env.js";
import { authenticateSocket } from "./authSocket.js";
import { registerChatHandlers } from "./chatHandler.js";

export function initSocket(httpServer) {
  const allowedOrigin = new URL(env.clientUrl).origin;
  const io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
    allowRequest: (request, callback) => {
      const origin = request.headers.origin;
      callback(null, !origin || origin === allowedOrigin);
    },
  });
  io.use(authenticateSocket);
  io.on("connection", (socket) => registerChatHandlers(io, socket));
  return io;
}
