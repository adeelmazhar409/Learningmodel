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

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => { stream.getTracks().forEach(t => t.stop()); setHasPermission(true); })
      .catch(() => setHasPermission(false));
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      setMediaRecorder(mr);
      setPhase("recording");
      mr.ondataavailable = e => { if (e.data.size > 0) appendChunk(e.data); };
      mr.start(1000);
      const interval = setInterval(tickDuration, 1000);
      setTimerInterval(interval);
      const animate = () => {
        barsRef.current = barsRef.current.map(() => Math.max(4, Math.min(40, Math.random() * 40)));
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    } catch {
      setError("Could not access microphone.");
      toast.error("Microphone access denied.");
    }
  }

  async function stopRecording() {
    const { mediaRecorder, audioChunks, timerInterval } = store;
    if (!mediaRecorder) return;
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (timerInterval) clearInterval(timerInterval);
    setPhase("stopped");
    mediaRecorder.onstop = async () => {
      const blob = new Blob([...audioChunks], { type: "audio/webm" });
      setAudioBlob(blob);
      setPhase("uploading");
      try {
        const file = new File([blob], `${title}.webm`, { type: "audio/webm" });
        const recording = await recordingsApi.upload(file, title);
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

  const secs  = Math.floor(durationMs / 1000);
  const timer = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  if (hasPermission === false) {
    return (
      <div className="text-center py-10 px-6">
        <p className="text-[28px] mb-3">🎙</p>
        <p className="text-sm text-soft">Microphone access was denied.</p>
        <p className="text-[13px] text-whisper mt-1.5">
          Please allow microphone access in your browser settings and reload the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-7 py-3">
      {/* Waveform */}
      <div className="flex items-center gap-[3px] h-14">
        {barsRef.current.map((h, i) => (
          <div
            key={i}
            className={`w-1 rounded-pill bg-flame transition-[height] duration-100 ${phase !== "recording" ? "opacity-20" : "opacity-60"}`}
            style={{ height: phase === "recording" ? `${h}px` : "4px", minHeight: "4px" }}
          />
        ))}
      </div>

      {/* Timer */}
      {(phase === "recording" || phase === "stopped") && (
        <div className="text-center">
          <div className="font-serif text-[42px] font-semibold text-text tracking-[-0.02em] leading-none">{timer}</div>
          <div className="text-[11px] text-whisper tracking-[1.4px] uppercase mt-1">recording</div>
        </div>
      )}

      {/* Uploading state */}
      {(phase === "uploading" || phase === "processing") ? (
        <div className="flex items-center gap-2.5 text-sm text-soft">
          <span className="w-[18px] h-[18px] border-2 border-edge-2 border-t-ember rounded-full animate-spin shrink-0" />
          Uploading audio…
        </div>
      ) : phase === "idle" || phase === "error" ? (
        /* Record button */
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startRecording}
            title="Start recording"
            className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-br from-ember to-[#9b2a10] border-none cursor-pointer flex items-center justify-center shadow-[0_0_0_8px_rgba(217,79,43,0.12),0_4px_24px_rgba(217,79,43,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_0_12px_rgba(217,79,43,0.1),0_6px_30px_rgba(217,79,43,0.45)]"
          >
            <div className="w-5 h-5 rounded-full bg-white" />
          </button>
          <span className="text-xs text-whisper tracking-[0.04em]">Tap to record</span>
        </div>
      ) : phase === "recording" ? (
        /* Stop button */
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={stopRecording}
            title="Stop recording"
            className="relative w-[72px] h-[72px] rounded-full bg-surface border-2 border-[rgba(217,79,43,0.4)] cursor-pointer flex items-center justify-center shadow-[0_0_0_8px_rgba(217,79,43,0.06)] transition-all hover:border-[rgba(217,79,43,0.6)] hover:shadow-[0_0_0_12px_rgba(217,79,43,0.08)]"
          >
            <div className="w-5 h-5 rounded-[4px] bg-ember" />
          </button>
          <span className="text-xs text-whisper tracking-[0.04em]">Tap to stop</span>
        </div>
      ) : null}
    </div>
  );
}
