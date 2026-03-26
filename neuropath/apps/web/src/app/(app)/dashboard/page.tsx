"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../../../store/auth.store";
import { studyPacksApi } from "../../../lib/api/study-packs.api";
import { roadmapApi } from "../../../lib/api/roadmap.api";
import { recordingsApi } from "../../../lib/api/recordings.api";

/* ─────────────────────────────────────────
   Local shape types — safe subsets of the
   actual @neuropath/types so no import risk
───────────────────────────────────────── */
interface PackRow {
  id: string;
  title: string;
  flashcard_count: number;
  quiz_count: number;
  created_at: string;
}

interface TaskRow {
  id: string;
  title: string;
  subject?: string;
  completed: boolean;
}

interface RecRow {
  id: string;
  title: string;
  duration_s: number | null;
  status: string;
  created_at: string;
}

/* ─────────────────────────────────────────
   Inline SVG icons  (no external deps)
───────────────────────────────────────── */
function IcMic({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}
function IcBook({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function IcMap({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
function IcBrain({ s = 16 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.41-4.28 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.41-4.28 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  );
}
function IcChevron({ s = 14 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IcCheck({ s = 10 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IcClock({ s = 11 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcLayers({ s = 14 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.5-8.57 3.91a2 2 0 0 1-1.66 0L3 12.5" />
      <path d="m22 17.5-8.57 3.91a2 2 0 0 1-1.66 0L3 17.5" />
    </svg>
  );
}
function IcInfo({ s = 14 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function dur(s: number | null): string {
  if (!s) return "—";
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function ago(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const days = Math.floor(ms / 86400000);
  const hrs  = Math.floor(ms / 3600000);
  const mins = Math.floor(ms / 60000);
  if (days > 1) return `${days}d ago`;
  if (hrs  >= 1) return `${hrs}h ago`;
  if (mins >= 1) return `${mins}m ago`;
  return "Just now";
}

/* ─────────────────────────────────────────
   UI atoms
───────────────────────────────────────── */
function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-3.5 sm:p-5 text-center transition-all active:scale-95 ${accent ? "bg-gradient-to-br from-[rgba(217,79,43,0.14)] to-[rgba(217,79,43,0.04)] border-[rgba(217,79,43,0.25)]" : "bg-surface border-edge"}`}>
      {accent && <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-flame opacity-10 blur-2xl pointer-events-none" />}
      <p className={`font-serif text-[28px] sm:text-[32px] font-semibold leading-none tracking-[-0.03em] mb-1 ${accent ? "text-ember" : "text-text"}`}>{value}</p>
      <p className="text-[9.5px] sm:text-[10.5px] text-whisper tracking-[0.07em] uppercase font-semibold">{label}</p>
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative bg-surface border border-edge rounded-2xl p-4 sm:p-5 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function PanelHead({ icon, title, href, label }: { icon: React.ReactNode; title: string; href: string; label: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.16)] flex items-center justify-center text-flame">{icon}</div>
        <span className="font-serif text-[14px] sm:text-[15px] font-medium text-text">{title}</span>
      </div>
      <Link href={href} className="flex items-center gap-0.5 text-[10.5px] text-flame no-underline font-semibold tracking-[0.05em] uppercase hover:opacity-70 transition-opacity">
        {label}<IcChevron s={12} />
      </Link>
    </div>
  );
}

function Skel({ n = 3 }: { n?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: n }).map((_, i) => <div key={i} className="h-[52px] rounded-xl bg-lift animate-pulse" />)}
    </div>
  );
}

function Empty({ msg, cta, href }: { msg: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-5 text-center">
      <div className="w-8 h-8 rounded-full bg-lift border border-edge flex items-center justify-center text-whisper"><IcInfo s={13} /></div>
      <p className="text-[12px] text-whisper font-light leading-relaxed max-w-[200px]">{msg}</p>
      <Link href={href} className="text-[11.5px] text-ember font-semibold no-underline hover:opacity-75 transition-opacity">{cta} →</Link>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore();

  const [packs,        setPacks]        = useState<PackRow[]>([]);
  const [tasks,        setTasks]        = useState<TaskRow[]>([]);
  const [recs,         setRecs]         = useState<RecRow[]>([]);
  const [loadPacks,    setLoadPacks]    = useState(true);
  const [loadTasks,    setLoadTasks]    = useState(true);
  const [loadRecs,     setLoadRecs]     = useState(true);

  const firstName  = user?.name?.split(" ")[0] ?? "there";
  const hasProfile = !!user?.learning_profile;
  const done       = tasks.filter((t) => t.completed).length;
  const h          = new Date().getHours();
  const greeting   = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    studyPacksApi.list({ limit: 4 })
      .then((d) => setPacks(d as PackRow[]))
      .finally(() => setLoadPacks(false));
    roadmapApi.getTodaysTasks()
      .then((d) => setTasks(d as TaskRow[]))
      .finally(() => setLoadTasks(false));
    recordingsApi.list()
      .then((d) => setRecs(d as RecRow[]))
      .finally(() => setLoadRecs(false));
  }, []);

  const actions = [
    { href: "/record",      icon: <IcMic />,   label: "Record",  sub: "New lecture"  },
    { href: "/study-packs", icon: <IcBook />,   label: "Packs",   sub: "Library"      },
    { href: "/roadmap",     icon: <IcMap />,    label: "Roadmap", sub: "Daily plan"   },
    { href: "/diagnostic",  icon: <IcBrain />,  label: "Test",    sub: "Diagnostic"   },
  ];

  return (
    <div className="min-h-screen bg-ink">
      {/* glow */}
      <div aria-hidden className="fixed top-0 left-1/2 -translate-x-1/2 w-[480px] h-[300px] pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.07)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[860px] mx-auto px-4 sm:px-6 pt-6 pb-28">

        {/* greeting */}
        <div className="mb-7">
          <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2.5">
            <span className="w-4 h-px bg-flame" />Dashboard
          </p>
          <h1 className="font-serif text-[clamp(24px,6vw,40px)] font-medium text-text tracking-[-0.03em] leading-tight mb-2">
            {greeting}, {firstName}.
          </h1>
          <p className="text-[13px] sm:text-[14px] text-soft font-light leading-relaxed max-w-[380px]">
            {hasProfile
              ? "Your personalised plan is active. Here's where you left off."
              : "Complete your learning profile to unlock personalised packs."}
          </p>
        </div>

        {/* profile banner */}
        {!hasProfile && (
          <div className="mb-6 rounded-2xl border border-[rgba(217,79,43,0.28)] bg-gradient-to-r from-[rgba(217,79,43,0.08)] to-transparent p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-ember shrink-0"><IcInfo /></div>
              <div>
                <p className="text-[13px] font-semibold text-text mb-0.5">Profile incomplete</p>
                <p className="text-[12px] text-soft font-light">Run a diagnostic to personalise your study materials.</p>
              </div>
            </div>
            <Link href="/diagnostic" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-text text-ink rounded-full px-5 py-2.5 text-[12.5px] font-semibold no-underline transition-all active:scale-95 hover:opacity-90">
              Start Diagnostic
            </Link>
          </div>
        )}

        {/* stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <Stat value={packs.length} label="Packs" />
          <Stat value={done}         label="Done"  accent />
          <Stat value={tasks.length} label="Left"  />
        </div>

        {/* quick actions */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
          {actions.map(({ href, icon, label, sub }) => (
            <Link key={href} href={href}
              className="group flex flex-col items-center gap-2 py-3 sm:py-4 px-1 rounded-2xl bg-surface border border-edge no-underline transition-all hover:border-edge-2 hover:bg-lift active:scale-95">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[rgba(217,79,43,0.07)] border border-[rgba(217,79,43,0.14)] flex items-center justify-center text-flame group-hover:scale-105 transition-transform">
                {icon}
              </div>
              <div className="text-center">
                <p className="text-[11px] sm:text-[12px] font-semibold text-text">{label}</p>
                <p className="hidden sm:block text-[10px] text-whisper">{sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* packs + recordings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Panel>
            <PanelHead icon={<IcBook s={14} />} title="Study Packs" href="/study-packs" label="All" />
            {loadPacks ? <Skel n={3} /> : packs.length === 0 ? (
              <Empty msg="No packs yet. Record a lecture to get started." cta="Record now" href="/record" />
            ) : (
              <div className="flex flex-col gap-2">
                {packs.map((p) => (
                  <Link key={p.id} href={`/study-packs/${p.id}`}
                    className="group flex items-center gap-3 px-3 py-2.5 bg-lift border border-edge rounded-xl no-underline transition-all hover:border-edge-2 active:scale-[0.98]">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(217,79,43,0.07)] border border-[rgba(217,79,43,0.14)] flex items-center justify-center shrink-0 text-flame">
                      <IcLayers />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium text-text truncate">{p.title}</p>
                      <p className="text-[11px] text-whisper">{p.flashcard_count} cards · {p.quiz_count} Q</p>
                    </div>
                    <div className="text-whisper opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <IcChevron s={13} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel>
            <PanelHead icon={<IcMic s={14} />} title="Recordings" href="/record" label="New" />
            {loadRecs ? <Skel n={3} /> : recs.length === 0 ? (
              <Empty msg="No recordings yet. Tap record to start." cta="Start recording" href="/record" />
            ) : (
              <div className="flex flex-col gap-2">
                {recs.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 px-3 py-2.5 bg-lift border border-edge rounded-xl hover:border-edge-2 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(217,79,43,0.07)] border border-[rgba(217,79,43,0.14)] flex items-center justify-center shrink-0 text-flame">
                      <IcMic s={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium text-text truncate">{r.title}</p>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-whisper">
                        <IcClock /><span>{dur(r.duration_s)}</span>
                        <span className="text-edge-2">·</span>
                        <span>{ago(r.created_at)}</span>
                        <span className="text-edge-2">·</span>
                        <span className={r.status === "ready" ? "text-green-400 font-semibold" : r.status === "failed" ? "text-red-400 font-semibold" : "text-ember font-semibold"}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* tasks */}
        <Panel className="mb-4">
          <PanelHead icon={<IcMap s={14} />} title="Today's Tasks" href="/roadmap" label="Roadmap" />
          {loadTasks ? <Skel n={2} /> : tasks.length === 0 ? (
            <Empty msg="No tasks scheduled. Set a test date to build your roadmap." cta="Set a date" href="/roadmap/set-date" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tasks.slice(0, 6).map((t) => (
                <div key={t.id} className={`flex items-start gap-3 px-3 py-3 bg-lift border border-edge rounded-xl transition-all ${t.completed ? "opacity-40" : "hover:border-edge-2"}`}>
                  <div className={`mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${t.completed ? "bg-flame border-flame text-white" : "border-edge-2"}`}>
                    {t.completed && <IcCheck />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12.5px] font-medium truncate ${t.completed ? "line-through text-whisper" : "text-text"}`}>{t.title}</p>
                    {t.subject && <p className="text-[11px] text-whisper">{t.subject}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* cta */}
        <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(217,79,43,0.04)] to-transparent pointer-events-none" />
          <div className="relative text-center sm:text-left">
            <p className="text-[10px] text-flame font-semibold tracking-[2px] uppercase mb-1.5">New lecture</p>
            <h3 className="font-serif text-[18px] sm:text-[20px] font-medium text-text tracking-[-0.02em] mb-1">Ready to record?</h3>
            <p className="text-[12.5px] text-soft font-light">Turn any lecture into a personalised study pack.</p>
          </div>
          <Link href="/record" className="relative w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3.5 text-[13px] font-semibold no-underline transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_24px_rgba(217,79,43,0.35)]">
            <IcMic s={14} /> Start Recording
          </Link>
        </div>

      </div>
    </div>
  );
}