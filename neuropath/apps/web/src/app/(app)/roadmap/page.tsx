"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { roadmapApi } from "../../../lib/api/roadmap.api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

/* ─────────────────────────────────────────
   Local types — safe subsets
───────────────────────────────────────── */
interface Task {
  id: string;
  title: string;
  subject?: string;
  method: string;
  day: string;
  duration_min: number;
  completed: boolean;
  completed_at: string | null;
  order: number;
}

interface Roadmap {
  id: string;
  subject: string;
  test_date: string;
  days_until_test: number;
  tasks: Task[];
}

/* ─────────────────────────────────────────
   SVG Icons
───────────────────────────────────────── */
function IcCheck({ s = 10 }: { s?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IcMap({ s = 14 }: { s?: number }) {
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
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
function IcCalendar({ s = 16 }: { s?: number }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IcClock({ s = 11 }: { s?: number }) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IcLoader({ s = 16 }: { s?: number }) {
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
      className="animate-spin"
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}
function IcChevDown({ s = 14 }: { s?: number }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Method badge colours
───────────────────────────────────────── */
const METHOD_STYLE: Record<string, string> = {
  flashcards:
    "bg-[rgba(217,79,43,0.1)] border-[rgba(217,79,43,0.22)] text-ember",
  practice: "bg-[rgba(217,79,43,0.16)] border-[rgba(217,79,43,0.3)] text-flame",
  visual:
    "bg-[rgba(99,102,241,0.1)] border-[rgba(99,102,241,0.22)] text-indigo-400",
  teach_back:
    "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-green-400",
};
const METHOD_LABEL: Record<string, string> = {
  flashcards: "Flashcards",
  practice: "Practice",
  visual: "Visual",
  teach_back: "Teach-back",
};

/* ─────────────────────────────────────────
   Task row component
───────────────────────────────────────── */
function TaskRow({
  task,
  completing,
  onComplete,
}: {
  task: Task;
  completing: string | null;
  onComplete: (id: string) => void;
}) {
  const isBusy = completing === task.id;
  const badge = METHOD_STYLE[task.method] ?? "bg-lift border-edge text-whisper";
  const label = METHOD_LABEL[task.method] ?? task.method;

  return (
    <div
      className={`flex items-start gap-3 px-3.5 py-3.5 rounded-xl border transition-all duration-200 ${
        task.completed
          ? "bg-lift border-edge opacity-45"
          : "bg-lift border-edge hover:border-edge-2"
      }`}
    >
      {/* checkbox */}
      <button
        onClick={() => !task.completed && onComplete(task.id)}
        disabled={task.completed || isBusy}
        aria-label={task.completed ? "Task complete" : "Mark complete"}
        className={`mt-0.5 w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          task.completed
            ? "bg-flame border-flame text-white"
            : isBusy
              ? "border-ember opacity-60"
              : "border-edge-2 hover:border-ember"
        }`}
      >
        {task.completed ? <IcCheck /> : isBusy ? <IcLoader s={10} /> : null}
      </button>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] sm:text-[13.5px] font-medium mb-1.5 ${
            task.completed ? "line-through text-whisper" : "text-text"
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full border text-[10.5px] font-semibold ${badge}`}
          >
            {label}
          </span>
          <span className="flex items-center gap-1 text-[10.5px] text-whisper">
            <IcClock />
            {task.duration_min} min
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Day group component
───────────────────────────────────────── */
function DayGroup({
  day,
  tasks,
  completing,
  onComplete,
}: {
  day: string;
  tasks: Task[];
  completing: string | null;
  onComplete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const today = dayjs().format("YYYY-MM-DD");
  const isToday = day === today;
  const done = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const allDone = done === total;

  const dayLabel = isToday ? "Today" : dayjs(day).format("dddd, MMM D");

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all ${isToday ? "border-[rgba(217,79,43,0.25)]" : "border-edge"}`}
    >
      {/* day header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-surface cursor-pointer border-none transition-colors hover:bg-lift"
      >
        <div className="flex items-center gap-3">
          {isToday && (
            <div className="w-2 h-2 rounded-full bg-flame animate-pulse shrink-0" />
          )}
          <span
            className={`font-serif text-[14px] sm:text-[15px] font-medium tracking-[-0.01em] ${isToday ? "text-text" : "text-soft"}`}
          >
            {dayLabel}
          </span>
          {allDone && (
            <span className="px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] text-green-400 text-[10px] font-semibold">
              Complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-whisper font-medium">
            {done}/{total}
          </span>
          <div
            className={`text-whisper transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
          >
            <IcChevDown />
          </div>
        </div>
      </button>

      {/* tasks */}
      {open && (
        <div className="flex flex-col gap-2 p-3 bg-ink">
          {tasks
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                completing={completing}
                onComplete={onComplete}
              />
            ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat card
───────────────────────────────────────── */
function StatBox({
  value,
  label,
  accent,
}: {
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 text-center ${accent ? "bg-gradient-to-br from-[rgba(217,79,43,0.12)] to-[rgba(217,79,43,0.03)] border-[rgba(217,79,43,0.22)]" : "bg-surface border-edge"}`}
    >
      {accent && (
        <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-flame opacity-10 blur-2xl pointer-events-none" />
      )}
      <p
        className={`font-serif text-[26px] sm:text-[30px] font-semibold leading-none tracking-[-0.03em] mb-1 ${accent ? "text-ember" : "text-text"}`}
      >
        {value}
      </p>
      <p className="text-[10px] text-whisper tracking-[0.07em] uppercase font-semibold">
        {label}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    roadmapApi
      .get()
      .then((d) => setRoadmap(d as Roadmap))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleComplete(taskId: string) {
    setCompleting(taskId);
    try {
      const { task } = await roadmapApi.completeTask(taskId);
      setRoadmap((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === taskId ? (task as Task) : t,
              ),
            }
          : prev,
      );
      toast.success("Task marked complete!");
    } catch {
      toast.error("Could not complete task. Try again.");
    } finally {
      setCompleting(null);
    }
  }

  const daysLeft = roadmap
    ? dayjs(roadmap.test_date).diff(dayjs(), "day")
    : null;
  const total = roadmap?.tasks.length ?? 0;
  const done = roadmap?.tasks.filter((t) => t.completed).length ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  /* Group tasks by day */
  const grouped = (roadmap?.tasks ?? []).reduce<Record<string, Task[]>>(
    (acc, t) => {
      if (!acc[t.day]) acc[t.day] = [];
      acc[t.day].push(t);
      return acc;
    },
    {},
  );
  const sortedDays = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-ink">
      {/* glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[460px] h-[280px] pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(217,79,43,0.06)] to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[860px] mx-auto px-4 sm:px-6 pt-6 pb-28">
        {/* header */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-[10px] font-semibold text-flame tracking-[2.5px] uppercase mb-2.5">
            <span className="w-4 h-px bg-flame" />
            Study Roadmap
          </p>
          <h1 className="font-serif text-[clamp(22px,5vw,38px)] font-medium text-text tracking-[-0.03em] leading-tight mb-2">
            {roadmap
              ? `${roadmap.subject} — ${dayjs(roadmap.test_date).format("MMM D")}`
              : "Your Roadmap"}
          </h1>
          {roadmap && (
            <p className="text-[13.5px] sm:text-[14.5px] text-soft font-light">
              {daysLeft === 0
                ? "Your test is today — good luck!"
                : daysLeft && daysLeft > 0
                  ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} until your test.`
                  : "Your test date has passed."}
            </p>
          )}
        </div>

        {/* loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-soft">
            <div className="w-6 h-6 border-2 border-edge border-t-ember rounded-full animate-spin" />
            <span className="text-[13px] font-light">
              Loading your roadmap…
            </span>
          </div>
        )}

        {/* no roadmap */}
        {!loading && !roadmap && (
          <div className="flex flex-col items-center gap-5 py-20 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-surface border border-edge flex items-center justify-center text-whisper">
              <IcCalendar s={28} />
            </div>
            <div>
              <h2 className="font-serif text-[20px] sm:text-[22px] font-medium text-text mb-2">
                No roadmap yet
              </h2>
              <p className="text-[13px] sm:text-[14px] text-soft font-light max-w-[300px] leading-relaxed">
                Set a test date and we&apos;ll build a day-by-day personalised
                study plan.
              </p>
            </div>
            <Link
              href="/roadmap/set-date"
              className="flex items-center gap-2 bg-gradient-to-br from-ember to-flame text-white rounded-full px-6 py-3.5 text-[13.5px] font-semibold no-underline transition-all hover:opacity-90 active:scale-95 shadow-[0_4px_22px_rgba(217,79,43,0.35)]"
            >
              <IcCalendar s={14} /> Set a test date
            </Link>
          </div>
        )}

        {/* roadmap content */}
        {!loading && roadmap && (
          <>
            {/* stats */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
              <StatBox value={daysLeft ?? 0} label="Days left" />
              <StatBox value={done} label="Complete" accent />
              <StatBox value={total - done} label="Remaining" />
            </div>

            {/* progress bar */}
            <div className="relative overflow-hidden bg-surface border border-edge rounded-2xl p-4 sm:p-5 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <IcMap s={13} />
                    <span className="text-[12.5px] font-semibold text-text">
                      Overall progress
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-ember">
                    {pct}%
                  </span>
                </div>
                <div className="h-2 bg-lift rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-flame to-ember rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-whisper mt-2 font-light">
                  {done} of {total} tasks complete
                </p>
              </div>
            </div>

            {/* task groups */}
            <div className="flex flex-col gap-3">
              {sortedDays.map((day) => (
                <DayGroup
                  key={day}
                  day={day}
                  tasks={grouped[day]}
                  completing={completing}
                  onComplete={handleComplete}
                />
              ))}
            </div>

            {/* change date */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-edge" />
              <Link
                href="/roadmap/set-date"
                className="text-[12px] text-whisper font-semibold hover:text-soft transition-colors no-underline"
              >
                Change test date →
              </Link>
              <div className="h-px flex-1 bg-edge" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
