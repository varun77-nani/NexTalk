import Conversation from "../models/Conversation.js";
import * as messageService from "../services/messageService.js";

export function registerChatHandlers(io, socket) {
  const userRoom = `user:${socket.user.id}`;
  socket.join(userRoom);
  io.emit("presence:online", { userId: socket.user.id });

  socket.on("conversation:join", async ({ conversationId } = {}, acknowledge = () => {}) => {
    try {
      const conversation = await Conversation.exists({
        _id: conversationId,
        participants: socket.user.id,
      });
      if (!conversation) return acknowledge({ error: "Conversation not found" });
      socket.join(`conv:${conversationId}`);
      acknowledge({ ok: true });
    } catch (error) {
      acknowledge({ error: error.message });
    }
  });

  socket.on("message:send", async (payload = {}, acknowledge = () => {}) => {
    try {
      const message = await messageService.createMessage({
        conversationId: payload.conversationId,
        senderId: socket.user.id,
        content: payload.content,
      });
      io.to(`conv:${payload.conversationId}`).emit("message:new", message);
      acknowledge({ ok: true, message });
    } catch (error) {
      acknowledge({ error: error.message });
      socket.emit("message:error", { message: error.message });
    }
  });

  for (const event of ["typing:start", "typing:stop"]) {
    socket.on(event, async ({ conversationId } = {}) => {
      const conversation = await Conversation.exists({
        _id: conversationId,
        participants: socket.user.id,
      });
      if (conversation) {
        socket.to(`conv:${conversationId}`).emit("typing:update", {
          conversationId,
          userId: socket.user.id,
          isTyping: event === "typing:start",
        });
      }
    });
  }

  socket.on("disconnect", () => {
    socket.broadcast.emit("presence:offline", { userId: socket.user.id });
  });
}
