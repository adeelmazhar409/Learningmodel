"use client";

import { useState } from "react";
import type { DiagnosticQuestion } from "@neuropath/types";
import { useDiagnosticStore } from "@/store/diagnostic.store";

interface Props {
  questions:  DiagnosticQuestion[];
  onComplete: () => void;
}

export default function FlashcardRound({ questions, onComplete }: Props) {
  const { submitAnswer, startQuestion } = useDiagnosticStore();

  const [index,    setIndex]    = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [answered, setAnswered] = useState(false);

  const question = questions[index];
  const isLast   = index === questions.length - 1;

  function handleFlip() {
    if (answered) return;
    if (!flipped) {
      setFlipped(true);
      startQuestion();
    }
  }

  function handleAnswer(correct: boolean) {
    if (answered) return;
    submitAnswer({
      question_id:  question.id,
      method:       "flashcards",
      correct,
      time_ms:      0,       // filled by store
      user_answer:  correct ? question.answer : "incorrect",
    });
    setAnswered(true);
  }

  function handleNext() {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex(i => i + 1);
    setFlipped(false);
    setAnswered(false);
  }

  if (!question) return null;

  return (
    <>
      <style>{`
        .fc-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
        }

        .fc-progress {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .fc-progress-label {
          font-size: 12px;
          color: var(--whisper);
          letter-spacing: 0.04em;
        }

        /* Card flip */
        .fc-scene {
          width: 100%;
          height: 240px;
          perspective: 900px;
          cursor: pointer;
        }
        .fc-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 20px;
        }
        .fc-card.flipped { transform: rotateY(180deg); }

        .fc-face {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px 32px;
          text-align: center;
        }
        .fc-front {
          background: var(--surface);
          border: 1px solid var(--edge);
        }
        .fc-back {
          background: rgba(217,79,43,0.08);
          border: 1px solid rgba(217,79,43,0.25);
          transform: rotateY(180deg);
        }
        .fc-face::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.022) 0%, transparent 55%);
          border-radius: inherit;
          pointer-events: none;
        }

        .fc-hint {
          font-size: 11px;
          color: var(--whisper);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .fc-question {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 20px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.45;
          letter-spacing: -0.01em;
        }
        .fc-answer {
          font-size: 17px;
          color: var(--text);
          line-height: 1.55;
          font-weight: 400;
        }

        /* Self-rating buttons */
        .fc-rating {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .fc-btn-wrong {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: var(--soft);
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .fc-btn-wrong:hover {
          background: rgba(255,255,255,0.06);
          border-color: var(--edge2);
          color: var(--text);
        }
        .fc-btn-correct {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(217,79,43,0.28);
          background: rgba(217,79,43,0.08);
          color: var(--ember);
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .fc-btn-correct:hover {
          background: rgba(217,79,43,0.14);
          border-color: rgba(217,79,43,0.45);
        }

        .fc-next {
          width: 100%;
          justify-content: center;
        }

        .fc-flip-hint {
          font-size: 12px;
          color: var(--whisper);
          text-align: center;
        }
      `}</style>

      <div className="fc-wrap">
        {/* Progress */}
        <div className="fc-progress">
          <span className="fc-progress-label">
            Card {index + 1} of {questions.length}
          </span>
          <span className="fc-progress-label">
            {Math.round(((index) / questions.length) * 100)}% done
          </span>
        </div>
        <div className="progress-track" style={{ width: "100%" }}>
          <div
            className="progress-fill"
            style={{ width: `${((index) / questions.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="fc-scene" onClick={handleFlip}>
          <div className={`fc-card${flipped ? " flipped" : ""}`}>
            <div className="fc-face fc-front">
              <p className="fc-hint">Question — tap to reveal</p>
              <p className="fc-question">{question.question}</p>
            </div>
            <div className="fc-face fc-back">
              <p className="fc-hint">Answer</p>
              <p className="fc-answer">{question.answer}</p>
            </div>
          </div>
        </div>

        {/* Rating (shown after flip) */}
        {flipped && !answered && (
          <div className="fc-rating">
            <button className="fc-btn-wrong"  onClick={() => handleAnswer(false)}>
              ✗ &nbsp;Didn&apos;t know
            </button>
            <button className="fc-btn-correct" onClick={() => handleAnswer(true)}>
              ✓ &nbsp;Got it
            </button>
          </div>
        )}

        {/* Next */}
        {answered && (
          <button className="btn-p fc-next" onClick={handleNext}>
            {isLast ? "Finish round →" : "Next card →"}
          </button>
        )}

        {!flipped && (
          <p className="fc-flip-hint">Tap the card to flip it</p>
        )}
      </div>
    </>
  );
}
