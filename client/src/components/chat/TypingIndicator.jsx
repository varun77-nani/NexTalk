export default function TypingIndicator({ visible }) {
  return <div className="typing-indicator" aria-live="polite">{visible ? "Someone is typing..." : ""}</div>;
}
