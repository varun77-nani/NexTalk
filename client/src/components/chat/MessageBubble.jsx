import { formatTime } from "../../utils/formatTime.js";

export default function MessageBubble({ message, own }) {
  return (
    <div className={`message-row ${own ? "own" : ""}`}>
      <div className="message-bubble">
        <p>{message.content}</p>
        <time>{formatTime(message.createdAt)}</time>
      </div>
    </div>
  );
}
