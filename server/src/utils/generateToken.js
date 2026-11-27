import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
};

export function generateToken(userId) {
  return jwt.sign({ userId: userId.toString() }, env.jwtSecret, { expiresIn: "7d" });
}

export function setAuthCookie(res, token) {
  res.cookie("token", token, {
    ...authCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
