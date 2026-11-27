import { useEffect, useRef, useState } from "react";

export default function MessageInput({ onSend, onTyping, onError, disabled }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const typingTimer = useRef(null);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  async function submit(event) {
    event.preventDefault();
    const text = content.trim();
    if (!text || sending || disabled) return;
    setSending(true);
    clearTimeout(typingTimer.current);
    onTyping(false);
    try {
      await onSend(text);
      setContent("");
    } catch (error) {
      onError(error.message || "Could not send message");
    } finally {
      setSending(false);
    }
  }

  function updateContent(value) {
    setContent(value);
    onTyping(Boolean(value.trim()));
    clearTimeout(typingTimer.current);
    if (value.trim()) {
      typingTimer.current = setTimeout(() => onTyping(false), 1000);
    }
  }

  return (
    <form className="message-form" onSubmit={submit}>
      <textarea
        value={content}
        onChange={(event) => updateContent(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form.requestSubmit();
          }
        }}
        placeholder="Write a message..."
        rows="1"
        maxLength="5000"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || sending || !content.trim()}>
        Send
      </button>
    </form>
  );
}
