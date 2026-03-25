"use client";

import { useEffect, useRef, useState } from "react";
import { useRecordingStore } from "@/store/recording.store";
import { recordingsApi } from "@/lib/api/recordings.api";
import toast from "react-hot-toast";

interface Props {
  title:      string;
  onUploaded: (recordingId: string) => void;
}

export default function AudioRecorder({ title, onUploaded }: Props) {
  const store = useRecordingStore();
  const {
    phase, durationMs,
    setPhase, setMediaRecorder, appendChunk,
    setAudioBlob, tickDuration, setTimerInterval,
    setRecordingId, setError, reset,
  } = store;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const animRef = useRef<number | null>(null);
  const barsRef = useRef<number[]>(Array(24).fill(4));

  /* ── Request mic permission on mount ── */
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop());
        setHasPermission(true);
      })
      .catch(() => setHasPermission(false));
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  /* ── Start recording ── */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr     = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaRecorder(mr);
      setPhase("recording");

      mr.ondataavailable = e => { if (e.data.size > 0) appendChunk(e.data); };
      mr.start(1000);

      /* Tick timer */
      const interval = setInterval(tickDuration, 1000);
      setTimerInterval(interval);

      /* Fake waveform animation */
      const animate = () => {
        barsRef.current = barsRef.current.map(() =>
          Math.max(4, Math.min(40, Math.random() * 40))
        );
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);

    } catch (err) {
      setError("Could not access microphone. Please check your permissions.");
      toast.error("Microphone access denied.");
    }
  }

  /* ── Stop and upload ── */
  async function stopRecording() {
    const { mediaRecorder, audioChunks, timerInterval } = store;
    if (!mediaRecorder) return;

    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (timerInterval)   clearInterval(timerInterval);

    setPhase("stopped");

    mediaRecorder.onstop = async () => {
      const blob = new Blob([...audioChunks], { type: "audio/webm" });
      setAudioBlob(blob);
      setPhase("uploading");

      try {
        const file       = new File([blob], `${title}.webm`, { type: "audio/webm" });
        const recording  = await recordingsApi.upload(file, title);
        setRecordingId(recording.id);
        setPhase("processing");
        onUploaded(recording.id);
      } catch {
        setError("Upload failed. Please try again.");
        toast.error("Upload failed.");
      }
    };

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }

  /* ── Format duration ── */
  const secs  = Math.floor(durationMs / 1000);
  const mm    = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss    = String(secs % 60).padStart(2, "0");
  const timer = `${mm}:${ss}`;

  if (hasPermission === false) {
    return (
      <div className="ar-no-perm">
        <style>{`.ar-no-perm{text-align:center;padding:40px 24px;color:var(--soft);font-size:14px;line-height:1.65;}`}</style>
        <p style={{ fontSize: 28, marginBottom: 12 }}>🎙</p>
        <p>Microphone access was denied.</p>
        <p style={{ marginTop: 6, fontSize: 13, color: "var(--whisper)" }}>
          Please allow microphone access in your browser settings and reload the page.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 12px 0;
        }

        /* Waveform */
        .ar-wave {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 56px;
        }
        .ar-bar {
          width: 4px;
          border-radius: 100px;
          background: var(--flame);
          opacity: 0.6;
          transition: height 0.1s ease;
          min-height: 4px;
        }
        .ar-bar.idle { height: 4px !important; opacity: 0.2; }

        /* Timer */
        .ar-timer {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .ar-timer-label {
          font-size: 11px;
          color: var(--whisper);
          letter-spacing: 1.4px;
          text-transform: uppercase;
          text-align: center;
          margin-top: -8px;
        }

        /* Record button */
        .ar-btn-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ar-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          position: relative;
        }
        .ar-btn.start {
          background: linear-gradient(145deg, var(--ember), #9b2a10);
          box-shadow: 0 0 0 8px rgba(217,79,43,0.12), 0 4px 24px rgba(217,79,43,0.35);
        }
        .ar-btn.start:hover {
          transform: scale(1.06);
          box-shadow: 0 0 0 12px rgba(217,79,43,0.1), 0 6px 30px rgba(217,79,43,0.45);
        }
        .ar-btn.stop {
          background: rgba(255,255,255,0.08);
          border: 2px solid var(--edge2);
          box-shadow: none;
        }
        .ar-btn.stop:hover { transform: scale(1.04); background: rgba(255,255,255,0.12); }

        /* Pulse ring when recording */
        .ar-btn.start::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid rgba(217,79,43,0.25);
          animation: arPulse 1.8s ease-in-out infinite;
        }
        @keyframes arPulse {
          0%,100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.12); opacity: 0; }
        }

        .ar-btn-icon {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: #fff;
        }
        .ar-btn-icon.mic {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
        }
        .ar-btn-label {
          font-size: 12px;
          color: var(--whisper);
          letter-spacing: 0.04em;
          text-align: center;
        }

        /* States */
        .ar-status {
          font-size: 13px;
          color: var(--soft);
          font-weight: 300;
          text-align: center;
          line-height: 1.55;
        }
        .ar-uploading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--soft);
        }
        .ar-spinner {
          width: 18px; height: 18px;
          border: 2px solid var(--edge2);
          border-top-color: var(--ember);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div className="ar-wrap">
        {/* Waveform */}
        <div className="ar-wave">
          {barsRef.current.map((h, i) => (
            <div
              key={i}
              className={`ar-bar${phase !== "recording" ? " idle" : ""}`}
              style={{ height: phase === "recording" ? `${h}px` : "4px" }}
            />
          ))}
        </div>

        {/* Timer */}
        {(phase === "recording" || phase === "stopped") && (
          <div>
            <div className="ar-timer">{timer}</div>
            <div className="ar-timer-label">recording</div>
          </div>
        )}

        {/* Controls */}
        {phase === "uploading" || phase === "processing" ? (
          <div className="ar-uploading">
            <div className="ar-spinner" />
            <span>Uploading audio…</span>
          </div>
        ) : phase === "idle" || phase === "error" ? (
          <div className="ar-btn-wrap">
            <button className="ar-btn start" onClick={startRecording} title="Start recording">
              <div className="ar-btn-icon mic" />
            </button>
            <span className="ar-btn-label">Tap to record</span>
          </div>
        ) : phase === "recording" ? (
          <div className="ar-btn-wrap">
            <button className="ar-btn stop" onClick={stopRecording} title="Stop recording">
              <div className="ar-btn-icon" />
            </button>
            <span className="ar-btn-label">Tap to stop</span>
          </div>
        ) : null}

        {phase === "idle" && (
          <p className="ar-status">
            Your lecture will be transcribed automatically.<br/>
            A personalised study pack will be ready in minutes.
          </p>
        )}
      </div>
    </>
  );
}
