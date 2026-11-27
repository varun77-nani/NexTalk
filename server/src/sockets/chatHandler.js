import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import * as messageService from "../services/messageService.js";

export function registerChatHandlers(io, socket) {
  const userRoom = `user:${socket.user.id}`;
  const alreadyOnline = io.sockets.adapter.rooms.has(userRoom);
  socket.join(userRoom);
  if (!alreadyOnline) io.emit("presence:online", { userId: socket.user.id });

  socket.on(
    "conversation:join",
    async (payload = {}, acknowledge = () => {}) => {
      const conversationId = payload?.conversationId;
      const reply = typeof acknowledge === "function" ? acknowledge : () => {};
      try {
        if (!mongoose.isValidObjectId(conversationId)) {
          return reply({ error: "Conversation not found" });
        }
        const conversation = await Conversation.exists({
          _id: conversationId,
          participants: socket.user.id,
        });
        if (!conversation) return reply({ error: "Conversation not found" });
        await socket.join(`conv:${conversationId}`);
        reply({ ok: true });
      } catch (error) {
        console.error("Could not join conversation", error);
        reply({ error: "Could not join conversation" });
      }
    },
  );

  socket.on("conversation:leave", (payload = {}) => {
    const conversationId = payload?.conversationId;
    if (mongoose.isValidObjectId(conversationId)) {
      socket.leave(`conv:${conversationId}`);
    }
  });

  socket.on("message:send", async (payload = {}, acknowledge = () => {}) => {
    const reply = typeof acknowledge === "function" ? acknowledge : () => {};
    try {
      const message = await messageService.createMessage({
        conversationId: payload?.conversationId,
        senderId: socket.user.id,
        content: payload?.content,
      });
      io.to(`conv:${payload.conversationId}`).emit("message:new", message);
      reply({ ok: true, message });
    } catch (error) {
      const isClientError = error.statusCode >= 400 && error.statusCode < 500;
      if (!isClientError) console.error("Could not send message", error);
      const message = isClientError ? error.message : "Could not send message";
      reply({ error: message });
      socket.emit("message:error", { message });
    }
  });

  for (const event of ["typing:start", "typing:stop"]) {
    socket.on(event, (payload = {}) => {
      const conversationId = payload?.conversationId;
      const room = `conv:${conversationId}`;
      if (!mongoose.isValidObjectId(conversationId) || !socket.rooms.has(room))
        return;
      socket.to(room).emit("typing:update", {
        conversationId,
        userId: socket.user.id,
        isTyping: event === "typing:start",
      });
    });
  }

  socket.on("disconnecting", () => {
    const sockets = io.sockets.adapter.rooms.get(userRoom);
    if (sockets?.size === 1) {
      socket.broadcast.emit("presence:offline", { userId: socket.user.id });
    }
  });
}
