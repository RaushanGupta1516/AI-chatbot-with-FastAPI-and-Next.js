"use client";

import { Plus, Trash2, MessageSquare } from "lucide-react";

interface Session { id: string; label: string; }

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export default function Sidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">PersonaAI</span>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={15} strokeWidth={2.8} />
          <span>New Chat</span>
        </button>
      </div>

      {sessions.length > 0 && (
        <div className="section-label">Recent</div>
      )}

      <nav className="session-list">
        {sessions.length === 0 && (
          <div className="empty-sessions">No conversations yet</div>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${activeSessionId === session.id ? "active" : ""}`}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare size={13} className="s-icon" />
            <span className="s-label">{session.label}</span>
            <button className="del-btn" onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="dot" />
        <span className="model-name">Mistral AI · Active</span>
      </div>

      <style jsx>{`
        .sidebar {
          width: 256px; min-width: 256px;
          background: #0f0f16;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          height: 100vh; padding: 18px 12px;
          gap: 4px;
        }
        .sidebar-top {
          display: flex; flex-direction: column; gap: 10px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 8px;
        }
        .brand {
          display: flex; align-items: center; gap: 8px;
          padding: 0 4px;
        }
        .brand-icon {
          font-size: 18px; color: #a78bfa;
          filter: drop-shadow(0 0 8px #a78bfa99);
        }
        .brand-name {
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          font-weight: 700; color: rgba(255,255,255,0.85);
          letter-spacing: -0.02em;
        }
        .new-chat-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
          border: 1px solid rgba(99,102,241,0.45);
          border-radius: 11px;
          color: rgba(255,255,255,0.88);
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          font-weight: 600; cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 0 14px rgba(99,102,241,0.15);
        }
        .new-chat-btn:hover {
          background: linear-gradient(135deg, rgba(99,102,241,0.38), rgba(139,92,246,0.3));
          border-color: rgba(99,102,241,0.65);
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
          transform: translateY(-1px);
        }
        .section-label {
          font-size: 10.5px; font-family: 'DM Sans', sans-serif;
          font-weight: 700; color: rgba(255,255,255,0.25);
          letter-spacing: 0.09em; text-transform: uppercase;
          padding: 4px 6px; margin-bottom: 2px;
        }
        .session-list {
          flex: 1; overflow-y: auto;
          display: flex; flex-direction: column; gap: 2px;
        }
        .session-list::-webkit-scrollbar { width: 3px; }
        .session-list::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08); border-radius: 10px;
        }
        .empty-sessions {
          font-size: 12.5px; color: rgba(255,255,255,0.18);
          text-align: center; padding: 24px 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .session-item {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 9px;
          cursor: pointer; transition: all 0.15s ease;
          color: rgba(255,255,255,0.5);
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          border: 1px solid transparent;
        }
        .session-item:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
        }
        .session-item.active {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.3);
          color: rgba(255,255,255,0.9);
        }
        .s-icon { flex-shrink: 0; opacity: 0.55; }
        .s-label {
          flex: 1; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }
        .del-btn {
          opacity: 0; background: none; border: none;
          color: rgba(255,255,255,0.35); cursor: pointer;
          padding: 2px; border-radius: 4px;
          display: flex; align-items: center;
          transition: all 0.15s ease; flex-shrink: 0;
        }
        .session-item:hover .del-btn { opacity: 1; }
        .del-btn:hover { color: #f87171; background: rgba(248,113,113,0.12); }

        .sidebar-footer {
          display: flex; align-items: center; gap: 7px;
          padding: 12px 6px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 8px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px rgba(74,222,128,0.7);
          flex-shrink: 0;
        }
        .model-name {
          font-size: 12px; font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.28);
        }
      `}</style>
    </aside>
  );
}