"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LearningProfile } from "@neuropath/types";
import type { DiagnosticScores } from "@neuropath/types";

interface Props {
  profile: LearningProfile;
  scores:  DiagnosticScores;
}

const METHOD_META: Record<keyof LearningProfile, { label: string; desc: string; color: string }> = {
  practice: {
    label: "Practice Problems",
    desc:  "You learn best by applying knowledge to real questions. Your brain locks in understanding through doing.",
    color: "rgba(217,79,43,1)",
  },
  teach_back: {
    label: "Teach-Back",
    desc:  "Explaining ideas out loud or in writing solidifies your understanding. Teaching is how you master.",
    color: "rgba(217,79,43,0.75)",
  },
  flashcards: {
    label: "Active Recall",
    desc:  "Question-and-answer repetition helps you retrieve facts quickly under pressure.",
    color: "rgba(217,79,43,0.5)",
  },
  visual: {
    label: "Visual Mapping",
    desc:  "Diagrams and spatial relationships help you see how concepts connect.",
    color: "rgba(217,79,43,0.3)",
  },
};

export default function ProfileResult({ profile, scores }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* Sort methods by weight descending */
  const sorted = (Object.keys(profile) as Array<keyof LearningProfile>)
    .sort((a, b) => profile[b] - profile[a]);

  const primary   = sorted[0];
  const secondary = sorted[1];

  return (
    <>
      <style>{`
        .pr-wrap {
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          animation: riseIn 0.7s ease both;
        }

        /* Header */
        .pr-head {
          text-align: center;
        }
        .pr-eyebrow {
          font-size: 11px;
          color: var(--flame);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .pr-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .pr-heading em {
          font-style: italic;
          color: rgba(240,237,232,0.65);
        }
        .pr-sub {
          font-size: 14.5px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }

        /* Primary badge */
        .pr-primary-badge {
          background: rgba(217,79,43,0.08);
          border: 1px solid rgba(217,79,43,0.25);
          border-radius: 18px;
          padding: 22px 26px;
          position: relative;
          overflow: hidden;
        }
        .pr-primary-badge::before {
          content: '';
          position: absolute;
          top: -1px; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--flame), transparent);
        }
        .pr-badge-label {
          font-size: 10.5px;
          color: var(--flame);
          letter-spacing: 1.6px;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .pr-badge-method {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .pr-badge-desc {
          font-size: 14px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }

        /* Bar chart */
        .pr-bars {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pr-bar-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .pr-bar-label {
          font-size: 13px;
          color: var(--soft);
          font-weight: 300;
          width: 130px;
          flex-shrink: 0;
          text-align: right;
        }
        .pr-bar-track {
          flex: 1;
          height: 8px;
          background: var(--edge);
          border-radius: 100px;
          overflow: hidden;
        }
        .pr-bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        .pr-bar-pct {
          font-size: 13px;
          color: var(--whisper);
          width: 36px;
          text-align: right;
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
        }

        /* Score breakdown */
        .pr-scores-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .pr-score-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 14px;
          padding: 16px 18px;
        }
        .pr-score-method {
          font-size: 11px;
          color: var(--whisper);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .pr-score-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .pr-score-metric { font-size: 12px; color: var(--soft); font-weight: 300; }
        .pr-score-val    { font-size: 12px; color: var(--text); font-weight: 500; }

        /* Actions */
        .pr-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pr-note {
          font-size: 12px;
          color: var(--whisper);
          text-align: center;
          line-height: 1.5;
        }
      `}</style>

      <div className="pr-wrap">
        {/* Header */}
        <div className="pr-head">
          <p className="pr-eyebrow">Diagnostic complete</p>
          <h1 className="pr-heading">
            Your learning profile<br/>
            <em>has been revealed.</em>
          </h1>
          <p className="pr-sub">
            Based on your actual performance — not guesswork — here is how
            your brain learns best. Every study pack from now on will reflect this.
          </p>
        </div>

        {/* Primary method badge */}
        <div className="pr-primary-badge">
          <p className="pr-badge-label">Your primary learning method</p>
          <p className="pr-badge-method">{METHOD_META[primary].label}</p>
          <p className="pr-badge-desc">{METHOD_META[primary].desc}</p>
        </div>

        {/* Bar chart */}
        <div className="pr-bars">
          {sorted.map(m => (
            <div className="pr-bar-row" key={m}>
              <span className="pr-bar-label">{METHOD_META[m].label}</span>
              <div className="pr-bar-track">
                <div
                  className="pr-bar-fill"
                  style={{
                    width:      animated ? `${Math.round(profile[m] * 100)}%` : "0%",
                    background: METHOD_META[m].color,
                  }}
                />
              </div>
              <span className="pr-bar-pct">{Math.round(profile[m] * 100)}%</span>
            </div>
          ))}
        </div>

        {/* Score cards */}
        <div className="pr-scores-grid">
          {sorted.map(m => (
            <div className="pr-score-card" key={m}>
              <p className="pr-score-method">{METHOD_META[m].label}</p>
              {[
                { label: "Accuracy",  val: `${Math.round(scores[m].accuracy)}%`  },
                { label: "Speed",     val: `${Math.round(scores[m].speed)}%`     },
                { label: "Retention", val: `${Math.round(scores[m].retention)}%` },
              ].map(r => (
                <div className="pr-score-row" key={r.label}>
                  <span className="pr-score-metric">{r.label}</span>
                  <span className="pr-score-val">{r.val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pr-actions">
          <Link href="/record" className="btn-p" style={{ justifyContent: "center" }}>
            Record your first lecture →
          </Link>
          <Link href="/dashboard" className="btn-o" style={{ justifyContent: "center" }}>
            Go to dashboard
          </Link>
        </div>

        <p className="pr-note">
          Your secondary method is <strong style={{ color: "var(--soft)" }}>{METHOD_META[secondary].label}</strong>.
          Both methods are prioritised in every study pack we generate for you.
        </p>
      </div>
    </>
  );
}
