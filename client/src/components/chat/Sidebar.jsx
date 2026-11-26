import { useRef, useState } from "react";
import { createConversation } from "../../api/conversationApi.js";
import { searchUsers } from "../../api/userApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../common/Avatar.jsx";
import ConversationItem from "./ConversationItem.jsx";

export default function Sidebar({ conversations, activeConversation, onSelect, onRefresh, onError }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchRequest = useRef(0);

  async function handleSearch(value) {
    setQuery(value);
    const requestId = ++searchRequest.current;
    if (!value.trim()) return setResults([]);
    try {
      const users = await searchUsers(value);
      if (requestId === searchRequest.current) setResults(users);
    } catch (error) {
      if (requestId === searchRequest.current) {
        onError(error.response?.data?.message || "User search failed");
      }
    }
  }

  async function startConversation(person) {
    try {
      const conversation = await createConversation(person._id);
      await onRefresh();
      onSelect(conversation);
      searchRequest.current += 1;
      setQuery("");
      setResults([]);
    } catch (error) {
      onError(error.response?.data?.message || "Could not start conversation");
    }
  }

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="brand"><span className="brand-mark">N</span><strong>NexTalk</strong></div>
        <button className="text-button" onClick={logout}>Sign out</button>
      </header>
      <div className="profile-summary"><Avatar user={user} /><span>{user.username}</span></div>
      <label className="search-label">
        <span>Find people</span>
        <input
          value={query}
          maxLength={100}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search by name or email"
        />
      </label>
      {results.length > 0 && (
        <div className="search-results">
          {results.map((person) => (
            <button key={person._id} onClick={() => startConversation(person)}>
              <Avatar user={person} size="small" /><span>{person.username}</span>
            </button>
          ))}
        </div>
      )}
      <h2 className="section-title">Messages</h2>
      <div className="conversation-list">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            currentUserId={user._id}
            active={conversation._id === activeConversation?._id}
            onClick={() => onSelect(conversation)}
          />
        ))}
        {!conversations.length && <p className="sidebar-hint">Search for someone to start chatting.</p>}
      </div>
    </aside>
  );
}
