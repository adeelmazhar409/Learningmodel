"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRecordingStore } from "@/store/recording.store";
import { recordingsApi } from "@/lib/api/recordings.api";
import type { RecordingStatus } from "@neuropath/types";

interface Props {
  recordingId: string;
}

const STEPS: Array<{ status: RecordingStatus; label: string; sub: string }> = [
  { status: "uploading",    label: "Uploading audio",          sub: "Sending your recording securely…"         },
  { status: "transcribing", label: "Transcribing lecture",     sub: "Converting speech to structured text…"    },
  { status: "generating",   label: "Building your study pack", sub: "Personalising to your learning profile…"  },
  { status: "ready",        label: "Study pack ready",         sub: "Your personalised materials are waiting."  },
];

function stepIndex(status: RecordingStatus | null): number {
  if (!status) return 0;
  const idx = STEPS.findIndex(s => s.status === status);
  return idx === -1 ? 0 : idx;
}

export default function ProcessingStatus({ recordingId }: Props) {
  const router    = useRouter();
  const { status, progress, statusMessage, setStatus, setPhase } = useRecordingStore();
  const pollRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "ready") return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await recordingsApi.getStatus(recordingId);
        setStatus(res.status, res.message, res.progress);

        if (res.status === "ready") {
          clearInterval(pollRef.current!);
          setPhase("ready");
          // Redirect to study pack after short delay
          setTimeout(() => {
            router.push(`/study-packs/${recordingId}/summary`);
          }, 1800);
        }

        if (res.status === "failed") {
          clearInterval(pollRef.current!);
          setPhase("error");
        }
      } catch { /* ignore poll errors */ }
    }, 2000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingId]);

  const current = stepIndex(status);

  return (
    <>
      <style>{`
        .ps-wrap {
          display: flex;
          flex-direction: column;
          gap: 28px;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          padding: 12px 0;
        }

        .ps-header { text-align: center; }
        .ps-heading {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .ps-sub {
          font-size: 14px;
          color: var(--soft);
          font-weight: 300;
          line-height: 1.6;
        }

        /* Overall progress */
        .ps-bar-wrap { width: 100%; }
        .ps-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--whisper);
          margin-bottom: 8px;
        }

        /* Steps */
        .ps-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ps-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ps-step:last-child { border-bottom: none; }

        .ps-step-icon {
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          border: 1px solid var(--edge);
          background: var(--surface);
          transition: border-color 0.3s, background 0.3s;
          font-size: 14px;
        }
        .ps-step-icon.done    { background: rgba(217,79,43,0.1); border-color: rgba(217,79,43,0.35); }
        .ps-step-icon.active  { border-color: rgba(217,79,43,0.5); background: rgba(217,79,43,0.08); }
        .ps-step-icon.pending { opacity: 0.35; }

        .ps-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--whisper);
        }
        .ps-dot.done   { background: var(--ember); }
        .ps-dot.active { background: var(--ember); animation: pulse 1.4s ease infinite; }

        .ps-step-body { flex: 1; }
        .ps-step-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 3px;
          line-height: 1.3;
        }
        .ps-step-label.pending { color: var(--whisper); font-weight: 300; }
        .ps-step-sub {
          font-size: 12.5px;
          color: var(--soft);
          font-weight: 300;
          line-height: 1.5;
        }
        .ps-step-sub.pending { color: var(--whisper); }

        /* Spinner for active step */
        .ps-spinner {
          width: 14px; height: 14px;
          border: 1.5px solid rgba(217,79,43,0.25);
          border-top-color: var(--ember);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
          margin-top: 4px;
        }

        /* Ready state */
        .ps-ready {
          text-align: center;
          padding: 20px;
          background: rgba(217,79,43,0.06);
          border: 1px solid rgba(217,79,43,0.2);
          border-radius: 16px;
          animation: riseIn 0.5s ease both;
        }
        .ps-ready-icon { font-size: 28px; margin-bottom: 10px; }
        .ps-ready-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 6px;
        }
        .ps-ready-sub { font-size: 13.5px; color: var(--soft); font-weight: 300; }
      `}</style>

      <div className="ps-wrap">
        <div className="ps-header">
          <h2 className="ps-heading">Processing your lecture</h2>
          <p className="ps-sub">
            {statusMessage || "This usually takes 1–3 minutes. You can leave this page and come back."}
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="ps-bar-wrap">
          <div className="ps-bar-label">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        {/* Step list */}
        <div className="ps-steps">
          {STEPS.map((step, i) => {
            const isDone    = i < current;
            const isActive  = i === current && status !== "ready";
            const isPending = i > current;

            return (
              <div className="ps-step" key={step.status}>
                <div className={`ps-step-icon${isDone ? " done" : isActive ? " active" : " pending"}`}>
                  {isDone
                    ? <span style={{ color: "var(--ember)", fontSize: 13 }}>✓</span>
                    : <span className={`ps-dot${isDone ? " done" : isActive ? " active" : ""}`}/>
                  }
                </div>
                <div className="ps-step-body">
                  <p className={`ps-step-label${isPending ? " pending" : ""}`}>{step.label}</p>
                  <p className={`ps-step-sub${isPending ? " pending" : ""}`}>
                    {isActive ? (statusMessage || step.sub) : step.sub}
                  </p>
                </div>
                {isActive && <div className="ps-spinner"/>}
              </div>
            );
          })}
        </div>

        {/* Ready banner */}
        {status === "ready" && (
          <div className="ps-ready">
            <div className="ps-ready-icon">🎉</div>
            <p className="ps-ready-text">Your study pack is ready</p>
            <p className="ps-ready-sub">Redirecting you now…</p>
          </div>
        )}
      </div>
    </>
  );
}
