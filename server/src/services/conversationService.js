import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export async function listConversations(userId) {
  return Conversation.find({ participants: userId })
    .populate("participants", "username email avatarUrl lastSeen")
    .populate({ path: "lastMessage", populate: { path: "senderId", select: "username" } })
    .sort({ updatedAt: -1 });
}

export async function findOrCreateConversation(userId, participantId) {
  if (!mongoose.isValidObjectId(participantId) || userId.toString() === participantId.toString()) {
    throw new ApiError(400, "A valid, different participant is required");
  }
  const participant = await User.exists({ _id: participantId });
  if (!participant) throw new ApiError(404, "User not found");

  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [userId, participantId], $size: 2 },
  });
  if (!conversation) {
    try {
      conversation = await Conversation.create({ participants: [userId, participantId] });
    } catch (error) {
      if (error.code !== 11000) throw error;
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, participantId], $size: 2 },
      });
    }
  }
  return conversation.populate("participants", "username email avatarUrl lastSeen");
}
