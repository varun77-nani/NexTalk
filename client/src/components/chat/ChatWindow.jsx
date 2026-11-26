import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../common/Avatar.jsx";
import EmptyState from "../common/EmptyState.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

export default function ChatWindow({ conversation, messages, typingUser, onSend, onTyping }) {
  const { user } = useAuth();
  if (!conversation) {
    return <main className="chat-main"><EmptyState title="Your conversations, together">Choose a chat or find someone new to get started.</EmptyState></main>;
  }
  const other = conversation.participants.find((person) => person._id !== user._id);
  const title = conversation.isGroup ? conversation.groupName : other?.username || "Conversation";
  return (
    <main className="chat-main">
      <header className="chat-header">
        <Avatar user={other || { username: title }} />
        <div><strong>{title}</strong><span>{other?.lastSeen ? "NexTalk" : "Conversation"}</span></div>
      </header>
      <MessageList messages={messages} />
      <TypingIndicator visible={Boolean(typingUser && typingUser !== user._id)} />
      <MessageInput onSend={onSend} onTyping={onTyping} />
    </main>
  );
}
