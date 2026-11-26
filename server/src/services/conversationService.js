import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

function findDirectConversation(userId, participantId) {
  return Conversation.findOne({
    isGroup: false,
    participants: { $all: [userId, participantId], $size: 2 },
  });
}

export async function listConversations(userId) {
  return Conversation.find({ participants: userId })
    .populate("participants", "username avatarUrl lastSeen")
    .populate({ path: "lastMessage", populate: { path: "senderId", select: "username" } })
    .sort({ updatedAt: -1 });
}

export async function findOrCreateConversation(userId, participantId) {
  if (!mongoose.isValidObjectId(participantId) || userId.toString() === participantId.toString()) {
    throw new ApiError(400, "A valid, different participant is required");
  }
  const participant = await User.exists({ _id: participantId });
  if (!participant) throw new ApiError(404, "User not found");

  let conversation = await findDirectConversation(userId, participantId);
  if (!conversation) {
    try {
      conversation = await Conversation.create({ participants: [userId, participantId] });
    } catch (error) {
      if (error.code !== 11000) throw error;
      conversation = await findDirectConversation(userId, participantId);
    }
  }
  return conversation.populate("participants", "username avatarUrl lastSeen");
}
