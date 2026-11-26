import jwt from "jsonwebtoken";
import cookie from "cookie";
import { env } from "../config/env.js";

export function authenticateSocket(socket, next) {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = socket.handshake.auth?.token || cookies.token;
    if (!token) throw new Error("Missing token");
    const payload = jwt.verify(token, env.jwtSecret);
    socket.user = { id: payload.userId };
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
