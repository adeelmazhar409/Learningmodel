"use client";

import { useEffect, useState } from "react";
import { useParams }      from "next/navigation";
import { studyPacksApi }  from "@/lib/api/study-packs.api";
import FlashcardViewer    from "@/components/study-pack/FlashcardViewer";
import QuizViewer         from "@/components/study-pack/QuizViewer";
import TeachBackViewer    from "@/components/study-pack/TeachBackViewer";
import type { StudyPack } from "@neuropath/types";

type Tab = "summary" | "flashcards" | "quiz" | "teach-back";

const TABS: { id: Tab; label: string }[] = [
  { id: "summary",    label: "Summary"    },
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz",       label: "Quiz"       },
  { id: "teach-back", label: "Teach-back" },
];

export default function StudyPackPage() {
  const params            = useParams();
  const packId            = params.packId as string;
  const [pack, setPack]   = useState<StudyPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]     = useState<Tab>("summary");

  useEffect(() => {
    studyPacksApi
      .getById(packId)
      .then(setPack)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [packId]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 24px" }}>
      <div style={{ width:28, height:28, border:"2px solid var(--edge)", borderTopColor:"var(--ember)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
    </div>
  );

  if (!pack) return (
    <div style={{ textAlign:"center", padding:"80px 24px", color:"var(--soft)", fontSize:15 }}>
      Study pack not found.
    </div>
  );

  return (
    <>
      <style>{`
        .sp-page { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }

        /* Header */
        .sp-header { margin-bottom: 32px; }
        .sp-eyebrow {
          font-size: 11px; color: var(--flame); letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 8px; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
        }
        .sp-eyebrow::before { content:''; display:block; width:18px; height:1px; background:var(--flame); }
        .sp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 500; color: var(--text);
          letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 10px;
        }
        .sp-meta { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
        .sp-meta-item { font-size: 13px; color: var(--whisper); display:flex; align-items:center; gap:6px; }
        .sp-meta-dot  { width:3px; height:3px; border-radius:50%; background:var(--edge2); }

        /* Profile snapshot */
        .sp-profile-row {
          display: flex; align-items:center; gap:10px;
          padding: 12px 16px;
          background: rgba(217,79,43,0.05);
          border: 1px solid rgba(217,79,43,0.15);
          border-radius: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .sp-profile-label { font-size:12px; color:var(--soft); font-weight:300; flex-shrink:0; }
        .sp-profile-pills { display:flex; gap:8px; flex-wrap:wrap; }
        .sp-profile-pill {
          font-size:11px; color:var(--ember);
          border:1px solid rgba(217,79,43,0.22);
          border-radius:100px; padding:2px 10px;
          letter-spacing:0.5px; background:rgba(217,79,43,0.06);
          text-transform:capitalize;
        }

        /* Tabs */
        .sp-tabs {
          display: flex; gap: 2px;
          border-bottom: 1px solid var(--edge);
          margin-bottom: 32px;
          overflow-x: auto;
        }
        .sp-tab {
          padding: 10px 18px;
          font-size: 13.5px; font-weight: 400;
          color: var(--soft);
          background: none; border: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s, border-color 0.2s;
          white-space: nowrap;
          margin-bottom: -1px;
        }
        .sp-tab:hover { color: var(--text); }
        .sp-tab.active { color: var(--text); border-bottom-color: var(--flame); }

        /* Summary */
        .sp-summary-short {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 2.2vw, 20px);
          font-style: italic;
          font-weight: 400;
          color: var(--text);
          line-height: 1.6;
          letter-spacing: -0.01em;
          padding: 24px 28px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 16px;
          margin-bottom: 20px;
          position: relative; overflow:hidden;
        }
        .sp-summary-short::before {
          content:'';
          position:absolute; top:-1px; left:20%; right:20%;
          height:1px;
          background:linear-gradient(to right, transparent, var(--flame), transparent);
        }
        .sp-bullets-label {
          font-size:11px; color:var(--flame); letter-spacing:1.6px;
          text-transform:uppercase; margin-bottom:14px; font-weight:500;
        }
        .sp-bullets { display:flex; flex-direction:column; gap:10px; }
        .sp-bullet {
          display:flex; align-items:flex-start; gap:12px;
          padding:13px 16px;
          background:var(--surface); border:1px solid var(--edge);
          border-radius:12px;
          font-size:14px; color:var(--soft); line-height:1.6; font-weight:300;
        }
        .sp-bullet-dot {
          width:6px; height:6px; border-radius:50%; background:var(--flame);
          flex-shrink:0; margin-top:7px;
        }

        @media(max-width:640px){
          .sp-page { padding:28px 18px 60px; }
        }
      `}</style>

      <div className="sp-page">
        {/* Header */}
        <div className="sp-header">
          <p className="sp-eyebrow">Study Pack</p>
          <h1 className="sp-title">{pack.title}</h1>
          <div className="sp-meta">
            <span className="sp-meta-item">{pack.flashcard_count} flashcards</span>
            <span className="sp-meta-dot"/>
            <span className="sp-meta-item">{pack.quiz_count} questions</span>
            <span className="sp-meta-dot"/>
            <span className="sp-meta-item">Teach-back script included</span>
          </div>
        </div>

        {/* Profile snapshot */}
        <div className="sp-profile-row">
          <span className="sp-profile-label">Generated for your profile:</span>
          <div className="sp-profile-pills">
            {Object.entries(pack.profile_snapshot)
              .sort(([,a],[,b]) => b - a)
              .slice(0,2)
              .map(([m, v]) => (
                <span className="sp-profile-pill" key={m}>
                  {m.replace("_"," ")} {Math.round(v * 100)}%
                </span>
              ))
            }
          </div>
        </div>

        {/* Tabs */}
        <div className="sp-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`sp-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "summary" && (
          <>
            <p className="sp-summary-short">{pack.summary_short}</p>
            <p className="sp-bullets-label">Key points</p>
            <div className="sp-bullets">
              {pack.summary_bullets.map((b, i) => (
                <div className="sp-bullet" key={i}>
                  <div className="sp-bullet-dot"/>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "flashcards" && <FlashcardViewer flashcards={pack.flashcards}/>}
        {tab === "quiz"       && <QuizViewer      questions={pack.quiz}/>}
        {tab === "teach-back" && <TeachBackViewer script={pack.teach_back} title={pack.title}/>}
      </div>
    </>
  );
}
