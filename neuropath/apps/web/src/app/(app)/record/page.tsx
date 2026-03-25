"use client";

import { useState } from "react";
import { useRecordingStore } from "@/store/recording.store";
import AudioRecorder    from "@/components/recording/AudioRecorder";
import ProcessingStatus from "@/components/recording/ProcessingStatus";

export default function RecordPage() {
  const { phase, recordingId, reset } = useRecordingStore();
  const [title, setTitle] = useState("");
  const [started, setStarted] = useState(false);

  const isProcessing = phase === "processing" || phase === "uploading";
  const isReady      = phase === "ready";

  function handleStart() {
    if (!title.trim()) return;
    setStarted(true);
  }

  return (
    <>
      <style>{`
        .rec-page {
          max-width: 680px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .rec-header { margin-bottom: 40px; }
        .rec-eyebrow {
          font-size: 11px;
          color: var(--flame);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rec-eyebrow::before {
          content: '';
          display: block;
          width: 18px; height: 1px;
          background: var(--flame);
        }
        .rec-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 10px;
        }
        .rec-sub {
          font-size: 15px;
          color: var(--soft);
          line-height: 1.65;
          font-weight: 300;
        }

        /* Title step */
        .rec-title-step {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 520px;
        }
        .rec-title-note {
          font-size: 13px;
          color: var(--whisper);
          line-height: 1.55;
          font-weight: 300;
        }
        .rec-start-btn {
          align-self: flex-start;
        }
        .rec-start-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        /* Main card */
        .rec-card {
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 24px;
          padding: 36px 32px;
          position: relative;
          overflow: hidden;
        }
        .rec-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 55%);
          pointer-events: none; border-radius: inherit;
        }
        .rec-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .rec-card-sub {
          font-size: 13px;
          color: var(--soft);
          font-weight: 300;
          margin-bottom: 28px;
          line-height: 1.5;
        }

        /* Tips */
        .rec-tips {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 32px;
        }
        .rec-tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--edge);
          border-radius: 12px;
          font-size: 13px;
          color: var(--soft);
          line-height: 1.5;
          font-weight: 300;
        }
        .rec-tip-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--flame);
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* Reset */
        .rec-reset {
          margin-top: 20px;
          text-align: center;
        }
        .rec-reset-btn {
          background: none;
          border: 1px solid var(--edge);
          color: var(--whisper);
          font-size: 12px;
          padding: 7px 16px;
          border-radius: 100px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s, border-color 0.2s;
        }
        .rec-reset-btn:hover { color: var(--soft); border-color: var(--edge2); }

        @media (max-width: 640px) {
          .rec-page  { padding: 32px 18px 60px; }
          .rec-card  { padding: 26px 20px; }
          .rec-tips  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rec-page">
        <div className="rec-header">
          <p className="rec-eyebrow">Record</p>
          <h1 className="rec-heading">
            {!started ? "Name your lecture" : isProcessing || isReady ? "Processing…" : "Recording"}
          </h1>
          <p className="rec-sub">
            {!started
              ? "Give your lecture a name so you can find it later, then start recording."
              : "Your lecture is being transcribed and turned into a personalised study pack."
            }
          </p>
        </div>

        {/* Step 1 — title */}
        {!started && (
          <div className="rec-title-step">
            <div>
              <label className="label" htmlFor="lecture-title">Lecture name</label>
              <input
                id="lecture-title"
                className="input"
                type="text"
                placeholder="e.g. Biology — Photosynthesis"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleStart()}
                autoFocus
              />
            </div>
            <p className="rec-title-note">
              You can change this later. Be specific so you can find it in your study packs.
            </p>
            <button
              className="btn-p rec-start-btn"
              onClick={handleStart}
              disabled={!title.trim()}
            >
              Continue to recording →
            </button>
          </div>
        )}

        {/* Step 2 — recorder or processing */}
        {started && (
          <>
            <div className="rec-card">
              {!isProcessing && !isReady ? (
                <>
                  <p className="rec-card-title">{title}</p>
                  <p className="rec-card-sub">
                    Tap the button below to start. Speak clearly — the AI handles the rest.
                  </p>
                  <AudioRecorder
                    title={title}
                    onUploaded={() => {}}
                  />
                </>
              ) : (
                <ProcessingStatus recordingId={recordingId ?? ""} />
              )}
            </div>

            {/* Tips (only while idle/recording) */}
            {!isProcessing && !isReady && (
              <div className="rec-tips">
                {[
                  "Speak at a normal pace — don't rush.",
                  "Hold the phone close to the audio source.",
                  "You can record up to 60 minutes per session.",
                  "Background noise is handled automatically.",
                ].map(t => (
                  <div className="rec-tip" key={t}>
                    <div className="rec-tip-dot"/>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reset */}
            {!isProcessing && !isReady && (
              <div className="rec-reset">
                <button
                  className="rec-reset-btn"
                  onClick={() => { reset(); setStarted(false); setTitle(""); }}
                >
                  ← Change lecture name
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
