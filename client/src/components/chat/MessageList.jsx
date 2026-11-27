import { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import MessageBubble from "./MessageBubble.jsx";

export default function MessageList({ messages }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          own={message.senderId._id === user._id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
