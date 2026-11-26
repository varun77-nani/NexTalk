import Avatar from "../common/Avatar.jsx";
import { formatTime } from "../../utils/formatTime.js";

export default function ConversationItem({ conversation, currentUserId, active, onClick }) {
  const other = conversation.participants.find((user) => user._id !== currentUserId);
  const title = conversation.isGroup ? conversation.groupName : other?.username || "Conversation";
  return (
    <button className={`conversation-item ${active ? "active" : ""}`} onClick={onClick}>
      <Avatar user={other || { username: title }} />
      <span className="conversation-copy">
        <strong>{title}</strong>
        <span>{conversation.lastMessage?.content || "Start a conversation"}</span>
      </span>
      <time>{formatTime(conversation.lastMessage?.createdAt || conversation.updatedAt)}</time>
    </button>
  );
}
