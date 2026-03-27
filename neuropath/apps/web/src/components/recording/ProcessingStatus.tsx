"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRecordingStore } from "@/store/recording.store";
import { recordingsApi } from "@/lib/api/recordings.api";
import type { RecordingStatus } from "@neuropath/types";

interface Props { recordingId: string; }

const STEPS: Array<{ status: RecordingStatus; label: string; sub: string }> = [
  { status: "uploading",    label: "Uploading audio",          sub: "Sending your recording securely…"        },
  { status: "transcribing", label: "Transcribing lecture",     sub: "Converting speech to structured text…"   },
  { status: "generating",   label: "Building your study pack", sub: "Personalising to your learning profile…" },
  { status: "ready",        label: "Study pack ready",         sub: "Your personalised materials are waiting." },
];

function stepIndex(status: RecordingStatus | null): number {
  if (!status) return 0;
  const idx = STEPS.findIndex(s => s.status === status);
  return idx === -1 ? 0 : idx;
}

export default function ProcessingStatus({ recordingId }: Props) {
  const router  = useRouter();
  const { status, progress, statusMessage, setStatus, setPhase } = useRecordingStore();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "ready") return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await recordingsApi.getStatus(recordingId);
        setStatus(res.status, res.message, res.progress);
        if (res.status === "ready") { clearInterval(pollRef.current!); setPhase("ready"); setTimeout(() => router.push(`/study-packs/${recordingId}/summary`), 1800); }
        if (res.status === "failed") { clearInterval(pollRef.current!); setPhase("error"); }
      } catch { /* ignore poll errors */ }
    }, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [recordingId]); // eslint-disable-line

  const current = stepIndex(status);

  return (
    <div className="flex flex-col gap-7 w-full max-w-[520px] mx-auto py-3">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-medium text-[#f0ede8] mb-2 tracking-[-0.02em]">Processing your lecture</h2>
        <p className="text-sm text-[rgba(240,237,232,0.55)] font-light leading-relaxed">{statusMessage || "This usually takes 1–3 minutes. You can leave this page and come back."}</p>
      </div>

      <div>
        <div className="flex justify-between text-xs text-[rgba(240,237,232,0.25)] mb-2"><span>Progress</span><span>{progress}%</span></div>
        <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
        </div>
      </div>

      <div className="flex flex-col">
        {STEPS.map((step, i) => {
          const isDone   = i < current;
          const isActive = i === current && status !== "ready";
          const isPending = i > current;
          return (
            <div key={step.status} className="flex items-start gap-4 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 mt-0.5 border transition-all ${isDone ? "bg-[rgba(217,79,43,0.1)] border-[rgba(217,79,43,0.35)]" : isActive ? "border-[rgba(217,79,43,0.5)] bg-[rgba(217,79,43,0.08)]" : "border-[rgba(255,255,255,0.07)] bg-[#141418] opacity-35"}`}>
                {isDone
                  ? <span className="text-[#e8603c] text-sm">✓</span>
                  : <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#e8603c] animate-pulse" : "bg-[rgba(240,237,232,0.25)]"}`}/>
                }
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium mb-0.5 ${isPending ? "text-[rgba(240,237,232,0.25)] font-light" : "text-[#f0ede8]"}`}>{step.label}</p>
                <p className={`text-[12.5px] font-light leading-relaxed ${isPending ? "text-[rgba(240,237,232,0.25)]" : "text-[rgba(240,237,232,0.55)]"}`}>{isActive ? (statusMessage || step.sub) : step.sub}</p>
              </div>
              {isActive && <span className="w-[14px] h-[14px] border-[1.5px] border-[rgba(217,79,43,0.25)] border-t-[#e8603c] rounded-full animate-spin shrink-0 mt-1"/>}
            </div>
          );
        })}
      </div>

      {status === "ready" && (
        <div className="text-center px-5 py-5 bg-[rgba(217,79,43,0.06)] border border-[rgba(217,79,43,0.2)] rounded-2xl">
          <div className="text-[28px] mb-2.5">🎉</div>
          <p className="font-serif text-[18px] font-medium text-[#f0ede8] mb-1.5">Your study pack is ready</p>
          <p className="text-[13.5px] text-[rgba(240,237,232,0.55)] font-light">Redirecting you now…</p>
        </div>
      )}
    </div>
  );
}
