import api from "./axios.js";

export const getConversations = async () =>
  (await api.get("/conversations")).data.conversations;
export const createConversation = async (participantId) =>
  (await api.post("/conversations", { participantId })).data.conversation;
export const getMessages = async (conversationId, params = {}) =>
  (await api.get(`/messages/${conversationId}`, { params })).data.messages;
