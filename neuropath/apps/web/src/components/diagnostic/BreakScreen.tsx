"use client";

import { useState, useEffect } from "react";

interface Props {
  onComplete: () => void;
}

const BREAK_SECONDS = 180; // 3 minutes

export default function BreakScreen({ onComplete }: Props) {
  const [seconds,  setSeconds]  = useState(BREAK_SECONDS);
  const [skipped,  setSkipped]  = useState(false);

  useEffect(() => {
    if (seconds <= 0) { onComplete(); return; }
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, onComplete]);

  const pct     = ((BREAK_SECONDS - seconds) / BREAK_SECONDS) * 100;
  const mins    = Math.floor(seconds / 60);
  const secs    = seconds % 60;
  const display = `${mins}:${String(secs).padStart(2, "0")}`;

  function handleSkip() {
    setSkipped(true);
    setTimeout(onComplete, 400);
  }

  return (
    <>
      <style>{`
        .brk-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 36px;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
          padding: 20px 0;
          animation: riseIn 0.6s ease both;
          opacity: ${skipped ? 0 : 1};
          transition: opacity 0.35s ease;
        }

        .brk-ring-wrap {
          position: relative;
          width: 180px;
          height: 180px;
          flex-shrink: 0;
        }
        .brk-ring-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .brk-ring-bg {
          fill: none;
          stroke: var(--edge);
          stroke-width: 4;
        }
        .brk-ring-fill {
          fill: none;
          stroke: var(--flame);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 502;
          stroke-dashoffset: ${502 - (502 * pct) / 100};
          transition: stroke-dashoffset 1s linear;
        }
        .brk-ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .brk-time {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .brk-time-label {
          font-size: 10px;
          color: var(--whisper);
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .brk-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .brk-heading em {
          font-style: italic;
          color: rgba(240,237,232,0.65);
        }

        .brk-sub {
          font-size: 15px;
          color: var(--soft);
          line-height: 1.7;
          font-weight: 300;
          max-width: 380px;
        }

        .brk-tips {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .brk-tip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 18px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 12px;
          text-align: left;
        }
        .brk-tip-icon {
          font-size: 18px;
          flex-shrink: 0;
        }
        .brk-tip-text {
          font-size: 13.5px;
          color: var(--soft);
          line-height: 1.5;
          font-weight: 300;
        }

        .brk-skip {
          background: none;
          border: 1px solid var(--edge);
          color: var(--whisper);
          font-size: 12.5px;
          padding: 8px 20px;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s, border-color 0.2s;
        }
        .brk-skip:hover { color: var(--soft); border-color: var(--edge2); }
      `}</style>

      <div className="brk-wrap">
        {/* Countdown ring */}
        <div className="brk-ring-wrap">
          <svg className="brk-ring-svg" viewBox="0 0 170 170">
            <circle className="brk-ring-bg" cx="85" cy="85" r="80"/>
            <circle className="brk-ring-fill" cx="85" cy="85" r="80"/>
          </svg>
          <div className="brk-ring-label">
            <span className="brk-time">{display}</span>
            <span className="brk-time-label">remaining</span>
          </div>
        </div>

        {/* Heading */}
        <div>
          <h2 className="brk-heading">
            Time to rest.<br/>
            <em>Your brain is consolidating.</em>
          </h2>
        </div>

        <p className="brk-sub">
          This 3-minute break is scientifically important. It clears your
          short-term memory so the recall test measures real learning — not
          what you just read 30 seconds ago.
        </p>

        {/* Tips */}
        <div className="brk-tips">
          {[
            { icon: "🧘", text: "Take a few slow breaths and let your mind wander." },
            { icon: "💧", text: "Grab a glass of water — hydration helps memory." },
            { icon: "🚶", text: "Stand up and stretch if you can." },
          ].map(t => (
            <div className="brk-tip" key={t.text}>
              <span className="brk-tip-icon">{t.icon}</span>
              <span className="brk-tip-text">{t.text}</span>
            </div>
          ))}
        </div>

        <button className="brk-skip" onClick={handleSkip}>
          Skip break (not recommended)
        </button>
      </div>
    </>
  );
}
