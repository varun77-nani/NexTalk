import { useCallback, useEffect, useState } from "react";
import * as conversationApi from "../api/conversationApi.js";
import { useSocket } from "./useSocket.js";

export function useChat() {
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await conversationApi.getConversations());
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return undefined;
    }
    let active = true;
    const conversationId = activeConversation._id;
    setMessages([]);
    conversationApi.getMessages(conversationId)
      .then((items) => { if (active) setMessages(items); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load messages");
      });
    socket.emit("conversation:join", { conversationId }, (result) => {
      if (result?.error) setError(result.error);
    });
    const onMessage = (message) => {
      if (message.conversationId !== conversationId) return;
      setMessages((current) =>
        current.some((item) => item._id === message._id) ? current : [...current, message],
      );
      loadConversations();
    };
    const onTyping = (event) => {
      if (event.conversationId === conversationId) setTypingUser(event.isTyping ? event.userId : null);
    };
    socket.on("message:new", onMessage);
    socket.on("typing:update", onTyping);
    return () => {
      active = false;
      socket.off("message:new", onMessage);
      socket.off("typing:update", onTyping);
      setTypingUser(null);
    };
  }, [activeConversation, socket, loadConversations]);

  const sendMessage = useCallback((content) => new Promise((resolve, reject) => {
    if (!activeConversation) return reject(new Error("Choose a conversation first"));
    socket.emit("message:send", { conversationId: activeConversation._id, content }, (result) => {
      if (result?.error) reject(new Error(result.error));
      else resolve(result.message);
    });
  }), [activeConversation, socket]);

  const updateTyping = useCallback((isTyping) => {
    if (!activeConversation) return;
    socket.emit(isTyping ? "typing:start" : "typing:stop", {
      conversationId: activeConversation._id,
    });
  }, [activeConversation, socket]);

  const openConversation = useCallback(async (conversation) => {
    setActiveConversation(conversation);
    setError("");
  }, []);

  return {
    conversations,
    activeConversation,
    messages,
    typingUser,
    loading,
    error,
    setActiveConversation: openConversation,
    sendMessage,
    updateTyping,
    loadConversations,
  };
}
