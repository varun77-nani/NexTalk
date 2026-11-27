import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import ApiError from "../utils/ApiError.js";

async function requireParticipant(conversationId, userId) {
  if (!mongoose.isValidObjectId(conversationId))
    throw new ApiError(400, "Invalid conversation ID");
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
  if (!conversation) throw new ApiError(404, "Conversation not found");
  return conversation;
}

export async function createMessage({ conversationId, senderId, content }) {
  if (typeof content !== "string" || !content.trim()) {
    throw new ApiError(400, "Message content is required");
  }
  const trimmedContent = content.trim();
  if (trimmedContent.length > 5000)
    throw new ApiError(400, "Message is too long");
  const conversation = await requireParticipant(conversationId, senderId);
  const message = await Message.create({
    conversationId,
    senderId,
    content: trimmedContent,
    type: "text",
    readBy: [senderId],
  });
  conversation.lastMessage = message._id;
  await conversation.save();
  return message.populate("senderId", "username avatarUrl");
}

export async function getMessages({
  conversationId,
  userId,
  limit = 50,
  before,
}) {
  await requireParticipant(conversationId, userId);
  const safeLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 50, 1),
    100,
  );
  const filter = { conversationId };
  if (before) {
    if (typeof before !== "string" || Number.isNaN(Date.parse(before))) {
      throw new ApiError(400, "Invalid message cursor");
    }
    filter.createdAt = { $lt: new Date(before) };
  }
  return Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .populate("senderId", "username avatarUrl")
    .then((messages) => messages.reverse());
}
