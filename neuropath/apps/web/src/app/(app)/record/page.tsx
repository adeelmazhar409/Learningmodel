"use client";

import { useState } from "react";
import { useRecordingStore  } from "../../../store/recording.store";
import AudioRecorder from "../../../components/recording/AudioRecorder";
import ProcessingStatus from "../../../components/recording/ProcessingStatus";

/* ── SVG Icons ── */
function IcMic({ s = 16 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}
function IcChevRight({ s = 14 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IcRefresh({ s = 13 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
function IcCheck({ s = 12 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ── Step Indicator ── */
function StepBar({ step }: { step: 0 | 1 | 2 }) {
  const steps = ["Name", "Record", "Process"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={[
                "w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-semibold transition-all duration-300 shrink-0",
                i < step
                  ? "bg-flame text-white"
                  : i === step
                    ? "bg-gradient-to-br from-ember to-flame text-white shadow-[0_0_10px_rgba(217,79,43,0.4)]"
                    : "bg-lift border border-edge text-whisper",
              ].join(" ")}
            >
              {i < step ? <IcCheck /> : i + 1}
            </div>
            <span
              className={`text-[11px] sm:text-[12px] font-semibold tracking-[0.02em] ${
                i === step
                  ? "text-text"
                  : i < step
                    ? "text-soft"
                    : "text-whisper"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-6 sm:w-10 h-px transition-all duration-500 ${
                i < step ? "bg-flame" : "bg-edge"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Tip Card ── */
function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-3 bg-surface border border-edge rounded-xl">
      <div className="w-1.5 h-1.5 rounded-full bg-flame shrink-0 mt-[6px]" />
      <p className="text-[12px] sm:text-[12.5px] text-soft font-light leading-relaxed">
        {text}
      </p>
    </div>
  );
}

/* ── Page ── */
export default function RecordPage() {
  const { phase, recordingId, reset } = useRecordingStore();
  const [title, setTitle] = useState("");
  const [started, setStarted] = useState(false);

  const isProcessing = phase === "uploading" || phase === "processing";
  const isReady = phase === "ready";

  const step: 0 | 1 | 2 = !started ? 0 : isProcessing || isReady ? 2 : 1;

  function handleStart() {
    if (title.trim()) setStarted(true);
  }

  const suggestions = [
    "Biology — Photosynthesis",
    "Chemistry — Atomic Structure",
    "History — World War II",
    "Physics — Newton's Laws",
  ];

  return (
    <div className="min-h-screen bg-ink">
      {/* ambient glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[440px] h-[280px] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.07)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[860px] mx-auto px-4 sm:px-6 pt-6 pb-28">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* ── LEFT: main content ── */}
          <div className="flex-1 min-w-0">
            {/* eyebrow */}
            <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-4">
              <span className="w-4 h-px bg-flame" />
              Record
            </p>

            {/* step bar */}
            <StepBar step={step} />

            {/* heading */}
            <div className="mb-7">
              <h1 className="font-serif text-[clamp(22px,5vw,38px)] font-medium text-text tracking-[-0.03em] leading-tight mb-2.5">
                {!started
                  ? "Name your lecture"
                  : isProcessing || isReady
                    ? "Building your study pack…"
                    : "Recording in progress"}
              </h1>
              <p className="text-[13px] sm:text-[14px] text-soft font-light leading-relaxed max-w-[420px]">
                {!started
                  ? "Give your lecture a name so you can find it later, then start recording."
                  : isProcessing || isReady
                    ? "Sit tight — we're transcribing and building your personalised study pack."
                    : "Speak clearly and at a normal pace. We'll handle the rest."}
              </p>
            </div>

            {/* ── STEP 1: name input ── */}
            {!started && (
              <div className="max-w-[520px]">
                <div className="mb-5">
                  <label
                    htmlFor="lecture-title"
                    className="block text-[10.5px] font-semibold text-soft tracking-[0.08em] uppercase mb-2"
                  >
                    Lecture name
                  </label>
                  <input
                    id="lecture-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStart()}
                    placeholder="e.g. Biology — Photosynthesis"
                    autoFocus
                    className="w-full bg-surface border border-edge rounded-xl px-4 py-3.5 text-[14px] text-text outline-none font-sans placeholder:text-whisper focus:border-[rgba(217,79,43,0.5)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.09)] transition-all duration-200"
                  />
                  <p className="text-[11px] text-whisper mt-2 font-light">
                    Press Enter or tap Continue to start recording.
                  </p>
                </div>

                {/* quick suggestions */}
                <div className="mb-7">
                  <p className="text-[10px] text-whisper tracking-[0.06em] uppercase font-semibold mb-2.5">
                    Quick pick
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setTitle(s)}
                        className="px-3 py-1.5 rounded-full bg-lift border border-edge text-[11.5px] text-soft hover:border-edge-2 hover:text-text transition-all duration-150 cursor-pointer font-sans"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!title.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[13.5px] font-semibold transition-all duration-200 cursor-pointer border-none bg-gradient-to-br from-ember to-flame text-white shadow-[0_4px_24px_rgba(217,79,43,0.35)] hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <IcMic s={14} />
                  Continue to recording
                  <IcChevRight />
                </button>
              </div>
            )}

            {/* ── STEP 2: recorder ── */}
            {started && !isProcessing && !isReady && (
              <div className="max-w-[520px]">
                {/* lecture badge */}
                <div className="flex items-center gap-2.5 mb-5 px-3.5 py-2.5 bg-surface border border-edge rounded-full w-fit max-w-full">
                  <div className="w-5 h-5 rounded-full bg-[rgba(217,79,43,0.1)] border border-[rgba(217,79,43,0.2)] flex items-center justify-center text-flame shrink-0">
                    <IcMic s={10} />
                  </div>
                  <span className="text-[12.5px] font-medium text-text truncate">
                    {title}
                  </span>
                  <button
                    onClick={() => {
                      setStarted(false);
                      reset();
                    }}
                    className="text-whisper hover:text-soft transition-colors cursor-pointer ml-1 shrink-0"
                    title="Change title"
                    aria-label="Change title"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* recorder card */}
                <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-6 sm:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none" />
                  <div className="relative">
                    <AudioRecorder title={title} onUploaded={() => {}} />
                  </div>
                </div>

                {/* tips below recorder on mobile */}
                <div className="flex flex-col gap-2.5 mt-6 lg:hidden">
                  <Tip text="Speak clearly and at a normal pace for best transcription." />
                  <Tip text="Minimise background noise if possible." />
                </div>

                {/* start over */}
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={() => {
                      reset();
                      setStarted(false);
                      setTitle("");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-edge text-[11.5px] text-whisper bg-transparent cursor-pointer hover:text-soft hover:border-edge-2 transition-all font-sans"
                  >
                    <IcRefresh /> Start over
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: processing ── */}
            {(isProcessing || isReady) && recordingId && (
              <div className="max-w-[520px]">
                <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-6 sm:p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none" />
                  <div className="relative">
                    <ProcessingStatus recordingId={recordingId} />
                  </div>
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    onClick={() => {
                      reset();
                      setStarted(false);
                      setTitle("");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-edge text-[11.5px] text-whisper bg-transparent cursor-pointer hover:text-soft hover:border-edge-2 transition-all font-sans"
                  >
                    <IcRefresh /> Start a new recording
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: tips sidebar (desktop only) ── */}
          {!started && (
            <div className="hidden lg:block w-[240px] shrink-0 pt-[120px]">
              <p className="text-[10px] font-semibold text-whisper tracking-[0.08em] uppercase mb-4">
                Tips for best results
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: "Speak clearly",
                    body: "Stay 20–30 cm from mic. A quiet room helps a lot.",
                  },
                  {
                    title: "Summarise key points",
                    body: "Briefly recap mid-lecture — helps the AI structure your pack.",
                  },
                  {
                    title: "Ideal length",
                    body: "30–90 minutes gives the richest study packs.",
                  },
                  {
                    title: "Complete your profile",
                    body: "A full diagnostic means materials tailored to how you learn.",
                  },
                ].map(({ title: t, body }) => (
                  <div
                    key={t}
                    className="flex items-start gap-3 p-3.5 bg-surface border border-edge rounded-xl hover:border-edge-2 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-flame mt-[6px] shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-text mb-0.5">
                        {t}
                      </p>
                      <p className="text-[11px] text-whisper font-light leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
