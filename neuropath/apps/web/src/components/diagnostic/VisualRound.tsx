"use client";

import { useState, useEffect } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props {
  questions:  DiagnosticQuestion[];
  onComplete: () => void;
}

export default function VisualRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question  = questions[index];
  const isLast    = index === questions.length - 1;
  const isCorrect = selected === question?.answer;
  const choices   = question?.choices ?? [];

  useEffect(() => {
    startQuestion();
    setSelected(null);
    setRevealed(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function handleSelect(choice: string) {
    if (revealed) return;
    setSelected(choice);
  }

  function handleCheck() {
    if (!selected || revealed) return;
    submitAnswer({
      question_id: question.id,
      method:      "visual",
      correct:     isCorrect,
      time_ms:     0,
      user_answer: selected,
    });
    setRevealed(true);
  }

  function handleNext() {
    if (isLast) { onComplete(); return; }
    setIndex(i => i + 1);
  }

  if (!question) return null;

  return (
    <>
      <style>{`
        .vr-wrap {
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .vr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vr-label { font-size: 12px; color: var(--whisper); letter-spacing: 0.04em; }

        /* Diagram placeholder */
        .vr-diagram {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 18px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          position: relative;
          overflow: hidden;
          min-height: 200px;
          justify-content: center;
        }
        .vr-diagram::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }

        /* Simple SVG diagram for photosynthesis context */
        .vr-svg-wrap {
          width: 100%;
          max-width: 340px;
        }
        .vr-svg-wrap svg {
          width: 100%;
          height: auto;
        }

        .vr-diagram-label {
          font-size: 11px;
          color: var(--whisper);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          text-align: center;
        }

        /* Question */
        .vr-question {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 19px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.45;
          letter-spacing: -0.01em;
          padding: 0 4px;
        }

        /* Choice grid — 2 cols */
        .vr-choices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }
        @media (max-width: 480px) {
          .vr-choices { grid-template-columns: 1fr; }
        }

        .vr-choice {
          padding: 13px 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: var(--soft);
          font-weight: 300;
          text-align: left;
          line-height: 1.4;
        }
        .vr-choice:hover:not(:disabled) {
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
          color: var(--text);
        }
        .vr-choice:disabled { cursor: default; }
        .vr-choice.selected { border-color: rgba(217,79,43,0.4); background: rgba(217,79,43,0.06); color: var(--text); }
        .vr-choice.correct  { border-color: rgba(34,197,94,0.5);  background: rgba(34,197,94,0.06);  color: #4ade80; }
        .vr-choice.wrong    { border-color: rgba(239,68,68,0.45); background: rgba(239,68,68,0.06);  color: #f87171; }

        .vr-explanation {
          padding: 14px 18px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          font-size: 13.5px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }
        .vr-explanation strong { color: var(--text); font-weight: 500; }

        .vr-actions { display: flex; gap: 10px; }
        .vr-check { flex: 1; justify-content: center; }
        .vr-check:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .vr-next  { flex: 1; justify-content: center; }
      `}</style>

      <div className="vr-wrap">
        {/* Header */}
        <div className="vr-header">
          <span className="vr-label">Question {index + 1} of {questions.length}</span>
          <span className="vr-label">{Math.round((index / questions.length) * 100)}% done</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(index / questions.length) * 100}%` }}/>
        </div>

        {/* Diagram */}
        <div className="vr-diagram">
          <p className="vr-diagram-label">Study the diagram</p>
          <div className="vr-svg-wrap">
            {/* Simple photosynthesis diagram */}
            <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Leaf shape */}
              <ellipse cx="160" cy="100" rx="90" ry="60" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
              {/* Midrib */}
              <line x1="160" y1="40" x2="160" y2="160" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" strokeDasharray="4 3"/>
              {/* Sun arrow */}
              <circle cx="50" cy="40" r="16" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5"/>
              <text x="50" y="44" textAnchor="middle" fill="rgba(251,191,36,0.8)" fontSize="12">☀</text>
              <line x1="72" y1="52" x2="105" y2="80" stroke="rgba(251,191,36,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
              {/* CO2 arrow */}
              <text x="16" y="115" fill="rgba(240,237,232,0.4)" fontSize="9">CO₂</text>
              <line x1="60" y1="112" x2="92" y2="105" stroke="rgba(240,237,232,0.25)" strokeWidth="1" strokeDasharray="3 2"/>
              {/* O2 arrow */}
              <line x1="228" y1="90" x2="262" y2="78" stroke="rgba(34,197,94,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
              <text x="265" y="82" fill="rgba(34,197,94,0.6)" fontSize="9">O₂</text>
              {/* Water arrow */}
              <line x1="160" y1="165" x2="160" y2="188" stroke="rgba(96,165,250,0.4)" strokeWidth="1" strokeDasharray="3 2"/>
              <text x="168" y="196" fill="rgba(96,165,250,0.5)" fontSize="9">H₂O</text>
              {/* Labels */}
              <text x="160" y="97" textAnchor="middle" fill="rgba(240,237,232,0.5)" fontSize="8">Chloroplast</text>
              <text x="160" y="108" textAnchor="middle" fill="rgba(240,237,232,0.3)" fontSize="7">(inside leaf)</text>
            </svg>
          </div>
        </div>

        {/* Question */}
        <p className="vr-question">{question.question}</p>

        {/* Choices */}
        <div className="vr-choices">
          {choices.map(c => {
            let cls = "";
            if (revealed) {
              if (c === question.answer)  cls = "correct";
              else if (c === selected)    cls = "wrong";
            } else if (c === selected)   cls = "selected";
            return (
              <button
                key={c}
                className={`vr-choice ${cls}`}
                onClick={() => handleSelect(c)}
                disabled={revealed}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && question.explanation && (
          <div className="vr-explanation">
            <strong>{isCorrect ? "Correct." : "Not quite."}</strong>{" "}
            {question.explanation}
          </div>
        )}

        {/* Actions */}
        <div className="vr-actions">
          {!revealed ? (
            <button
              className="btn-p vr-check"
              onClick={handleCheck}
              disabled={!selected}
            >
              Check answer
            </button>
          ) : (
            <button className="btn-p vr-next" onClick={handleNext}>
              {isLast ? "Finish round →" : "Next question →"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
