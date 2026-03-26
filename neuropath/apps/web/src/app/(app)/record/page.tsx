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
    <div className="max-w-[680px] mx-auto px-6 pt-12 pb-20">
      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow">Record</p>
        <h1 className="font-serif text-[clamp(26px,4vw,38px)] font-medium text-text tracking-[-0.02em] leading-tight mb-2.5">
          {!started ? "Name your lecture" : isProcessing || isReady ? "Processing…" : "Recording"}
        </h1>
        <p className="text-[15px] text-soft font-light leading-relaxed">
          {!started
            ? "Give your lecture a name so you can find it later, then start recording."
            : "Your lecture is being transcribed and turned into a personalised study pack."
          }
        </p>
      </div>

      {/* Step 1 — title */}
      {!started && (
        <div className="flex flex-col gap-5 max-w-[520px]">
          <div>
            <label
              className="block text-[11px] font-medium text-soft tracking-[0.04em] uppercase mb-2"
              htmlFor="lecture-title"
            >
              Lecture name
            </label>
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
          <p className="text-xs text-whisper leading-relaxed">
            You can change this later. Be specific so you can find it in your study packs.
          </p>
          <button
            className="btn-primary self-start"
            onClick={handleStart}
            disabled={!title.trim()}
          >
            Continue
            <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Step 2 — Recording */}
      {started && !isReady && (
        <div className="bg-surface border border-edge rounded-lg p-8 max-w-[520px] relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-[rgba(255,255,255,0.018)] after:to-transparent after:pointer-events-none after:rounded-[inherit]">
          <AudioRecorder
            title={title}
            onUploaded={(id) => { /* handled by store */ }}
          />
        </div>
      )}

      {/* Step 3 — Processing status */}
      {isProcessing && recordingId && (
        <ProcessingStatus recordingId={recordingId} />
      )}

      {/* Tips */}
      {started && !isProcessing && !isReady && (
        <div className="grid grid-cols-2 gap-2.5 mt-8 max-sm:grid-cols-1">
          {[
            "Speak clearly and at a normal pace",
            "Minimise background noise if possible",
            "It's okay if it's not perfect — AI adapts",
            "Longer recordings = richer study packs",
          ].map(tip => (
            <div key={tip} className="flex items-start gap-2.5 p-3.5 bg-[rgba(255,255,255,0.025)] border border-edge rounded-xl text-[13px] text-soft leading-normal font-light">
              <span className="w-[5px] h-[5px] rounded-full bg-flame shrink-0 mt-1.5" />
              {tip}
            </div>
          ))}
        </div>
      )}

      {/* Reset */}
      {(started || isReady) && (
        <div className="mt-5 text-center">
          <button
            className="bg-transparent border border-edge text-whisper text-xs px-4 py-[7px] rounded-pill cursor-pointer font-sans transition-all hover:text-soft hover:border-edge-2"
            onClick={() => { reset(); setStarted(false); setTitle(""); }}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
