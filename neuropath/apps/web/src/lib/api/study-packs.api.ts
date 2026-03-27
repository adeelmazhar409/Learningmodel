import { callOrMock, get } from "./client";
import type { StudyPack, ListStudyPacksParams } from "@neuropath/types";

const MOCK_PACKS: StudyPack[] = [
  {
    id: "mock-pack-001", user_id: "mock-user-001", recording_id: "mock-rec-001",
    title: "Biology — Photosynthesis", status: "ready",
    summary_short: "Photosynthesis is the process plants use to convert light energy into glucose.",
    summary_bullets: ["Occurs in chloroplasts","Chlorophyll captures light","Raw materials: water and CO₂","Products: glucose and oxygen"],
    flashcards: [
      { id:"fc1", question:"What is photosynthesis?",         answer:"Converting light energy into glucose.", difficulty:"easy"   },
      { id:"fc2", question:"Where does it take place?",       answer:"In the chloroplasts.",                 difficulty:"easy"   },
      { id:"fc3", question:"What pigment captures light?",    answer:"Chlorophyll.",                         difficulty:"easy"   },
      { id:"fc4", question:"Two raw materials needed?",       answer:"Water and carbon dioxide.",            difficulty:"easy"   },
      { id:"fc5", question:"What gas is released?",           answer:"Oxygen.",                              difficulty:"medium" },
    ],
    quiz: [
      { id:"qz1", type:"mcq", question:"Main product of photosynthesis?", choices:["Oxygen","Glucose","Starch","CO₂"], answer:"Glucose", explanation:"Glucose is the primary product." },
      { id:"qz2", type:"mcq", question:"Photosynthesis stops when?",      choices:["Light removed","CO₂ added","Water added","Night"], answer:"Light removed", explanation:"Light is the energy source." },
      { id:"qz3", type:"mcq", question:"Which part absorbs water?",       choices:["Leaves","Stem","Roots","Flowers"], answer:"Roots", explanation:"Roots absorb water from soil." },
      { id:"qz4", type:"mcq", question:"More CO₂ will?",                  choices:["Decrease rate","No effect","Increase rate","Stop it"], answer:"Increase rate", explanation:"More raw material available." },
      { id:"qz5", type:"mcq", question:"Why important for animals?",      choices:["Makes food","Produces oxygen","Removes water","Stores nitrogen"], answer:"Produces oxygen", explanation:"All animals rely on the oxygen." },
    ],
    teach_back: "Let me explain photosynthesis simply. Plants are like tiny factories that make their own food. They take in sunlight, water from the ground, and carbon dioxide from the air. Inside special parts of their cells called chloroplasts they use the sun's energy to combine water and carbon dioxide into glucose. As a bonus, the process releases oxygen which we all breathe.",
    flashcard_count: 5, quiz_count: 5,
    profile_snapshot: { practice: 0.45, teach_back: 0.28, flashcards: 0.17, visual: 0.10 },
    created_at: new Date(Date.now()-86400000).toISOString(), updated_at: new Date(Date.now()-86400000).toISOString(),
  },
];

export const studyPacksApi = {
  list: (params?: ListStudyPacksParams): Promise<StudyPack[]> =>
    callOrMock(
      async () => {
        const data = await get<{ packs: StudyPack[] }>("/api/study-packs", { params });
        return data.packs;
      },
      params?.limit ? MOCK_PACKS.slice(0, params.limit) : MOCK_PACKS,
      500
    ),

  getById: (packId: string): Promise<StudyPack> =>
    callOrMock(
      async () => {
        const data = await get<{ pack: StudyPack }>(`/api/study-packs/${packId}`);
        return data.pack;
      },
      MOCK_PACKS[0],
      400
    ),
};
