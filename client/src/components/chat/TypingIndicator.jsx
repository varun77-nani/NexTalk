export default function TypingIndicator({ visible, username }) {
  const message = visible ? `${username || "Someone"} is typing...` : "";
  return (
    <div className="typing-indicator" aria-live="polite">
      {message}
    </div>
  );
}
