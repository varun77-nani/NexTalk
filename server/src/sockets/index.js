import { Server } from "socket.io";
import { env } from "../config/env.js";
import { corsOptions } from "../config/cors.js";
import { authenticateSocket } from "./authSocket.js";
import { registerChatHandlers } from "./chatHandler.js";

export function initSocket(httpServer) {
  const allowedOrigins = new Set(env.clientUrls);
  const io = new Server(httpServer, {
    cors: corsOptions,
    allowRequest: (request, callback) => {
      const origin = request.headers.origin;
      callback(null, !origin || allowedOrigins.has(origin));
    },
  });
  io.use(authenticateSocket);
  io.on("connection", (socket) => registerChatHandlers(io, socket));
  return io;
}
