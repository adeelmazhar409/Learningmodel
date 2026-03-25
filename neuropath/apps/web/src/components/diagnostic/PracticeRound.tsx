"use client";

import { useState, useEffect } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props {
  questions:  DiagnosticQuestion[];
  onComplete: () => void;
}

export default function PracticeRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question = questions[index];
  const isLast   = index === questions.length - 1;
  const isCorrect = selected === question?.answer;

  /* Start timer when question mounts */
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
      method:      "practice",
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
  const choices = question.choices ?? [];

  return (
    <>
      <style>{`
        .pr-wrap {
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .pr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pr-label {
          font-size: 12px;
          color: var(--whisper);
          letter-spacing: 0.04em;
        }

        .pr-q-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 18px;
          padding: 28px 28px 24px;
          position: relative;
          overflow: hidden;
        }
        .pr-q-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }
        .pr-difficulty {
          font-size: 10.5px;
          color: var(--flame);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .pr-question {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.45;
          letter-spacing: -0.01em;
        }

        /* Choices */
        .pr-choices {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .pr-choice {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          text-align: left;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
        }
        .pr-choice:hover:not(:disabled) {
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
        }
        .pr-choice:disabled { cursor: default; }

        .pr-choice.selected {
          border-color: rgba(217,79,43,0.4);
          background: rgba(217,79,43,0.06);
        }
        .pr-choice.correct {
          border-color: rgba(34,197,94,0.5);
          background: rgba(34,197,94,0.06);
        }
        .pr-choice.wrong {
          border-color: rgba(239,68,68,0.45);
          background: rgba(239,68,68,0.06);
        }

        .pr-choice-letter {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 1px solid var(--edge2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--whisper);
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .pr-choice.selected  .pr-choice-letter { background: rgba(217,79,43,0.2); border-color: rgba(217,79,43,0.5); color: var(--ember); }
        .pr-choice.correct   .pr-choice-letter { background: rgba(34,197,94,0.2);  border-color: rgba(34,197,94,0.5);  color: #4ade80; }
        .pr-choice.wrong     .pr-choice-letter { background: rgba(239,68,68,0.2);  border-color: rgba(239,68,68,0.5);  color: #f87171; }

        .pr-choice-text {
          font-size: 14px;
          color: var(--soft);
          line-height: 1.45;
          font-weight: 300;
          flex: 1;
        }
        .pr-choice.selected .pr-choice-text,
        .pr-choice.correct  .pr-choice-text,
        .pr-choice.wrong    .pr-choice-text { color: var(--text); }

        /* Explanation */
        .pr-explanation {
          padding: 14px 18px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          font-size: 13.5px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }
        .pr-explanation strong {
          color: var(--text);
          font-weight: 500;
        }

        /* Actions */
        .pr-actions { display: flex; gap: 10px; }
        .pr-check { flex: 1; justify-content: center; }
        .pr-check:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .pr-next  { flex: 1; justify-content: center; }
      `}</style>

      <div className="pr-wrap">
        {/* Header */}
        <div className="pr-header">
          <span className="pr-label">Question {index + 1} of {questions.length}</span>
          <span className="pr-label">{Math.round((index / questions.length) * 100)}% done</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(index / questions.length) * 100}%` }}/>
        </div>

        {/* Question */}
        <div className="pr-q-card">
          <p className="pr-difficulty">{question.difficulty}</p>
          <p className="pr-question">{question.question}</p>
        </div>

        {/* Choices */}
        <div className="pr-choices">
          {choices.map((c, i) => {
            let cls = "";
            if (revealed) {
              if (c === question.answer)               cls = "correct";
              else if (c === selected)                 cls = "wrong";
            } else if (c === selected) {
              cls = "selected";
            }
            return (
              <button
                key={c}
                className={`pr-choice ${cls}`}
                onClick={() => handleSelect(c)}
                disabled={revealed}
              >
                <span className="pr-choice-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="pr-choice-text">{c}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && question.explanation && (
          <div className="pr-explanation">
            <strong>{isCorrect ? "Correct." : "Not quite."}</strong>{" "}
            {question.explanation}
          </div>
        )}

        {/* Actions */}
        <div className="pr-actions">
          {!revealed ? (
            <button
              className="btn-p pr-check"
              onClick={handleCheck}
              disabled={!selected}
            >
              Check answer
            </button>
          ) : (
            <button className="btn-p pr-next" onClick={handleNext}>
              {isLast ? "Finish round →" : "Next question →"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
