"use client";

type Personality = "funny" | "serious" | "angry";

interface PersonalitySelectorProps {
  active: Personality;
  onChange: (p: Personality) => void;
}

const pills: { key: Personality; emoji: string; label: string; color: string; glow: string; bg: string }[] = [
  { key: "funny",   emoji: "😄", label: "Funny",   color: "#fbbf24", glow: "rgba(251,191,36,0.3)",  bg: "rgba(251,191,36,0.12)" },
  { key: "serious", emoji: "🧐", label: "Serious", color: "#818cf8", glow: "rgba(129,140,248,0.3)", bg: "rgba(129,140,248,0.12)" },
  { key: "angry",   emoji: "😠", label: "Angry",   color: "#f87171", glow: "rgba(248,113,113,0.3)", bg: "rgba(248,113,113,0.12)" },
];

export default function PersonalitySelector({ active, onChange }: PersonalitySelectorProps) {
  return (
    <div className="selector">
      <span className="label">Personality</span>
      <div className="pills">
        {pills.map((p) => {
          const isActive = active === p.key;
          return (
            <button
              key={p.key}
              className={`pill ${isActive ? "active" : ""}`}
              onClick={() => onChange(p.key)}
              style={isActive ? ({
                "--c":  p.color,
                "--g":  p.glow,
                "--bg": p.bg,
              } as React.CSSProperties) : {}}
            >
              <span className="em">{p.emoji}</span>
              <span className="txt">{p.label}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .selector {
          display: flex; align-items: center; gap: 12px;
        }
        .label {
          font-size: 11px; font-family: 'DM Sans', sans-serif;
          font-weight: 700; color: rgba(255,255,255,0.28);
          letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
        }
        .pills { display: flex; gap: 7px; }

        .pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.42);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          cursor: pointer; transition: all 0.18s ease;
          white-space: nowrap;
        }
        .pill:hover {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.75);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }
        .pill.active {
          background: var(--bg) !important;
          border-color: var(--c) !important;
          color: var(--c) !important;
          box-shadow: 0 0 18px var(--g), inset 0 0 12px var(--g) !important;
          transform: translateY(-1px);
          font-weight: 700;
        }
        .em { font-size: 16px; line-height: 1; }
        .txt { letter-spacing: 0.01em; }
      `}</style>
    </div>
  );
}