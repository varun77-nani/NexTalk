import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  lastSeen: user.lastSeen,
});

export async function signup({ username, email, password }) {
  if (!username?.trim() || !email?.trim() || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username: username.trim(), email: normalizedEmail, passwordHash });
  return { user: publicUser(user), token: generateToken(user._id) };
}

export async function login({ email, password }) {
  if (!email?.trim() || !password) throw new ApiError(400, "Email and password are required");
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }
  return { user: publicUser(user), token: generateToken(user._id) };
}

export async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return publicUser(user);
}
