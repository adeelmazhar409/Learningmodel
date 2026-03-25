"use client";

import { useState } from "react";
import type { Flashcard } from "@neuropath/types";

interface Props {
  flashcards: Flashcard[];
}

export default function FlashcardViewer({ flashcards }: Props) {
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known,   setKnown]   = useState<Set<number>>(new Set());

  const card   = flashcards[index];
  const isLast = index === flashcards.length - 1;
  const pct    = Math.round(((index + 1) / flashcards.length) * 100);

  function handleFlip() { setFlipped(f => !f); }

  function handleMark(correct: boolean) {
    if (correct) setKnown(k => new Set([...k, index]));
    goNext();
  }

  function goNext() {
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.min(i + 1, flashcards.length - 1)), 150);
  }

  function goPrev() {
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 150);
  }

  function restart() {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  }

  if (!card) return null;

  const allDone = index === flashcards.length - 1 && flipped;

  return (
    <>
      <style>{`
        .fcv-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 580px;
          margin: 0 auto;
        }

        /* Progress */
        .fcv-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .fcv-count { font-size: 12px; color: var(--whisper); letter-spacing: 0.04em; }
        .fcv-known {
          font-size: 12px;
          color: var(--ember);
          letter-spacing: 0.04em;
          font-weight: 500;
        }

        /* Difficulty badge */
        .fcv-diff {
          display: inline-flex;
          font-size: 10px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--flame);
          border: 1px solid rgba(217,79,43,0.22);
          border-radius: 100px;
          padding: 2px 10px;
          background: rgba(217,79,43,0.05);
          align-self: flex-start;
        }

        /* Flip card */
        .fcv-scene {
          width: 100%;
          height: 220px;
          perspective: 1000px;
          cursor: pointer;
        }
        .fcv-card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
          border-radius: 20px;
        }
        .fcv-card.flipped { transform: rotateY(180deg); }

        .fcv-face {
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
          gap: 10px;
        }
        .fcv-front {
          background: var(--surface);
          border: 1px solid var(--edge);
        }
        .fcv-back {
          background: rgba(217,79,43,0.07);
          border: 1px solid rgba(217,79,43,0.22);
          transform: rotateY(180deg);
        }

        .fcv-face-hint {
          font-size: 10.5px;
          color: var(--whisper);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .fcv-face-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(15px, 2.2vw, 19px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.45;
          letter-spacing: -0.01em;
        }
        .fcv-back .fcv-face-text {
          font-size: clamp(14px, 2vw, 17px);
          font-weight: 400;
          color: var(--text);
        }

        /* Rating */
        .fcv-rating {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .fcv-rate-wrong {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--edge);
          background: rgba(255,255,255,0.025);
          color: var(--soft);
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .fcv-rate-wrong:hover {
          border-color: rgba(239,68,68,0.4);
          background: rgba(239,68,68,0.06);
          color: #f87171;
        }
        .fcv-rate-right {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(217,79,43,0.25);
          background: rgba(217,79,43,0.07);
          color: var(--ember);
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .fcv-rate-right:hover {
          border-color: rgba(217,79,43,0.5);
          background: rgba(217,79,43,0.13);
        }

        /* Navigation */
        .fcv-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .fcv-nav-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--edge);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          color: var(--soft);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .fcv-nav-btn:hover:not(:disabled) {
          color: var(--text);
          border-color: var(--edge2);
          background: rgba(255,255,255,0.06);
        }
        .fcv-nav-btn:disabled { opacity: 0.3; cursor: default; }

        .fcv-flip-hint {
          font-size: 12px;
          color: var(--whisper);
          text-align: center;
        }

        /* Completion */
        .fcv-complete {
          text-align: center;
          padding: 28px;
          background: rgba(217,79,43,0.06);
          border: 1px solid rgba(217,79,43,0.2);
          border-radius: 18px;
          animation: riseIn 0.5s ease both;
        }
        .fcv-complete-icon { font-size: 32px; margin-bottom: 10px; }
        .fcv-complete-heading {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 6px;
        }
        .fcv-complete-sub {
          font-size: 13.5px;
          color: var(--soft);
          font-weight: 300;
          line-height: 1.55;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="fcv-wrap">
        {/* Top */}
        <div className="fcv-top">
          <span className="fcv-count">Card {index + 1} of {flashcards.length}</span>
          <span className="fcv-known">{known.size} known</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }}/>
        </div>

        {/* Difficulty */}
        <span className="fcv-diff">{card.difficulty}</span>

        {/* Card */}
        <div className="fcv-scene" onClick={handleFlip}>
          <div className={`fcv-card${flipped ? " flipped" : ""}`}>
            <div className="fcv-face fcv-front">
              <p className="fcv-face-hint">Question — tap to reveal</p>
              <p className="fcv-face-text">{card.question}</p>
            </div>
            <div className="fcv-face fcv-back">
              <p className="fcv-face-hint">Answer</p>
              <p className="fcv-face-text">{card.answer}</p>
            </div>
          </div>
        </div>

        {/* Rating (after flip) */}
        {flipped && !allDone && (
          <div className="fcv-rating">
            <button className="fcv-rate-wrong" onClick={() => handleMark(false)}>
              ✗ &nbsp;Didn&apos;t know
            </button>
            <button className="fcv-rate-right" onClick={() => handleMark(true)}>
              ✓ &nbsp;Got it
            </button>
          </div>
        )}

        {/* Completion banner */}
        {allDone && isLast && (
          <div className="fcv-complete">
            <div className="fcv-complete-icon">🎉</div>
            <p className="fcv-complete-heading">Round complete</p>
            <p className="fcv-complete-sub">
              You knew {known.size} of {flashcards.length} cards.
              {known.size < flashcards.length
                ? " Practice the ones you missed to strengthen them."
                : " Perfect score — great work."}
            </p>
            <button className="btn-p" style={{ margin: "0 auto" }} onClick={restart}>
              Restart deck
            </button>
          </div>
        )}

        {/* Navigation */}
        {!allDone && (
          <div className="fcv-nav">
            <button
              className="fcv-nav-btn"
              onClick={goPrev}
              disabled={index === 0}
            >
              ← Previous
            </button>
            {!flipped && (
              <p className="fcv-flip-hint">Tap card to flip</p>
            )}
            <button
              className="fcv-nav-btn"
              onClick={goNext}
              disabled={isLast}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
