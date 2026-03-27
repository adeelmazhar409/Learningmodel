"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { studyPacksApi } from "@/lib/api/study-packs.api";
import FlashcardViewer from "@/components/study-pack/FlashcardViewer";
import QuizViewer from "@/components/study-pack/QuizViewer";
import TeachBackViewer from "@/components/study-pack/TeachBackViewer";
import type { StudyPack } from "@neuropath/types";

type Tab = "summary" | "flashcards" | "quiz" | "teach-back";
const TABS: { id: Tab; label: string }[] = [
  { id: "summary",    label: "Summary"    },
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz",       label: "Quiz"       },
  { id: "teach-back", label: "Teach-back" },
];

export default function StudyPackPage() {
  const params = useParams();
  const packId = params.packId as string;
  const [pack,    setPack]    = useState<StudyPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<Tab>("summary");

  useEffect(() => {
    studyPacksApi.getById(packId).then(setPack).catch(() => {}).finally(() => setLoading(false));
  }, [packId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-[rgba(255,255,255,0.07)] border-t-[#e8603c] rounded-full animate-spin"/>
    </div>
  );
  if (!pack) return <div className="text-center py-20 text-[15px] text-[rgba(240,237,232,0.55)]">Study pack not found.</div>;

  return (
    <div className="max-w-[860px] mx-auto px-6 py-10 pb-20">
      <div className="mb-8">
        <p className="flex items-center gap-2 text-[11px] font-medium text-[#d94f2b] tracking-[2px] uppercase mb-2 before:block before:w-[18px] before:h-px before:bg-[#d94f2b]">Study Pack</p>
        <h1 className="font-serif text-[clamp(24px,3.5vw,36px)] font-medium text-[#f0ede8] tracking-[-0.02em] leading-tight mb-2.5">{pack.title}</h1>
        <div className="flex items-center gap-4 flex-wrap">
          {[`${pack.flashcard_count} flashcards`, `${pack.quiz_count} questions`, "Teach-back script included"].map((m, i) => (
            <span key={m} className={`text-[13px] text-[rgba(240,237,232,0.25)] flex items-center gap-4 ${i > 0 ? "before:block before:w-[3px] before:h-[3px] before:rounded-full before:bg-[rgba(255,255,255,0.13)]" : ""}`}>{m}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 py-2.5 bg-[rgba(217,79,43,0.05)] border border-[rgba(217,79,43,0.15)] rounded-xl mb-8 flex-wrap">
        <span className="text-[12px] text-[rgba(240,237,232,0.55)] font-light mr-2">Generated for your profile:</span>
        {Object.entries(pack.profile_snapshot).sort(([,a],[,b]) => b - a).slice(0,2).map(([m, v]) => (
          <span key={m} className="text-[11px] text-[#e8603c] border border-[rgba(217,79,43,0.22)] rounded-full px-2.5 py-0.5 bg-[rgba(217,79,43,0.06)] capitalize mr-1.5">
            {m.replace("_"," ")} {Math.round(v * 100)}%
          </span>
        ))}
      </div>

      <div className="flex gap-0.5 border-b border-[rgba(255,255,255,0.07)] mb-8 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-[18px] py-2.5 text-[13.5px] font-normal font-sans cursor-pointer bg-transparent border-none border-b-2 -mb-px whitespace-nowrap transition-all ${tab === t.id ? "text-[#f0ede8] border-[#d94f2b]" : "text-[rgba(240,237,232,0.55)] border-transparent hover:text-[#f0ede8]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <>
          <div className="relative overflow-hidden font-serif text-[clamp(16px,2.2vw,20px)] italic font-normal text-[#f0ede8] leading-relaxed tracking-[-0.01em] px-7 py-6 bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-2xl mb-5">
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#d94f2b] to-transparent"/>
            {pack.summary_short}
          </div>
          <p className="text-[11px] text-[#d94f2b] tracking-[1.6px] uppercase font-medium mb-3.5">Key points</p>
          <div className="flex flex-col gap-2.5">
            {pack.summary_bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 bg-[#141418] border border-[rgba(255,255,255,0.07)] rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d94f2b] shrink-0 mt-[7px]"/>
                <span className="text-sm text-[rgba(240,237,232,0.55)] leading-relaxed font-light">{b}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "flashcards" && <FlashcardViewer flashcards={pack.flashcards}/>}
      {tab === "quiz"       && <QuizViewer      questions={pack.quiz}/>}
      {tab === "teach-back" && <TeachBackViewer script={pack.teach_back} title={pack.title}/>}
    </div>
  );
}
