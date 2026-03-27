"use client";
import { useState } from "react";
import type { RoadmapTask } from "@neuropath/types";
import { roadmapApi } from "@/lib/api/roadmap.api";
import toast from "react-hot-toast";
import CoachingMessage from "./CoachingMessage";
import type { CoachingMessage as CoachingMessageType } from "@neuropath/types";
import dayjs from "dayjs";

interface Props { tasks: RoadmapTask[]; onUpdate?: (updated: RoadmapTask) => void; }

const METHOD_LABELS: Record<string, string> = { flashcards:"Flashcards", practice:"Practice", visual:"Visual", teach_back:"Teach-back" };
const METHOD_BG: Record<string, string> = { flashcards:"rgba(217,79,43,0.12)", practice:"rgba(217,79,43,0.20)", visual:"rgba(217,79,43,0.08)", teach_back:"rgba(217,79,43,0.15)" };

export default function TaskList({ tasks, onUpdate }: Props) {
  const [completing, setCompleting] = useState<string | null>(null);
  const [coaching,   setCoaching]   = useState<CoachingMessageType | null>(null);
  const [localTasks, setLocalTasks] = useState<RoadmapTask[]>(tasks);

  const grouped = localTasks.reduce<Record<string, RoadmapTask[]>>((acc, t) => { if (!acc[t.day]) acc[t.day] = []; acc[t.day].push(t); return acc; }, {});
  const days = Object.keys(grouped).sort();
  const today = dayjs().format("YYYY-MM-DD");

  async function handleComplete(taskId: string) {
    setCompleting(taskId);
    try {
      const { task, coaching_message } = await roadmapApi.completeTask(taskId);
      setLocalTasks(ts => ts.map(t => t.id === taskId ? task : t));
      onUpdate?.(task); setCoaching(coaching_message);
    } catch { toast.error("Could not mark task as complete. Try again."); }
    finally { setCompleting(null); }
  }

  if (days.length === 0) return <div className="text-center py-12 text-[14px] text-[rgba(240,237,232,0.25)] leading-relaxed">No tasks yet. Set a test date to generate your study roadmap.</div>;

  return (
    <>
      {coaching && <CoachingMessage message={coaching} onDismiss={() => setCoaching(null)}/>}
      <div className="flex flex-col gap-7">
        {days.map(day => {
          const dayTasks  = grouped[day];
          const doneCount = dayTasks.filter(t => t.completed).length;
          const isToday   = day === today;
          const label     = isToday ? "Today" : dayjs(day).format("dddd, MMM D");
          return (
            <div key={day}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-serif text-[15px] font-medium text-[#f0ede8] tracking-[-0.01em]">{label}</span>
                {isToday && <span className="text-[10px] text-[#d94f2b] border border-[rgba(217,79,43,0.3)] rounded-full px-2.5 py-0.5 bg-[rgba(217,79,43,0.06)] uppercase tracking-[0.8px]">Today</span>}
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]"/>
              </div>
              <p className="text-[11.5px] text-[rgba(240,237,232,0.25)] mb-3">{doneCount} of {dayTasks.length} tasks complete</p>
              <div className="flex flex-col gap-2.5">
                {dayTasks.map(task => (
                  <div key={task.id} className={`flex items-center gap-3.5 px-4 py-3.5 bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl transition-opacity ${task.completed ? "opacity-50" : ""}`}>
                    <button
                      onClick={() => !task.completed && handleComplete(task.id)}
                      disabled={task.completed || completing === task.id}
                      className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all cursor-pointer
                        ${task.completed ? "bg-[#d94f2b] border-[#d94f2b] cursor-default" : completing === task.id ? "border-[rgba(217,79,43,0.3)] animate-pulse cursor-wait" : "border-[rgba(255,255,255,0.13)] hover:border-[rgba(217,79,43,0.5)] hover:bg-[rgba(217,79,43,0.08)]"}`}>
                      {task.completed && (
                        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                          <path d="M1 3.5L4 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-[#f0ede8] leading-relaxed font-light mb-1.5 ${task.completed ? "line-through" : ""}`}>{task.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10.5px] text-[#e8603c] rounded-full px-2.5 py-0.5 font-medium uppercase tracking-[0.8px]" style={{ background: METHOD_BG[task.method] ?? "rgba(217,79,43,0.1)" }}>
                          {METHOD_LABELS[task.method] ?? task.method}
                        </span>
                        <span className="text-[11.5px] text-[rgba(240,237,232,0.25)]">{task.duration_min} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
