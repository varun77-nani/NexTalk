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

export async function signup(details = {}) {
  const { username, email, password } = details ?? {};
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !email.trim() ||
    !password
  ) {
    throw new ApiError(400, "Username, email, and password are required");
  }
  const normalizedUsername = username.trim();
  if (normalizedUsername.length < 2 || normalizedUsername.length > 30) {
    throw new ApiError(400, "Username must be between 2 and 30 characters");
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    throw new ApiError(400, "A valid email address is required");
  }
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");
  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new ApiError(400, "Password must not exceed 72 bytes");
  }

  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await User.create({ username: normalizedUsername, email: normalizedEmail, passwordHash });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "An account with this email already exists");
    throw error;
  }
  return { user: publicUser(user), token: generateToken(user._id) };
}

export async function login(credentials = {}) {
  const { email, password } = credentials ?? {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new ApiError(400, "Email and password are required");
  }
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
