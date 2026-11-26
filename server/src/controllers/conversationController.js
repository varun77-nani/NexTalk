import * as conversationService from "../services/conversationService.js";
import * as messageService from "../services/messageService.js";

export async function getConversations(req, res) {
  res.json({ conversations: await conversationService.listConversations(req.user.id) });
}

export async function createConversation(req, res) {
  const conversation = await conversationService.findOrCreateConversation(
    req.user.id,
    req.body?.participantId,
  );
  res.status(200).json({ conversation });
}

export async function getMessages(req, res) {
  const messages = await messageService.getMessages({
    conversationId: req.params.conversationId,
    userId: req.user.id,
    limit: req.query.limit,
    before: req.query.before,
  });
  res.json({ messages });
}
