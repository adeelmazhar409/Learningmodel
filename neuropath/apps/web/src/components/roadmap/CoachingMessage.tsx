"use client";

import { useEffect } from "react";
import type { CoachingMessage as CoachingMessageType } from "@neuropath/types";

interface Props {
  message:   CoachingMessageType;
  onDismiss: () => void;
}

export default function CoachingMessage({ message, onDismiss }: Props) {
  /* Auto-dismiss after 6 seconds */
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  /* Dismiss on Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onDismiss]);

  return (
    <>
      <style>{`
        .cm-overlay {
          position: fixed;
          inset: 0;
          z-index: 700;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 24px;
          pointer-events: none;
        }

        .cm-card {
          width: 100%;
          max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--edge2);
          border-radius: 20px;
          padding: 24px 26px;
          pointer-events: all;
          position: relative;
          overflow: hidden;
          animation: cmSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
          box-shadow: 0 20px 60px rgba(0,0,0,0.55);
        }

        @keyframes cmSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top accent */
        .cm-card::before {
          content: '';
          position: absolute;
          top: -1px; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--flame), transparent);
        }

        /* Progress bar (auto-dismiss timer) */
        .cm-timer {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(to right, var(--flame), var(--ember));
          border-radius: 0 0 20px 20px;
          animation: cmTimer 6s linear forwards;
        }
        @keyframes cmTimer {
          from { width: 100%; }
          to   { width: 0%; }
        }

        .cm-inner {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .cm-icon {
          width: 38px; height: 38px;
          background: rgba(217,79,43,0.1);
          border: 1px solid rgba(217,79,43,0.22);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .cm-body { flex: 1; }
        .cm-heading {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 5px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .cm-text {
          font-size: 13.5px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }

        .cm-dismiss {
          position: absolute;
          top: 14px; right: 14px;
          width: 26px; height: 26px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--edge);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 13px;
          color: var(--whisper);
          transition: background 0.2s, color 0.2s;
          line-height: 1;
        }
        .cm-dismiss:hover { background: rgba(255,255,255,0.1); color: var(--text); }

        /* Trigger icon by trigger type */
        .cm-icon.task_complete::after { content: '✓'; }
        .cm-icon.streak::after        { content: '🔥'; }
        .cm-icon.behind::after        { content: '💪'; }
        .cm-icon.exam_soon::after     { content: '📅'; }
      `}</style>

      <div className="cm-overlay" onClick={onDismiss}>
        <div className="cm-card" onClick={e => e.stopPropagation()}>
          <div className="cm-timer"/>

          <button className="cm-dismiss" onClick={onDismiss} aria-label="Dismiss">✕</button>

          <div className="cm-inner">
            <div className={`cm-icon ${message.trigger}`}/>
            <div className="cm-body">
              <p className="cm-heading">{message.heading}</p>
              <p className="cm-text">{message.body}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
