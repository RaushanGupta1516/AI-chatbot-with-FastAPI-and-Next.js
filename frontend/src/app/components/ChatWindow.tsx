"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Sidebar from "./Sidebar";
import MessageBubble from "./MessageBubble";
import PersonalitySelector from "./PersonalitySelector";
import InputBar from "./InputBar";

type Personality = "funny" | "serious" | "angry";

interface Message {
  role: "human" | "ai";
  content: string;
}

interface Session {
  id: string;
  label: string;
  messages: Message[];
  personality: Personality;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function ThinkingDots() {
  return (
    <div className="thinking-row">
      <div className="thinking-avatar">✦</div>
      <div className="thinking-bubble">
        <span className="dot" style={{ animationDelay: "0ms" }} />
        <span className="dot" style={{ animationDelay: "160ms" }} />
        <span className="dot" style={{ animationDelay: "320ms" }} />
      </div>
      <style jsx>{`
        .thinking-row {
          display: flex; align-items: center; gap: 12px;
          align-self: flex-start;
          animation: fadeSlideIn 0.2s ease forwards;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .thinking-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid rgba(167,139,250,0.5);
          background: rgba(167,139,250,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: #a78bfa; flex-shrink: 0;
        }
        .thinking-bubble {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-top-left-radius: 4px; border-radius: 16px;
          padding: 14px 18px;
          display: flex; align-items: center; gap: 5px;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a78bfa; display: inline-block;
          animation: wave 1.1s ease-in-out infinite;
        }
        @keyframes wave {
          0%,80%,100% { transform: translateY(0); opacity: 0.4; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function EmptyState({ personality }: { personality: Personality }) {
  const meta = {
    funny:   { emoji: "😄", text: "Ready to crack some jokes!", c1: "#fbbf24" },
    serious: { emoji: "🧐", text: "Ask me anything, I'll be direct.", c1: "#818cf8" },
    angry:   { emoji: "😠", text: "Fine. What do you want.", c1: "#f87171" },
  };
  const m = meta[personality];
  return (
    <div className="empty-state">
      <div className="glow-bg" style={{ background: `radial-gradient(circle, ${m.c1}18 0%, transparent 65%)` }} />
      <div className="empty-icon" style={{ borderColor: m.c1 + "55", boxShadow: `0 0 30px ${m.c1}30` }}>
        {m.emoji}
      </div>
      <h2 className="empty-title">AI Personality Chatbot</h2>
      <p className="empty-sub" style={{ color: m.c1 }}>{m.text}</p>
      <p className="empty-hint">Pick a personality above and start chatting</p>
      <style jsx>{`
        .empty-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          flex: 1; gap: 14px; padding: 40px 20px;
          text-align: center; position: relative;
        }
        .glow-bg {
          position: absolute; width: 420px; height: 420px;
          border-radius: 50%; pointer-events: none;
          top: 50%; left: 50%; transform: translate(-50%,-50%);
        }
        .empty-icon {
          font-size: 52px; width: 92px; height: 92px;
          border-radius: 26px; border: 1.5px solid;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          margin-bottom: 8px; position: relative; z-index: 1;
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.05); }
        }
        .empty-title {
          font-size: 26px; font-family:'DM Sans',sans-serif;
          font-weight: 700; color: rgba(255,255,255,0.9);
          margin: 0; letter-spacing: -0.03em; position: relative; z-index:1;
        }
        .empty-sub {
          font-size: 15px; font-family:'Lora',serif;
          font-style: italic; margin: 0; position: relative; z-index:1;
        }
        .empty-hint {
          font-size: 12.5px; font-family:'DM Sans',sans-serif;
          color: rgba(255,255,255,0.22); margin: 0; position: relative; z-index:1;
        }
      `}</style>
    </div>
  );
}

export default function ChatWindow() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isLoading]);

  const createNewSession = () => {
    const id = uuidv4();
    setSessions((prev) => [{ id, label: "New Chat", messages: [], personality: "serious" }, ...prev]);
    setActiveSessionId(id);
    setInput("");
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const setPersonality = (personality: Personality) => {
    if (!activeSessionId) return;
    setSessions((prev) => prev.map((s) => s.id === activeSessionId ? { ...s, personality } : s));
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = { role: "human", content: input.trim() };
    const currentPersonality = activeSession?.personality ?? "serious";

    setSessions((prev) => prev.map((s) => {
      if (s.id !== activeSessionId) return s;
      const isFirst = s.messages.length === 0;
      return {
        ...s,
        messages: [...s.messages, userMessage],
        label: isFirst ? input.trim().slice(0, 30) + (input.trim().length > 30 ? "…" : "") : s.label,
      };
    }));
    setInput("");
    setIsLoading(true);

    try {
      const history = activeSession?.messages.map((m) => ({ role: m.role, content: m.content })) ?? [];

      const response = await axios.post(`${API_BASE}/chat`, {
        session_id: activeSessionId,
        message: userMessage.content,
        personality: currentPersonality,
        history,
      });

      // ✅ FIXED: handles string response OR JSON object with any common key
      const replyText =
        typeof response.data === "string"
          ? response.data
          : response.data.response ??
            response.data.message ??
            response.data.reply ??
            response.data.content ??
            JSON.stringify(response.data);

      setSessions((prev) => prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, { role: "ai", content: replyText }] }
          : s
      ));
    } catch (err) {
      setSessions((prev) => prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, { role: "ai", content: "⚠️ Could not reach the backend. Is FastAPI running on port 8000?" }] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        sessions={sessions.map((s) => ({ id: s.id, label: s.label }))}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => { setActiveSessionId(id); setInput(""); }}
        onNewChat={createNewSession}
        onDeleteSession={deleteSession}
      />

      <main className="chat-main">
        <header className="chat-header">
          <div className="header-left">
            <div className="header-logo">✦</div>
            <span className="header-title">
              {activeSession ? activeSession.label : "AI Personality Chatbot"}
            </span>
          </div>
          {activeSession && (
            <PersonalitySelector active={activeSession.personality} onChange={setPersonality} />
          )}
        </header>

        <div className="messages-area">
          {!activeSession ? (
            <div className="no-chat">
              <div className="no-chat-icon">💬</div>
              <p>Create a new chat to begin</p>
            </div>
          ) : activeSession.messages.length === 0 ? (
            <EmptyState personality={activeSession.personality} />
          ) : (
            <div className="messages-list">
              {activeSession.messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  personality={activeSession.personality}
                />
              ))}
              {isLoading && <ThinkingDots />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {activeSession && (
          <div className="input-area">
            <InputBar value={input} onChange={setInput} onSend={sendMessage} isLoading={isLoading} />
          </div>
        )}
      </main>

      <style jsx>{`
        .app-shell {
          display: flex; height: 100vh; width: 100vw;
          background: #13131a; overflow: hidden;
        }
        .chat-main {
          flex: 1; display: flex; flex-direction: column;
          overflow: hidden; min-width: 0;
        }
        .chat-header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(19,19,26,0.97);
          backdrop-filter: blur(16px);
          gap: 16px; flex-shrink: 0;
        }
        .header-left {
          display: flex; align-items: center; gap: 10px; min-width: 0;
        }
        .header-logo {
          font-size: 18px; color: #a78bfa;
          filter: drop-shadow(0 0 8px #a78bfa99);
        }
        .header-title {
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          font-weight: 600; color: rgba(255,255,255,0.85);
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; max-width: 300px;
          letter-spacing: -0.01em;
        }
        .messages-area {
          flex: 1; overflow-y: auto;
          display: flex; flex-direction: column;
          padding: 28px 24px;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08); border-radius: 10px;
        }
        .messages-list {
          display: flex; flex-direction: column; gap: 20px;
          max-width: 780px; width: 100%; margin: 0 auto;
        }
        .no-chat {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          flex: 1; gap: 12px;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
        }
        .no-chat-icon { font-size: 36px; opacity: 0.3; }
        .input-area {
          padding: 16px 24px 22px;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(19,19,26,0.95);
          backdrop-filter: blur(12px); flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}