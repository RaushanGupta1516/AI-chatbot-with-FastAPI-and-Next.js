"use client";

interface MessageBubbleProps {
  role: "human" | "ai";
  content: string;
  personality?: "funny" | "serious" | "angry";
}

const personalityMeta = {
  funny:   { emoji: "😄", color: "#fbbf24", glow: "rgba(251,191,36,0.2)" },
  serious: { emoji: "🧐", color: "#818cf8", glow: "rgba(129,140,248,0.2)" },
  angry:   { emoji: "😠", color: "#f87171", glow: "rgba(248,113,113,0.2)" },
};

export default function MessageBubble({ role, content, personality = "serious" }: MessageBubbleProps) {
  const isAI = role === "ai";
  const meta = personalityMeta[personality];

  return (
    <div className={`bubble-row ${isAI ? "ai-row" : "human-row"}`}>
      {isAI && (
        <div className="avatar ai-avatar" style={{ borderColor: meta.color + "60", boxShadow: `0 0 12px ${meta.glow}` }}>
          <span style={{ fontSize: 17 }}>{meta.emoji}</span>
        </div>
      )}

      <div className={`bubble ${isAI ? "ai-bubble" : "human-bubble"}`}
        style={isAI ? { borderLeftColor: meta.color + "80" } : {}}>
        <p className="bubble-text">{content}</p>
      </div>

      {!isAI && (
        <div className="avatar user-avatar">U</div>
      )}

      <style jsx>{`
        .bubble-row {
          display: flex; align-items: flex-start; gap: 12px;
          max-width: 780px; width: 100%;
          animation: fadeSlideIn 0.22s ease forwards;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-row  { align-self: flex-start; }
        .human-row { align-self: flex-end; flex-direction: row-reverse; }

        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid; flex-shrink: 0; margin-top: 2px;
          display: flex; align-items: center; justify-content: center;
        }
        .ai-avatar {
          background: rgba(255,255,255,0.05);
        }
        .user-avatar {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: rgba(99,102,241,0.5);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          box-shadow: 0 0 10px rgba(99,102,241,0.35);
        }

        .bubble {
          padding: 13px 18px; border-radius: 18px; max-width: 640px;
          line-height: 1.7;
        }
        .ai-bubble {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-left: 3px solid;
          border-top-left-radius: 5px;
        }
        .human-bubble {
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2));
          border: 1px solid rgba(99,102,241,0.35);
          border-top-right-radius: 5px;
        }

        .bubble-text {
          margin: 0; font-size: 14.5px;
          color: rgba(255,255,255,0.92);
          font-family: ${isAI ? "'Lora', serif" : "'DM Sans', sans-serif"};
          font-weight: ${isAI ? "400" : "450"};
          white-space: pre-wrap; word-break: break-word;
          letter-spacing: ${isAI ? "0.005em" : "0"};
        }
      `}</style>
    </div>
  );
}