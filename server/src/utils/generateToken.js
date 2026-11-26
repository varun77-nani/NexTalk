import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(userId) {
  return jwt.sign({ userId: userId.toString() }, env.jwtSecret, { expiresIn: "7d" });
}

export function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
