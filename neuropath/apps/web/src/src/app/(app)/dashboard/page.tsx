"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { studyPacksApi } from "@/lib/api/study-packs.api";
import { roadmapApi } from "@/lib/api/roadmap.api";
import type { StudyPack } from "@neuropath/types";
import type { RoadmapTask } from "@neuropath/types";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [recentPacks,  setRecentPacks]  = useState<StudyPack[]>([]);
  const [todayTasks,   setTodayTasks]   = useState<RoadmapTask[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const hasProfile = !!user?.learning_profile;
  const firstName  = user?.name?.split(" ")[0] ?? "there";
  const gradeLabel = user?.grade_level ? `Grade ${user.grade_level}` : "";

  useEffect(() => {
    studyPacksApi
      .list({ limit: 3 })
      .then(setRecentPacks)
      .catch(() => {})
      .finally(() => setLoadingPacks(false));
  }, []);

  useEffect(() => {
    roadmapApi
      .getTodaysTasks()
      .then(setTodayTasks)
      .catch(() => {})
      .finally(() => setLoadingTasks(false));
  }, []);

  const completedToday = todayTasks.filter(t => t.completed).length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12 pb-20">

      {/* ── Header ── */}
      <div className="mb-12">
        <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-[1.15] mb-1.5">
          Good to see you,{" "}
          <em className="not-italic text-[rgba(240,237,232,0.55)] italic">{firstName}.</em>
        </h1>
        <div className="flex items-center gap-2.5 text-[13.5px] text-[rgba(240,237,232,0.25)]">
          {gradeLabel && <span>{gradeLabel}</span>}
          {gradeLabel && hasProfile && (
            <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.13)] shrink-0" />
          )}
          {hasProfile && <span>Learning profile active</span>}
        </div>
      </div>

      {/* ── Diagnostic CTA banner ── */}
      {!hasProfile && (
        <div className="relative overflow-hidden rounded-[20px] border border-[rgba(217,79,43,0.22)] bg-gradient-to-br from-[rgba(217,79,43,0.10)] to-[rgba(217,79,43,0.04)] p-7 px-8 flex items-center justify-between gap-6 flex-wrap mb-10">
          <div className="absolute top-0 left-[20%] right-[60%] h-px bg-gradient-to-r from-transparent via-[#d94f2b] to-transparent" />
          <div>
            <h2 className="font-serif text-xl font-medium text-[#f0ede8] mb-1.5 tracking-[-0.01em]">
              Discover how your brain learns
            </h2>
            <p className="text-sm text-[rgba(240,237,232,0.55)] leading-relaxed font-light max-w-[440px]">
              Take the 20-minute diagnostic to unlock a fully personalised
              study system. No guessing — pure performance data.
            </p>
          </div>
          <Link
            href="/diagnostic"
            className="shrink-0 inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3.5 text-sm font-medium no-underline transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
          >
            Start Diagnostic
          </Link>
        </div>
      )}

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { n: recentPacks.length, l: "Study packs"      },
          { n: completedToday,     l: "Tasks done today" },
          { n: todayTasks.length,  l: "Tasks remaining"  },
        ].map(s => (
          <div
            key={s.l}
            className="bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 text-center"
          >
            <div className="font-serif text-[30px] font-semibold text-[#f0ede8] leading-none tracking-[-0.02em] mb-1">
              {s.n}
            </div>
            <div className="text-[11.5px] text-[rgba(240,237,232,0.25)] tracking-[0.04em]">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Recent Study Packs */}
        <SectionCard title="Recent Study Packs" linkHref="/study-packs" linkLabel="View all →">
          {loadingPacks ? (
            <SkeletonList count={3} />
          ) : recentPacks.length === 0 ? (
            <EmptyState>
              No study packs yet.{" "}
              <Link href="/record" className="text-[#e8603c] font-medium no-underline">
                Record your first lecture
              </Link>{" "}
              to get started.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentPacks.map(pack => (
                <Link
                  key={pack.id}
                  href={`/study-packs/${pack.id}/summary`}
                  className="flex items-center gap-3.5 px-3.5 py-3 bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-xl no-underline transition-all duration-200 hover:border-[rgba(255,255,255,0.13)] hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <div className="w-9 h-9 bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.15)] rounded-[9px] flex items-center justify-center shrink-0 text-base">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-[#f0ede8] truncate mb-0.5">
                      {pack.title}
                    </div>
                    <div className="text-[11.5px] text-[rgba(240,237,232,0.25)]">
                      {pack.flashcard_count} flashcards · {pack.quiz_count} questions
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Today's Tasks */}
        <SectionCard title="Today's Tasks" linkHref="/roadmap" linkLabel="View roadmap →">
          {loadingTasks ? (
            <SkeletonList count={2} />
          ) : todayTasks.length === 0 ? (
            <EmptyState>
              No tasks scheduled.{" "}
              <Link href="/roadmap/set-date" className="text-[#e8603c] font-medium no-underline">
                Set a test date
              </Link>{" "}
              to build your roadmap.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-2.5">
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 px-3.5 py-3 bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-xl transition-opacity duration-200 ${task.completed ? "opacity-45" : ""}`}
                >
                  <div
                    className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 mt-px transition-all duration-200 ${
                      task.completed
                        ? "bg-[#d94f2b] border-[#d94f2b]"
                        : "border-[rgba(255,255,255,0.13)]"
                    }`}
                  >
                    {task.completed && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[13.5px] text-[rgba(240,237,232,0.55)] leading-relaxed font-light flex-1 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Learning Profile */}
        {hasProfile && user?.learning_profile && (
          <SectionCard title="Your Learning Profile" linkHref="/diagnostic" linkLabel="Retake →">
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Practice",   value: user.learning_profile.practice   },
                { label: "Teach-Back", value: user.learning_profile.teach_back },
                { label: "Flashcards", value: user.learning_profile.flashcards },
                { label: "Visual Map", value: user.learning_profile.visual     },
              ]
                .sort((a, b) => b.value - a.value)
                .map(m => (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="text-[12.5px] text-[rgba(240,237,232,0.55)] w-[110px] shrink-0 font-light">
                      {m.label}
                    </span>
                    <div className="flex-1 h-[5px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full"
                        style={{ width: `${Math.round(m.value * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[rgba(240,237,232,0.25)] w-[34px] text-right shrink-0">
                      {Math.round(m.value * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </SectionCard>
        )}

        {/* Quick Record CTA */}
        <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-7 flex flex-col items-center justify-center text-center gap-4 min-h-[180px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]" />
          <div className="text-[32px] relative z-10">🎙</div>
          <div className="relative z-10">
            <div className="font-serif text-base font-medium text-[#f0ede8] mb-1.5">
              Record a lecture
            </div>
            <div className="text-[13.5px] text-[rgba(240,237,232,0.55)] font-light leading-[1.55] max-w-[220px] mx-auto">
              Turn any class into a personalised study pack in minutes.
            </div>
          </div>
          <Link
            href="/record"
            className="relative z-10 inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3.5 text-[13.5px] font-medium no-underline transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]"
          >
            Start Recording
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ── Reusable sub-components ── */

function SectionCard({
  title,
  linkHref,
  linkLabel,
  children,
}: {
  title:     string;
  linkHref:  string;
  linkLabel: string;
  children:  React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-[20px] p-7">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.018)] to-transparent pointer-events-none rounded-[inherit]" />
      <div className="relative z-10 flex items-center justify-between mb-[22px]">
        <span className="font-serif text-base font-medium text-[#f0ede8] tracking-[-0.01em]">
          {title}
        </span>
        <Link
          href={linkHref}
          className="text-xs text-[#d94f2b] no-underline font-medium tracking-[0.03em] transition-opacity duration-200 hover:opacity-75"
        >
          {linkLabel}
        </Link>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SkeletonList({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[52px] rounded-xl bg-[#1c1c22] animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-6 px-4 text-[13.5px] text-[rgba(240,237,232,0.25)] leading-relaxed">
      {children}
    </div>
  );
}
