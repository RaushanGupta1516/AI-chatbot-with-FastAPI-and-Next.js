"use client";

import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface InputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function InputBar({ value, onChange, onSend, isLoading }: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSend();
    }
  };

  const canSend = !isLoading && value.trim().length > 0;

  return (
    <div className="wrapper">
      <div className={`bar ${isLoading ? "dimmed" : ""} ${canSend ? "has-text" : ""}`}>
        <textarea
          ref={textareaRef}
          className="textarea"
          placeholder="Message the AI…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
        />
        <button
          className={`send ${canSend ? "ready" : ""}`}
          onClick={onSend}
          disabled={!canSend}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
      <p className="hint">Enter to send · Shift+Enter for new line</p>

      <style jsx>{`
        .wrapper {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          width: 100%; max-width: 780px; margin: 0 auto;
        }
        .bar {
          display: flex; align-items: flex-end; gap: 10px;
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 12px 12px 12px 18px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .bar:focus-within {
          border-color: rgba(99,102,241,0.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .bar.has-text {
          border-color: rgba(99,102,241,0.35);
        }
        .bar.dimmed { opacity: 0.55; pointer-events: none; }

        .textarea {
          flex: 1; background: none; border: none; outline: none;
          resize: none;
          color: rgba(255,255,255,0.92);
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; line-height: 1.6;
          min-height: 24px; max-height: 160px;
          overflow-y: auto;
          caret-color: #818cf8;
        }
        .textarea::placeholder { color: rgba(255,255,255,0.22); }
        .textarea::-webkit-scrollbar { width: 3px; }
        .textarea::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1); border-radius: 10px;
        }

        .send {
          width: 36px; height: 36px; border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: not-allowed; flex-shrink: 0;
          transition: all 0.18s ease;
        }
        .send.ready {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-color: transparent;
          color: #fff; cursor: pointer;
          box-shadow: 0 0 16px rgba(99,102,241,0.45);
        }
        .send.ready:hover {
          box-shadow: 0 0 24px rgba(99,102,241,0.65);
          transform: scale(1.07);
        }

        .hint {
          font-size: 11px; font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.15); margin: 0;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}