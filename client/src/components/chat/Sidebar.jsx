import { useState } from "react";
import { createConversation } from "../../api/conversationApi.js";
import { searchUsers } from "../../api/userApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../common/Avatar.jsx";
import ConversationItem from "./ConversationItem.jsx";

export default function Sidebar({ conversations, activeConversation, onSelect, onRefresh, onError }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(value) {
    setQuery(value);
    if (!value.trim()) return setResults([]);
    try {
      setResults(await searchUsers(value));
    } catch (error) {
      onError(error.response?.data?.message || "User search failed");
    }
  }

  async function startConversation(person) {
    try {
      const conversation = await createConversation(person._id);
      await onRefresh();
      onSelect(conversation);
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
        <input value={query} onChange={(event) => handleSearch(event.target.value)} placeholder="Search by name or email" />
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
