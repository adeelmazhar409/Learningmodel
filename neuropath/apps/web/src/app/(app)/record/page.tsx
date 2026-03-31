"use client";
import { useState } from "react";
import { useRecordingStore } from "@/store/recording.store";
import AudioRecorder from "@/components/recording/AudioRecorder";
import ProcessingStatus from "@/components/recording/ProcessingStatus";

export default function RecordPage() {
  const { phase, recordingId, setRecordingId, setPhase, reset } = useRecordingStore();
  const [title,   setTitle]   = useState("");
  const [started, setStarted] = useState(false);
  const isProcessing = phase === "processing" || phase === "uploading";
  const isReady      = phase === "ready";

  function handleUploaded(id: string) {
    setRecordingId(id);
    setPhase("processing");
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 py-12 pb-20">
      <div className="mb-10">
        <p className="flex items-center gap-2 text-[11px] font-medium text-[#d94f2b] tracking-[2px] uppercase mb-2.5 before:block before:w-[18px] before:h-px before:bg-[#d94f2b]">Record</p>
        <h1 className="font-serif text-[clamp(26px,4vw,38px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight mb-2.5">
          {!started ? "Name your lecture" : isProcessing || isReady ? "Processing…" : "Recording"}
        </h1>
        <p className="text-[15px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">
          {!started ? "Give your lecture a name so you can find it later, then start recording." : "Your lecture is being transcribed and turned into a personalised study pack."}
        </p>
      </div>

      {!started && (
        <div className="flex flex-col gap-5 max-w-[520px]">
          <div>
            <label className="block text-[11px] font-medium text-[rgba(240,237,232,0.55)] tracking-[0.04em] uppercase mb-2" htmlFor="lecture-title">Lecture name</label>
            <input id="lecture-title" type="text" value={title} onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && title.trim() && setStarted(true)}
              className="w-full bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3 text-sm text-[#f0ede8] outline-none transition-all placeholder:text-[rgba(240,237,232,0.25)] focus:border-[rgba(217,79,43,0.5)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.08)] font-sans"
              placeholder="e.g. Biology — Photosynthesis" autoFocus/>
          </div>
          <p className="text-[13px] text-[rgba(240,237,232,0.25)] font-light leading-relaxed">Be specific so you can find it in your study packs.</p>
          <button onClick={() => setStarted(true)} disabled={!title.trim()}
            className="self-start inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3.5 text-sm font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">
            Continue to recording →
          </button>
        </div>
      )}

      {started && (
        <>
          <div className="bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[24px] px-8 py-9 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]"/>
            {!isProcessing && !isReady ? (
              <>
                <p className="font-serif text-base font-medium text-[#f0ede8] mb-1.5 relative z-10">{title}</p>
                <p className="text-[13px] text-[rgba(240,237,232,0.55)] font-light mb-7 relative z-10">Tap the button below to start. Speak clearly — the AI handles the rest.</p>
                <AudioRecorder title={title} onUploaded={handleUploaded}/>
              </>
            ) : (
              <ProcessingStatus recordingId={recordingId ?? ""}/>
            )}
          </div>

          {!isProcessing && !isReady && (
            <>
              <div className="grid grid-cols-2 gap-2.5 mt-8">
                {["Speak at a normal pace — don't rush.", "Hold the phone close to the audio source.", "You can record up to 60 minutes per session.", "Background noise is handled automatically."].map(t => (
                  <div key={t} className="flex items-start gap-2.5 px-3.5 py-3 bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-xl">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#d94f2b] shrink-0 mt-[6px]"/>
                    <span className="text-[13px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center">
                <button onClick={() => { reset(); setStarted(false); setTitle(""); }}
                  className="bg-transparent border border-[rgba(255,255,255,0.07)] text-[rgba(240,237,232,0.25)] text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all hover:text-[rgba(240,237,232,0.55)] hover:border-[rgba(255,255,255,0.13)] font-sans">
                  ← Change lecture name
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
