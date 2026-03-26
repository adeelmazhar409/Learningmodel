"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { studyPacksApi } from "@/lib/api/study-packs.api";

/* ─────────────────────────────────────────
   Local shape — safe subset of StudyPack
───────────────────────────────────────── */
interface PackRow {
  id: string;
  title: string;
  flashcard_count: number;
  quiz_count: number;
  summary_short?: string;
  profile_snapshot?: Record<string, number>;
  created_at: string;
}

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
function IcSearch({ s = 15 }: { s?: number }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IcX({ s = 13 }: { s?: number }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IcMic({ s = 14 }: { s?: number }) {
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
function IcLayers({ s = 22 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 12.5-8.57 3.91a2 2 0 0 1-1.66 0L3 12.5" />
      <path d="m22 17.5-8.57 3.91a2 2 0 0 1-1.66 0L3 17.5" />
    </svg>
  );
}
function IcCard({ s = 11 }: { s?: number }) {
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
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function IcHelp({ s = 11 }: { s?: number }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IcMsg({ s = 11 }: { s?: number }) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IcChevron({ s = 14 }: { s?: number }) {
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
function IcPlus({ s = 13 }: { s?: number }) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IcBook({ s = 28 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Helper
───────────────────────────────────────── */
function ago(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const day = Math.floor(ms / 86400000);
  const hr = Math.floor(ms / 3600000);
  const min = Math.floor(ms / 60000);
  if (day > 1) return `${day}d ago`;
  if (hr >= 1) return `${hr}h ago`;
  if (min >= 1) return `${min}m ago`;
  return "Just now";
}

/* ─────────────────────────────────────────
   Pack Card
───────────────────────────────────────── */
function PackCard({ pack }: { pack: PackRow }) {
  const snap = pack.profile_snapshot ?? {};
  const topMode = Object.entries(snap).sort(([, a], [, b]) => b - a)[0];

  return (
    <Link
      href={`/study-packs/${pack.id}`}
      className="group relative flex flex-col bg-surface border border-edge rounded-2xl overflow-hidden no-underline transition-all duration-200 hover:border-edge-2 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] active:scale-[0.98]"
    >
      {/* top stripe */}
      <div className="h-[3px] w-full bg-gradient-to-r from-flame to-ember opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-4 sm:p-5 flex flex-col gap-3.5 flex-1">
        {/* header */}
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[rgba(217,79,43,0.07)] border border-[rgba(217,79,43,0.15)] flex items-center justify-center text-flame shrink-0 group-hover:scale-105 transition-transform duration-200">
            <IcLayers />
          </div>
          <span className="text-[10.5px] text-whisper font-medium mt-1 shrink-0">
            {ago(pack.created_at)}
          </span>
        </div>

        {/* title + summary */}
        <div className="flex-1">
          <h3 className="font-serif text-[14.5px] sm:text-[15.5px] font-medium text-text tracking-[-0.01em] leading-snug mb-1.5">
            {pack.title}
          </h3>
          {pack.summary_short && (
            <p className="text-[12px] text-soft font-light leading-relaxed line-clamp-2">
              {pack.summary_short}
            </p>
          )}
        </div>

        {/* stats pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-edge">
          {[
            { icon: <IcCard />, label: `${pack.flashcard_count} cards` },
            { icon: <IcHelp />, label: `${pack.quiz_count} Q` },
            { icon: <IcMsg />, label: "Teach-back" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-lift border border-edge text-[10.5px] text-soft"
            >
              <span className="text-whisper">{icon}</span>
              {label}
            </span>
          ))}
        </div>

        {/* profile badge */}
        {topMode && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-flame shrink-0" />
            <span className="text-[10.5px] text-whisper">
              Tailored for{" "}
              <span className="text-flame font-semibold capitalize">
                {topMode[0].replace("_", " ")}
              </span>{" "}
              ({Math.round(topMode[1] * 100)}%)
            </span>
          </div>
        )}
      </div>

      {/* hover arrow */}
      <div className="absolute bottom-4 right-4 text-whisper opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
        <IcChevron />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   Skeleton card
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-surface border border-edge rounded-2xl overflow-hidden">
      <div className="h-[3px] bg-lift animate-pulse" />
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-lift animate-pulse" />
          <div className="w-10 h-3 rounded-full bg-lift animate-pulse mt-1" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-4/5 rounded-full bg-lift animate-pulse" />
          <div className="h-3 w-full rounded-full bg-lift animate-pulse" />
          <div className="h-3 w-3/5 rounded-full bg-lift animate-pulse" />
        </div>
        <div className="flex gap-1.5 pt-3 border-t border-edge">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-6 w-16 rounded-full bg-lift animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function StudyPacksPage() {
  const [packs, setPacks] = useState<PackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    studyPacksApi
      .list()
      .then((d) => setPacks(d as PackRow[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    search.trim() === ""
      ? packs
      : packs.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase()),
        );

  return (
    <div className="min-h-screen bg-ink">
      {/* ambient glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[460px] h-[280px] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.05)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1020px] mx-auto px-4 sm:px-6 pt-6 pb-28">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2.5">
              <span className="w-4 h-px bg-flame" />
              Library
            </p>
            <h1 className="font-serif text-[clamp(24px,5vw,38px)] font-medium text-text tracking-[-0.03em] leading-tight mb-1.5">
              Study Packs
            </h1>
            <p className="text-[13px] sm:text-[14px] text-soft font-light">
              {loading
                ? "Loading your library…"
                : `${packs.length} pack${packs.length !== 1 ? "s" : ""} in your library`}
            </p>
          </div>
          <Link
            href="/record"
            className="shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-5 py-3 text-[13px] font-semibold no-underline transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_20px_rgba(217,79,43,0.3)]"
          >
            <IcPlus /> Record new lecture
          </Link>
        </div>

        {/* search */}
        {!loading && packs.length > 0 && (
          <div className="relative mb-6">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-whisper pointer-events-none">
              <IcSearch />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search study packs…"
              className="w-full bg-surface border border-edge rounded-xl pl-10 pr-9 py-3.5 text-[13.5px] sm:text-[14px] text-text outline-none font-sans placeholder:text-whisper focus:border-[rgba(217,79,43,0.45)] focus:shadow-[0_0_0_3px_rgba(217,79,43,0.09)] transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-whisper hover:text-soft transition-colors cursor-pointer"
              >
                <IcX />
              </button>
            )}
          </div>
        )}

        {/* content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : packs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-surface border border-edge flex items-center justify-center text-whisper">
              <IcBook />
            </div>
            <div>
              <h2 className="font-serif text-[20px] sm:text-[22px] font-medium text-text mb-2">
                No study packs yet
              </h2>
              <p className="text-[13px] sm:text-[14px] text-soft font-light max-w-[300px] leading-relaxed">
                Record your first lecture and we'll turn it into a personalised
                pack in minutes.
              </p>
            </div>
            <Link
              href="/record"
              className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3.5 text-[13.5px] font-semibold no-underline transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_22px_rgba(217,79,43,0.35)]"
            >
              <IcMic /> Start recording
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-edge flex items-center justify-center text-whisper">
              <IcSearch s={20} />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-medium text-text mb-1">
                No results
              </h3>
              <p className="text-[13px] text-soft font-light">
                Nothing matches "
                <span className="text-text font-medium">{search}</span>".
              </p>
            </div>
            <button
              onClick={() => setSearch("")}
              className="text-[12.5px] text-flame font-semibold hover:opacity-75 transition-opacity cursor-pointer"
            >
              Clear search →
            </button>
          </div>
        ) : (
          <>
            {search && (
              <p className="text-[11px] text-whisper mb-4">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
                &ldquo;{search}&rdquo;
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </>
        )}

        {/* bottom cta */}
        {!loading && packs.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-edge" />
            <Link
              href="/record"
              className="flex items-center gap-1.5 text-[12px] text-soft font-semibold hover:text-flame transition-colors no-underline"
            >
              <IcPlus /> Record another lecture
            </Link>
            <div className="h-px flex-1 bg-edge" />
          </div>
        )}
      </div>
    </div>
  );
}
