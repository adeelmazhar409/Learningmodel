"use client";

import { useState } from "react";

interface Props {
  script: string;
  title:  string;
}

export default function TeachBackViewer({ script, title }: Props) {
  const [practiced, setPracticed] = useState(false);

  const paragraphs = script.split(/\n+/).filter(Boolean);

  return (
    <>
      <style>{`
        .tbv-wrap {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
        }

        /* Instruction banner */
        .tbv-banner {
          background: rgba(217,79,43,0.06);
          border: 1px solid rgba(217,79,43,0.18);
          border-radius: 16px;
          padding: 20px 22px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .tbv-banner-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
        .tbv-banner-body {}
        .tbv-banner-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 5px;
        }
        .tbv-banner-text {
          font-size: 13.5px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }

        /* Script */
        .tbv-script-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 20px;
          padding: 32px 30px;
          position: relative;
          overflow: hidden;
        }
        .tbv-script-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none; border-radius: inherit;
        }
        .tbv-script-label {
          font-size: 10.5px;
          color: var(--flame);
          letter-spacing: 1.6px;
          text-transform: uppercase;
          margin-bottom: 18px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tbv-script-label::before {
          content: '';
          display: block;
          width: 18px; height: 1px;
          background: var(--flame);
        }
        .tbv-script-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 18px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .tbv-paragraph {
          font-size: 15px;
          color: var(--soft);
          line-height: 1.8;
          font-weight: 300;
          margin-bottom: 14px;
        }
        .tbv-paragraph:last-child { margin-bottom: 0; }

        /* Tips */
        .tbv-tips {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tbv-tips-label {
          font-size: 11px;
          color: var(--whisper);
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .tbv-tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 11px 14px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 10px;
          font-size: 13px;
          color: var(--soft);
          font-weight: 300;
          line-height: 1.5;
        }
        .tbv-tip-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--flame);
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* Action */
        .tbv-action {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
        .tbv-practiced-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(34,197,94,0.07);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 100px;
          font-size: 13.5px;
          color: #4ade80;
          font-weight: 500;
          animation: riseIn 0.4s ease both;
        }
        .tbv-practiced-note {
          font-size: 12.5px;
          color: var(--whisper);
          text-align: center;
          line-height: 1.55;
          max-width: 380px;
        }
      `}</style>

      <div className="tbv-wrap">
        {/* Instruction */}
        <div className="tbv-banner">
          <span className="tbv-banner-icon">🎙</span>
          <div className="tbv-banner-body">
            <p className="tbv-banner-title">How to use the teach-back script</p>
            <p className="tbv-banner-text">
              Read this script aloud as if you&apos;re explaining it to a classmate.
              Don&apos;t just read — try to say it in your own words where you can.
              Teaching out loud is one of the most powerful ways to lock in understanding.
            </p>
          </div>
        </div>

        {/* Script */}
        <div className="tbv-script-card">
          <p className="tbv-script-label">Your teach-back script</p>
          <p className="tbv-script-title">{title}</p>
          {paragraphs.map((p, i) => (
            <p className="tbv-paragraph" key={i}>{p}</p>
          ))}
        </div>

        {/* Tips */}
        <div className="tbv-tips">
          <p className="tbv-tips-label">Tips for teaching back</p>
          {[
            "Close the script after reading it once, then try to explain without looking.",
            "Record yourself on your phone — listening back reveals gaps in your understanding.",
            "Use simple language. If you can't explain it simply, you don't fully understand it yet.",
          ].map(t => (
            <div className="tbv-tip" key={t}>
              <div className="tbv-tip-dot"/>
              <span>{t}</span>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="tbv-action">
          {!practiced ? (
            <button
              className="btn-p"
              style={{ width: "100%", maxWidth: 360, justifyContent: "center" }}
              onClick={() => setPracticed(true)}
            >
              Mark as practised
            </button>
          ) : (
            <>
              <div className="tbv-practiced-badge">
                ✓ &nbsp;Practised
              </div>
              <p className="tbv-practiced-note">
                Effort builds ability. Come back tomorrow and try explaining it again without the script.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
