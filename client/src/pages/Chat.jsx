import { useState } from "react";
import Sidebar from "../components/chat/Sidebar.jsx";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import Loader from "../components/common/Loader.jsx";
import { useChat } from "../hooks/useChat.js";

export default function Chat() {
  const chat = useChat();
  const [pageError, setPageError] = useState("");
  if (chat.loading) return <Loader label="Loading your chats..." />;
  return (
    <main className="chat-layout">
      <Sidebar
        conversations={chat.conversations}
        activeConversation={chat.activeConversation}
        onSelect={chat.setActiveConversation}
        onRefresh={chat.loadConversations}
        onError={setPageError}
      />
      <ChatWindow
        conversation={chat.activeConversation}
        messages={chat.messages}
        typingUser={chat.typingUser}
        onSend={chat.sendMessage}
        onTyping={chat.updateTyping}
      />
      {(pageError || chat.error) && (
        <div className="toast" role="alert">{pageError || chat.error}</div>
      )}
    </main>
  );
}
