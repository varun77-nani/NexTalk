import * as messageService from "../services/messageService.js";

export async function sendMessage(req, res) {
  const message = await messageService.createMessage({
    conversationId: req.params.conversationId,
    senderId: req.user.id,
    content: req.body?.content,
  });
  res.status(201).json({ message });
}
