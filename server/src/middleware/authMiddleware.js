import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new ApiError(401, "Authentication required");
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.userId };
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token");
  }
  next();
});
