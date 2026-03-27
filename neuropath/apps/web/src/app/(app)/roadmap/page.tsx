"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { roadmapApi } from "@/lib/api/roadmap.api";
import TaskList from "@/components/roadmap/TaskList";
import type { Roadmap, RoadmapTask } from "@neuropath/types";
import dayjs from "dayjs";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roadmapApi.get().then(setRoadmap).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function handleTaskUpdate(updated: RoadmapTask) {
    if (!roadmap) return;
    setRoadmap({ ...roadmap, tasks: roadmap.tasks.map(t => t.id === updated.id ? updated : t) });
  }

  const daysLeft   = roadmap ? dayjs(roadmap.test_date).diff(dayjs(), "day") : null;
  const totalTasks = roadmap?.tasks.length ?? 0;
  const doneTasks  = roadmap?.tasks.filter(t => t.completed).length ?? 0;
  const pct        = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-[860px] mx-auto px-6 py-12 pb-20">
      <div className="mb-9">
        <p className="flex items-center gap-2 text-[11px] font-medium text-[#d94f2b] tracking-[2px] uppercase mb-2.5 before:block before:w-[18px] before:h-px before:bg-[#d94f2b]">Study Roadmap</p>
        <h1 className="font-serif text-[clamp(24px,3.5vw,36px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight mb-2.5">
          {roadmap ? `${roadmap.subject} — ${dayjs(roadmap.test_date).format("MMM D")}` : "Your Roadmap"}
        </h1>
        {roadmap && (
          <p className="text-[15px] text-[rgba(240,237,232,0.55)] font-light leading-relaxed">
            {daysLeft === 0 ? "Your test is today — good luck." : daysLeft && daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} until your test.` : "Your test date has passed."}
          </p>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-[rgba(255,255,255,0.07)] border-t-[#e8603c] rounded-full animate-spin"/>
        </div>
      )}

      {!loading && !roadmap && (
        <div className="flex flex-col items-center text-center py-16 gap-4">
          <div className="text-[36px]">📅</div>
          <div>
            <p className="font-serif text-[22px] font-medium text-[#f0ede8] mb-1.5">No roadmap yet</p>
            <p className="text-sm text-[rgba(240,237,232,0.55)] font-light leading-relaxed max-w-[360px]">Set a test date and we&apos;ll build a day-by-day study plan personalised to your learning profile.</p>
          </div>
          <Link href="/roadmap/set-date" className="inline-flex items-center gap-2 bg-[#f0ede8] text-[#0c0c0e] rounded-full px-7 py-3.5 text-sm font-medium no-underline transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_22px_rgba(0,0,0,0.3)]">Set a test date →</Link>
        </div>
      )}

      {!loading && roadmap && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[{ n: daysLeft ?? 0, l: "Days remaining" }, { n: doneTasks, l: "Tasks complete" }, { n: totalTasks - doneTasks, l: "Tasks remaining" }].map(s => (
              <div key={s.l} className="bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 text-center">
                <div className="font-serif text-[30px] font-semibold text-[#f0ede8] leading-none tracking-[-0.02em] mb-1">{s.n}</div>
                <div className="text-[11.5px] text-[rgba(240,237,232,0.25)] tracking-[0.04em]">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <div className="flex justify-between text-xs text-[rgba(240,237,232,0.25)] mb-2"><span>Overall progress</span><span>{pct}%</span></div>
            <div className="w-full h-[3px] bg-[rgba(255,255,255,0.07)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#d94f2b] to-[#e8603c] rounded-full transition-all duration-500" style={{ width: `${pct}%` }}/>
            </div>
          </div>
          <TaskList tasks={roadmap.tasks} onUpdate={handleTaskUpdate}/>
          <div className="mt-8 text-center">
            <Link href="/roadmap/set-date" className="text-[13px] text-[rgba(240,237,232,0.25)] no-underline hover:text-[rgba(240,237,232,0.55)] transition-colors">Change test date →</Link>
          </div>
        </>
      )}
    </div>
  );
}
