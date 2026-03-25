"use client";

import { useState, useEffect } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props {
  questions:  DiagnosticQuestion[];
  onComplete: () => void;
}

const MIN_CHARS = 30;

export default function TeachBackRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [index,     setIndex]     = useState(0);
  const [response,  setResponse]  = useState("");
  const [revealed,  setRevealed]  = useState(false);
  const [selfScore, setSelfScore] = useState<"got_it" | "partial" | "missed" | null>(null);

  const question = questions[index];
  const isLast   = index === questions.length - 1;
  const canCheck = response.trim().length >= MIN_CHARS;

  useEffect(() => {
    startQuestion();
    setResponse("");
    setRevealed(false);
    setSelfScore(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function handleReveal() {
    if (!canCheck || revealed) return;
    setRevealed(true);
  }

  function handleRate(score: "got_it" | "partial" | "missed") {
    setSelfScore(score);
    const correct = score === "got_it" || score === "partial";
    submitAnswer({
      question_id: question.id,
      method:      "teach_back",
      correct,
      time_ms:     0,
      user_answer: response,
    });
  }

  function handleNext() {
    if (isLast) { onComplete(); return; }
    setIndex(i => i + 1);
  }

  if (!question) return null;

  const charCount  = response.trim().length;
  const hasEnough  = charCount >= MIN_CHARS;

  return (
    <>
      <style>{`
        .tb-wrap {
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
        }

        .tb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tb-label { font-size: 12px; color: var(--whisper); letter-spacing: 0.04em; }

        .tb-prompt-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 18px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }
        .tb-prompt-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none;
          border-radius: inherit;
        }
        .tb-prompt-eye {
          font-size: 10.5px;
          color: var(--flame);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .tb-prompt {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* Textarea */
        .tb-textarea-wrap { position: relative; }
        .tb-textarea {
          width: 100%;
          min-height: 140px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 14px;
          padding: 16px;
          font-size: 14.5px;
          font-weight: 300;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          line-height: 1.65;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tb-textarea::placeholder { color: var(--whisper); }
        .tb-textarea:focus {
          border-color: rgba(217,79,43,0.45);
          box-shadow: 0 0 0 3px rgba(217,79,43,0.07);
        }
        .tb-textarea:disabled {
          opacity: 0.7;
          cursor: default;
        }
        .tb-char-count {
          position: absolute;
          bottom: 10px;
          right: 14px;
          font-size: 11px;
          color: var(--whisper);
          pointer-events: none;
        }
        .tb-char-count.ready { color: var(--ember); }

        /* Model answer */
        .tb-model-answer {
          background: rgba(217,79,43,0.06);
          border: 1px solid rgba(217,79,43,0.2);
          border-radius: 14px;
          padding: 18px 20px;
        }
        .tb-model-label {
          font-size: 10.5px;
          color: var(--flame);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .tb-model-text {
          font-size: 14px;
          color: var(--soft);
          line-height: 1.7;
          font-weight: 300;
        }

        /* Self-rating */
        .tb-rating-label {
          font-size: 13px;
          color: var(--soft);
          font-weight: 300;
          text-align: center;
        }
        .tb-rating-btns {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 9px;
        }
        .tb-rate-btn {
          padding: 12px 10px;
          border-radius: 12px;
          border: 1px solid var(--edge);
          background: rgba(255,255,255,0.025);
          color: var(--soft);
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          text-align: center;
          line-height: 1.3;
        }
        .tb-rate-btn:hover { border-color: var(--edge2); background: rgba(255,255,255,0.04); color: var(--text); }
        .tb-rate-btn.got_it  { border-color: rgba(34,197,94,0.5);  background: rgba(34,197,94,0.07);  color: #4ade80; }
        .tb-rate-btn.partial { border-color: rgba(251,191,36,0.5);  background: rgba(251,191,36,0.07); color: #fbbf24; }
        .tb-rate-btn.missed  { border-color: rgba(239,68,68,0.45);  background: rgba(239,68,68,0.06);  color: #f87171; }

        .tb-actions { display: flex; }
        .tb-check { flex: 1; justify-content: center; }
        .tb-check:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .tb-next  { flex: 1; justify-content: center; }
      `}</style>

      <div className="tb-wrap">
        {/* Header */}
        <div className="tb-header">
          <span className="tb-label">Question {index + 1} of {questions.length}</span>
          <span className="tb-label">{Math.round((index / questions.length) * 100)}% done</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(index / questions.length) * 100}%` }}/>
        </div>

        {/* Prompt */}
        <div className="tb-prompt-card">
          <p className="tb-prompt-eye">Teach-back prompt</p>
          <p className="tb-prompt">{question.question}</p>
        </div>

        {/* Textarea */}
        <div className="tb-textarea-wrap">
          <textarea
            className="tb-textarea"
            placeholder="Write your explanation here — imagine you're teaching a classmate who has never heard of this topic before…"
            value={response}
            onChange={e => setResponse(e.target.value)}
            disabled={revealed}
          />
          <span className={`tb-char-count${hasEnough ? " ready" : ""}`}>
            {charCount}/{MIN_CHARS}
          </span>
        </div>

        {/* Model answer (after reveal) */}
        {revealed && (
          <>
            <div className="tb-model-answer">
              <p className="tb-model-label">Model answer</p>
              <p className="tb-model-text">{question.answer}</p>
            </div>

            {/* Self-rating */}
            {!selfScore && (
              <>
                <p className="tb-rating-label">
                  Compare your explanation to the model answer. How did you do?
                </p>
                <div className="tb-rating-btns">
                  <button className="tb-rate-btn" onClick={() => handleRate("got_it")}>
                    ✓ Got it
                  </button>
                  <button className="tb-rate-btn" onClick={() => handleRate("partial")}>
                    ~ Partially
                  </button>
                  <button className="tb-rate-btn" onClick={() => handleRate("missed")}>
                    ✗ Missed it
                  </button>
                </div>
              </>
            )}

            {/* After rating */}
            {selfScore && (
              <div className="tb-actions">
                <button className="btn-p tb-next" onClick={handleNext}>
                  {isLast ? "Finish round →" : "Next question →"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Check button */}
        {!revealed && (
          <div className="tb-actions">
            <button
              className="btn-p tb-check"
              onClick={handleReveal}
              disabled={!canCheck}
            >
              {canCheck ? "Reveal model answer" : `Write at least ${MIN_CHARS} characters to continue`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
