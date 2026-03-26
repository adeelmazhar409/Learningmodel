"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { studyPacksApi } from "@/lib/api/study-packs.api";
import { roadmapApi } from "@/lib/api/roadmap.api";
import type { StudyPack } from "@neuropath/types";
import type { RoadmapTask } from "@neuropath/types";

/* ── Reusable sub-components ── */
function SectionCard({
  title, linkHref, linkLabel, children,
}: {
  title: string; linkHref: string; linkLabel: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-edge rounded-lg p-7 relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-[rgba(255,255,255,0.018)] after:to-transparent after:pointer-events-none after:rounded-[inherit]">
      <div className="flex items-center justify-between mb-[22px]">
        <span className="font-serif text-base font-medium text-text tracking-[-0.01em]">{title}</span>
        <Link href={linkHref} className="text-xs text-flame no-underline font-medium tracking-[0.03em] hover:opacity-75 transition-opacity">
          {linkLabel}
        </Link>
      </div>
      {children}
    </div>
  );
}

function SkeletonList({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-6 text-sm text-whisper font-light leading-relaxed">
      {children}
    </div>
  );
}

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
    studyPacksApi.list({ limit: 3 }).then(setRecentPacks).catch(() => {}).finally(() => setLoadingPacks(false));
  }, []);

  useEffect(() => {
    roadmapApi.getTodaysTasks().then(setTodayTasks).catch(() => {}).finally(() => setLoadingTasks(false));
  }, []);

  const completedToday = todayTasks.filter(t => t.completed).length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 pt-12 pb-20">
      {/* ── Header ── */}
      <div className="mb-12">
        <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-medium text-text tracking-[-0.02em] leading-[1.15] mb-1.5">
          Welcome back, <em className="italic text-soft">{firstName}</em>
        </h1>
        <div className="text-[13.5px] text-whisper flex items-center gap-2.5">
          {gradeLabel && <span>{gradeLabel}</span>}
          {gradeLabel && <span className="w-1 h-1 rounded-full bg-edge-2 shrink-0" />}
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* ── CTA banner ── */}
      {!hasProfile && (
        <div className="bg-gradient-to-br from-[rgba(217,79,43,0.10)] to-[rgba(217,79,43,0.04)] border border-[rgba(217,79,43,0.22)] rounded-lg p-7 flex items-center justify-between gap-6 flex-wrap mb-10 relative overflow-hidden before:content-[''] before:absolute before:top-[-1px] before:left-[20%] before:right-[60%] before:h-px before:bg-gradient-to-r before:from-transparent before:via-flame before:to-transparent">
          <div>
            <h2 className="font-serif text-[20px] font-medium text-text mb-1.5 tracking-[-0.01em]">
              Discover your learning profile
            </h2>
            <p className="text-sm text-soft font-light leading-relaxed max-w-[440px]">
              Take a quick performance-based diagnostic to find out how your brain retains information.
              No guessing — pure performance data.
            </p>
          </div>
          <Link href="/diagnostic" className="btn-primary shrink-0">
            Start Diagnostic
          </Link>
        </div>
      )}

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { n: recentPacks.length, l: "Study packs" },
          { n: completedToday,     l: "Tasks done today" },
          { n: todayTasks.length,  l: "Tasks remaining" },
        ].map(s => (
          <div key={s.l} className="bg-surface border border-edge rounded-md p-5 text-center">
            <div className="font-serif text-[30px] font-semibold text-text leading-none tracking-[-0.02em] mb-1">
              {s.n}
            </div>
            <div className="text-[11.5px] text-whisper tracking-[0.04em]">{s.l}</div>
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
              <Link href="/record" className="text-ember font-medium no-underline">Record your first lecture</Link>{" "}
              to get started.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentPacks.map(pack => (
                <Link
                  key={pack.id}
                  href={`/study-packs/${pack.id}/summary`}
                  className="flex items-center gap-3.5 px-3.5 py-3 bg-[rgba(255,255,255,0.025)] border border-edge rounded-xl no-underline transition-all duration-200 hover:border-edge-2 hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <div className="w-9 h-9 bg-[rgba(217,79,43,0.08)] border border-[rgba(217,79,43,0.15)] rounded-[9px] flex items-center justify-center shrink-0 text-base">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-text truncate mb-0.5">{pack.title}</div>
                    <div className="text-[11.5px] text-whisper">
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
              <Link href="/roadmap/set-date" className="text-ember font-medium no-underline">Set a test date</Link>{" "}
              to build your roadmap.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-2.5">
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 px-3.5 py-3 bg-[rgba(255,255,255,0.025)] border border-edge rounded-xl transition-opacity duration-200 ${task.completed ? "opacity-45" : ""}`}
                >
                  <div
                    className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 mt-px transition-all duration-200 ${
                      task.completed
                        ? "border-flame bg-flame"
                        : "border-edge-2 bg-transparent"
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13.5px] font-medium mb-0.5 ${task.completed ? "line-through text-whisper" : "text-text"}`}>
                      {task.title}
                    </div>
                    <div className="text-[11.5px] text-whisper">
                      {task.duration_min} min · {task.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
