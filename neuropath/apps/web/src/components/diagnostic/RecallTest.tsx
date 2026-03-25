"use client";

import { useState, useEffect, useCallback } from "react";
import type { DiagnosticQuestion, DiagnosticAnswer } from "@neuropath/types";

interface Props {
  questions:  DiagnosticQuestion[];
  onComplete: (answers: DiagnosticAnswer[]) => void;
}

const TIME_PER_QUESTION = 25; // seconds

export default function RecallTest({ questions, onComplete }: Props) {
  const [index,      setIndex]      = useState(0);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [answers,    setAnswers]     = useState<DiagnosticAnswer[]>([]);
  const [timeLeft,   setTimeLeft]    = useState(TIME_PER_QUESTION);
  const [startedAt,  setStartedAt]   = useState(Date.now());
  const [submitting, setSubmitting]  = useState(false);

  const question = questions[index];
  const isLast   = index === questions.length - 1;
  const choices  = question?.choices ?? [];

  /* ── Auto-advance when timer hits zero ── */
  const advance = useCallback((forced = false) => {
    if (!question) return;
    const timeTaken = (Date.now() - startedAt);
    const answer: DiagnosticAnswer = {
      question_id: question.id,
      method:      question.method,
      correct:     forced ? false : selected === question.answer,
      time_ms:     timeTaken,
      user_answer: forced ? "" : (selected ?? ""),
    };
    const updated = [...answers, answer];
    setAnswers(updated);

    if (isLast || updated.length === questions.length) {
      setSubmitting(true);
      onComplete(updated);
      return;
    }
    setIndex(i => i + 1);
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
    setStartedAt(Date.now());
  }, [question, selected, answers, isLast, questions.length, startedAt, onComplete]);

  /* Countdown timer */
  useEffect(() => {
    if (submitting) return;
    if (timeLeft <= 0) { advance(true); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, advance, submitting]);

  if (!question || submitting) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>
          Calculating your results…
        </div>
        <div style={{ fontSize: 14, color: "var(--soft)", fontWeight: 300 }}>
          This takes just a moment.
        </div>
      </div>
    );
  }

  const timerPct  = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerWarn = timeLeft <= 8;

  return (
    <>
      <style>{`
        .rt-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
          animation: riseIn 0.4s ease both;
        }

        /* Top bar */
        .rt-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .rt-count {
          font-size: 12px;
          color: var(--whisper);
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .rt-timer {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .rt-timer-num {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          min-width: 28px;
          text-align: right;
          transition: color 0.3s;
        }
        .rt-timer-num.warn { color: var(--ember); }
        .rt-timer-bar {
          width: 80px;
          height: 4px;
          background: var(--edge);
          border-radius: 100px;
          overflow: hidden;
        }
        .rt-timer-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(to right, var(--flame), var(--ember));
          transition: width 1s linear;
        }
        .rt-timer-fill.warn {
          background: var(--ember);
        }

        /* Method tag */
        .rt-method-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          color: var(--flame);
          border: 1px solid rgba(217,79,43,0.22);
          border-radius: 100px;
          padding: 3px 11px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: rgba(217,79,43,0.05);
          font-weight: 500;
          align-self: flex-start;
        }

        /* Question card */
        .rt-q-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 18px;
          padding: 26px 28px;
          position: relative;
          overflow: hidden;
        }
        .rt-q-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }
        .rt-question {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 19px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.48;
          letter-spacing: -0.01em;
        }

        /* Choices */
        .rt-choices {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rt-choice {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 17px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          text-align: left;
        }
        .rt-choice:hover {
          border-color: var(--edge2);
          background: rgba(255,255,255,0.04);
        }
        .rt-choice.sel {
          border-color: rgba(217,79,43,0.45);
          background: rgba(217,79,43,0.07);
        }
        .rt-choice-letter {
          width: 25px; height: 25px;
          border-radius: 50%;
          border: 1px solid var(--edge2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--whisper);
          flex-shrink: 0;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
        }
        .rt-choice.sel .rt-choice-letter {
          background: rgba(217,79,43,0.2);
          border-color: rgba(217,79,43,0.5);
          color: var(--ember);
        }
        .rt-choice-text {
          font-size: 14px;
          color: var(--soft);
          line-height: 1.4;
          font-weight: 300;
          flex: 1;
        }
        .rt-choice.sel .rt-choice-text { color: var(--text); }

        /* Submit */
        .rt-submit {
          width: 100%;
          justify-content: center;
        }
        .rt-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Overall progress */
        .rt-overall {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .rt-overall-label { font-size: 11px; color: var(--whisper); white-space: nowrap; }
        .rt-overall-track {
          flex: 1;
          height: 3px;
          background: var(--edge);
          border-radius: 100px;
          overflow: hidden;
        }
        .rt-overall-fill {
          height: 100%;
          background: linear-gradient(to right, var(--flame), var(--ember));
          border-radius: 100px;
          transition: width 0.4s ease;
        }
      `}</style>

      <div className="rt-wrap">
        {/* Top bar */}
        <div className="rt-topbar">
          <span className="rt-count">
            Question {index + 1} / {questions.length}
          </span>
          <div className="rt-timer">
            <div className="rt-timer-bar">
              <div
                className={`rt-timer-fill${timerWarn ? " warn" : ""}`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <span className={`rt-timer-num${timerWarn ? " warn" : ""}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="rt-overall">
          <span className="rt-overall-label">Overall</span>
          <div className="rt-overall-track">
            <div
              className="rt-overall-fill"
              style={{ width: `${(index / questions.length) * 100}%` }}
            />
          </div>
          <span className="rt-overall-label">
            {Math.round((index / questions.length) * 100)}%
          </span>
        </div>

        {/* Method tag */}
        <span className="rt-method-tag">
          {question.method.replace("_", "-")}
        </span>

        {/* Question */}
        <div className="rt-q-card">
          <p className="rt-question">{question.question}</p>
        </div>

        {/* Choices */}
        <div className="rt-choices">
          {choices.map((c, i) => (
            <button
              key={c}
              className={`rt-choice${selected === c ? " sel" : ""}`}
              onClick={() => setSelected(c)}
            >
              <span className="rt-choice-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="rt-choice-text">{c}</span>
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          className="btn-p rt-submit"
          onClick={() => advance(false)}
          disabled={!selected}
        >
          {isLast ? "Submit answers" : "Next question →"}
        </button>
      </div>
    </>
  );
}
