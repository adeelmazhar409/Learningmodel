"use client";

import { useState } from "react";
import type { QuizQuestion } from "@neuropath/types";

interface Props {
  questions: QuizQuestion[];
}

export default function QuizViewer({ questions }: Props) {
  const [index,    setIndex]    = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const [answers,  setAnswers]  = useState<boolean[]>([]);

  const question  = questions[index];
  const isLast    = index === questions.length - 1;
  const isCorrect = selected === question?.answer;
  const choices   = question?.choices ?? [];

  function handleCheck() {
    if (!selected || revealed) return;
    const correct = isCorrect;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, correct]);
    setRevealed(true);
  }

  function handleNext() {
    if (isLast) { setDone(true); return; }
    setIndex(i => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
    setAnswers([]);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <>
        <style>{`
          .qv-result {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            max-width: 480px;
            margin: 0 auto;
            text-align: center;
            animation: riseIn 0.6s ease both;
          }
          .qv-score-ring {
            width: 120px; height: 120px;
            position: relative;
            flex-shrink: 0;
          }
          .qv-score-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
          .qv-ring-bg  { fill: none; stroke: var(--edge); stroke-width: 6; }
          .qv-ring-fill {
            fill: none;
            stroke: var(--flame);
            stroke-width: 6;
            stroke-linecap: round;
            stroke-dasharray: 283;
            stroke-dashoffset: ${283 - (283 * pct) / 100};
          }
          .qv-score-label {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .qv-score-num {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 600;
            color: var(--text);
            line-height: 1;
          }
          .qv-score-sub { font-size: 10px; color: var(--whisper); letter-spacing: 0.06em; }
          .qv-result-heading {
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            font-weight: 500;
            color: var(--text);
            margin-bottom: 4px;
          }
          .qv-result-sub {
            font-size: 14px;
            color: var(--soft);
            line-height: 1.65;
            font-weight: 300;
          }
          .qv-answer-review {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .qv-review-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            background: var(--surface);
            border: 1px solid var(--edge);
            border-radius: 10px;
            font-size: 13px;
            color: var(--soft);
            font-weight: 300;
            text-align: left;
          }
          .qv-review-icon { font-size: 14px; flex-shrink: 0; }
        `}</style>
        <div className="qv-result">
          <div className="qv-score-ring">
            <svg viewBox="0 0 100 100">
              <circle className="qv-ring-bg"   cx="50" cy="50" r="45"/>
              <circle className="qv-ring-fill" cx="50" cy="50" r="45"/>
            </svg>
            <div className="qv-score-label">
              <span className="qv-score-num">{score}/{questions.length}</span>
              <span className="qv-score-sub">{pct}%</span>
            </div>
          </div>

          <div>
            <p className="qv-result-heading">
              {pct >= 80 ? "Great work." : pct >= 50 ? "Good effort." : "Keep practising."}
            </p>
            <p className="qv-result-sub">
              {pct >= 80
                ? "Your understanding of this topic is solid."
                : "Review the questions you missed and try again."}
            </p>
          </div>

          <div className="qv-answer-review">
            {questions.map((q, i) => (
              <div className="qv-review-row" key={q.id}>
                <span className="qv-review-icon">{answers[i] ? "✓" : "✗"}</span>
                <span>{q.question}</span>
              </div>
            ))}
          </div>

          <button className="btn-p" style={{ width: "100%", justifyContent: "center" }} onClick={restart}>
            Retake quiz
          </button>
        </div>
      </>
    );
  }

  if (!question) return null;

  return (
    <>
      <style>{`
        .qv-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 580px;
          margin: 0 auto;
        }
        .qv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .qv-label { font-size: 12px; color: var(--whisper); letter-spacing: 0.04em; }
        .qv-q-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 18px;
          padding: 26px 28px;
          position: relative;
          overflow: hidden;
        }
        .qv-q-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none; border-radius: inherit;
        }
        .qv-question {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.5vw, 19px);
          font-weight: 500;
          color: var(--text);
          line-height: 1.48;
          letter-spacing: -0.01em;
        }
        .qv-choices { display: flex; flex-direction: column; gap: 9px; }
        .qv-choice {
          display: flex; align-items: center; gap: 13px;
          padding: 13px 17px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          font-family: 'DM Sans', sans-serif;
          width: 100%; text-align: left;
        }
        .qv-choice:hover:not(:disabled) { border-color: var(--edge2); background: rgba(255,255,255,0.04); }
        .qv-choice:disabled { cursor: default; }
        .qv-choice.sel     { border-color: rgba(217,79,43,0.4);  background: rgba(217,79,43,0.06); }
        .qv-choice.correct { border-color: rgba(34,197,94,0.5);  background: rgba(34,197,94,0.06); }
        .qv-choice.wrong   { border-color: rgba(239,68,68,0.45); background: rgba(239,68,68,0.06); }
        .qv-letter {
          width: 25px; height: 25px; border-radius: 50%;
          border: 1px solid var(--edge2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: var(--whisper); flex-shrink: 0;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
        }
        .qv-choice.sel     .qv-letter { background: rgba(217,79,43,0.2); border-color: rgba(217,79,43,0.5); color: var(--ember); }
        .qv-choice.correct .qv-letter { background: rgba(34,197,94,0.2);  border-color: rgba(34,197,94,0.5);  color: #4ade80; }
        .qv-choice.wrong   .qv-letter { background: rgba(239,68,68,0.2);  border-color: rgba(239,68,68,0.5);  color: #f87171; }
        .qv-choice-text { font-size: 14px; color: var(--soft); line-height: 1.4; font-weight: 300; flex: 1; }
        .qv-choice.sel .qv-choice-text,
        .qv-choice.correct .qv-choice-text,
        .qv-choice.wrong   .qv-choice-text { color: var(--text); }
        .qv-explanation {
          padding: 14px 18px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          font-size: 13.5px; color: var(--soft); line-height: 1.65; font-weight: 300;
        }
        .qv-explanation strong { color: var(--text); font-weight: 500; }
        .qv-actions { display: flex; gap: 10px; }
        .qv-check { flex: 1; justify-content: center; }
        .qv-check:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
        .qv-next { flex: 1; justify-content: center; }
      `}</style>

      <div className="qv-wrap">
        <div className="qv-header">
          <span className="qv-label">Question {index + 1} of {questions.length}</span>
          <span className="qv-label">Score: {score}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(index / questions.length) * 100}%` }}/>
        </div>

        <div className="qv-q-card">
          <p className="qv-question">{question.question}</p>
        </div>

        <div className="qv-choices">
          {choices.map((c, i) => {
            let cls = "";
            if (revealed) {
              if (c === question.answer) cls = "correct";
              else if (c === selected)  cls = "wrong";
            } else if (c === selected)  cls = "sel";
            return (
              <button key={c} className={`qv-choice ${cls}`} onClick={() => !revealed && setSelected(c)} disabled={revealed}>
                <span className="qv-letter">{String.fromCharCode(65 + i)}</span>
                <span className="qv-choice-text">{c}</span>
              </button>
            );
          })}
        </div>

        {revealed && question.explanation && (
          <div className="qv-explanation">
            <strong>{isCorrect ? "Correct." : "Not quite."}</strong>{" "}
            {question.explanation}
          </div>
        )}

        <div className="qv-actions">
          {!revealed
            ? <button className="btn-p qv-check" onClick={handleCheck} disabled={!selected}>Check answer</button>
            : <button className="btn-p qv-next"  onClick={handleNext}>{isLast ? "See results" : "Next →"}</button>
          }
        </div>
      </div>
    </>
  );
}
