import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export async function searchUsers(req, res) {
  const rawSearch = req.query.search;
  if (rawSearch !== undefined && typeof rawSearch !== "string") {
    throw new ApiError(400, "Search must be a string");
  }
  const search = rawSearch?.trim();
  if (!search) return res.json({ users: [] });
  if (search.length > 100)
    throw new ApiError(400, "Search must not exceed 100 characters");
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const users = await User.find({
    _id: { $ne: req.user.id },
    $or: [
      { username: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
    ],
  })
    .select("username avatarUrl lastSeen")
    .limit(20);
  res.json({ users });
}

export async function updateProfile(req, res) {
  const body =
    req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? req.body
      : {};
  const updates = {};
  if (typeof body.username === "string" && body.username.trim()) {
    updates.username = body.username.trim();
  }
  if (typeof body.avatarUrl === "string")
    updates.avatarUrl = body.avatarUrl.trim();
  if (!Object.keys(updates).length)
    throw new ApiError(400, "No valid profile fields provided");
  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("username email avatarUrl lastSeen");
  res.json({ user });
}
