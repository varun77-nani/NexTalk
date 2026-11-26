import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export async function searchUsers(req, res) {
  const search = req.query.search?.trim();
  if (!search) return res.json({ users: [] });
  const users = await User.find({
    _id: { $ne: req.user.id },
    $or: [
      { username: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      { email: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    ],
  })
    .select("username email avatarUrl lastSeen")
    .limit(20);
  res.json({ users });
}

export async function updateProfile(req, res) {
  const updates = {};
  if (typeof req.body.username === "string" && req.body.username.trim()) {
    updates.username = req.body.username.trim();
  }
  if (typeof req.body.avatarUrl === "string") updates.avatarUrl = req.body.avatarUrl.trim();
  if (!Object.keys(updates).length) throw new ApiError(400, "No valid profile fields provided");
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
    .select("username email avatarUrl lastSeen");
  res.json({ user });
}
