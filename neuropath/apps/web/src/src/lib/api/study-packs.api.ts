import { callOrMock, get } from "./client";
import type { StudyPack, ListStudyPacksParams } from "@neuropath/types";

/* ── Mock study packs ── */
const MOCK_PACKS: StudyPack[] = [
  {
    id:           "mock-pack-001",
    user_id:      "mock-user-001",
    recording_id: "mock-rec-001",
    title:        "Biology — Photosynthesis",
    status:       "ready",

    summary_short:
      "Photosynthesis is the process plants use to convert light energy into glucose using water and carbon dioxide, releasing oxygen as a byproduct.",
    summary_bullets: [
      "Photosynthesis occurs in the chloroplasts inside plant cells",
      "Chlorophyll captures light energy — it gives leaves their green colour",
      "Raw materials: water (from roots) and carbon dioxide (from air via stomata)",
      "Products: glucose (stored energy) and oxygen (released into atmosphere)",
      "The rate of photosynthesis increases with more light and more CO₂ up to a limit",
      "All animals ultimately depend on photosynthesis for food and oxygen",
    ],

    flashcards: [
      { id: "fc1", question: "What is photosynthesis?",                         answer: "The process plants use to convert light energy into glucose.",      difficulty: "easy"   },
      { id: "fc2", question: "Where does photosynthesis take place?",           answer: "In the chloroplasts of plant cells.",                               difficulty: "easy"   },
      { id: "fc3", question: "What pigment captures light energy?",             answer: "Chlorophyll.",                                                      difficulty: "easy"   },
      { id: "fc4", question: "What two raw materials are needed?",              answer: "Water and carbon dioxide.",                                         difficulty: "easy"   },
      { id: "fc5", question: "What gas is released as a byproduct?",           answer: "Oxygen.",                                                           difficulty: "easy"   },
      { id: "fc6", question: "What sugar is produced?",                         answer: "Glucose.",                                                          difficulty: "medium" },
      { id: "fc7", question: "How does CO₂ enter the leaf?",                    answer: "Through tiny pores called stomata.",                                difficulty: "medium" },
      { id: "fc8", question: "Why do leaves appear green?",                     answer: "Chlorophyll absorbs red and blue light, reflecting green.",         difficulty: "medium" },
    ],

    quiz: [
      { id: "qz1", type: "mcq", question: "What is the main product of photosynthesis?",                          choices: ["Oxygen","Glucose","Starch","Carbon dioxide"],               answer: "Glucose",             explanation: "Glucose is the primary energy-storing product." },
      { id: "qz2", type: "mcq", question: "What happens to photosynthesis if light is removed?",                  choices: ["Speeds up","Stops","Slows slightly","Doubles"],              answer: "Stops",               explanation: "Light is the energy source — without it the process cannot continue." },
      { id: "qz3", type: "mcq", question: "Which part of the plant absorbs water?",                              choices: ["Leaves","Stem","Roots","Flowers"],                           answer: "Roots",               explanation: "Water is absorbed from soil through the roots." },
      { id: "qz4", type: "mcq", question: "Increasing CO₂ (up to a limit) will do what to photosynthesis rate?", choices: ["Decrease it","Have no effect","Increase it","Stop it"],      answer: "Increase it",         explanation: "More CO₂ means more raw material available for the reaction." },
      { id: "qz5", type: "mcq", question: "Why is photosynthesis important to animals?",                         choices: ["Makes food for plants","Produces oxygen and forms food chains","Removes water","Stores nitrogen"], answer: "Produces oxygen and forms food chains", explanation: "All animals rely on the oxygen and the food energy photosynthesis creates." },
    ],

    teach_back:
      "Let me explain photosynthesis simply. Plants are like tiny factories that make their own food. They take in sunlight, water from the ground, and carbon dioxide from the air. Inside special parts of their cells called chloroplasts — which contain a green chemical called chlorophyll — they use the sun's energy to combine water and carbon dioxide into glucose. Glucose is the plant's food and fuel. As a bonus, the process releases oxygen which we all breathe. So next time you take a breath, thank a plant.",

    flashcard_count: 8,
    quiz_count:      5,

    profile_snapshot: {
      practice:   0.45,
      teach_back: 0.28,
      flashcards: 0.17,
      visual:     0.10,
    },

    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id:           "mock-pack-002",
    user_id:      "mock-user-001",
    recording_id: "mock-rec-002",
    title:        "Chemistry — Atomic Structure",
    status:       "ready",

    summary_short:
      "An atom consists of a nucleus (protons and neutrons) surrounded by electrons in shells. The atomic number defines the element; the mass number is protons plus neutrons.",
    summary_bullets: [
      "Atoms are the smallest units of chemical elements",
      "Nucleus contains protons (positive) and neutrons (neutral)",
      "Electrons (negative) orbit in shells around the nucleus",
      "Atomic number = number of protons — this defines the element",
      "Mass number = protons + neutrons",
      "Atoms with the same protons but different neutrons are called isotopes",
    ],

    flashcards: [
      { id: "fc1", question: "What charge does a proton carry?",   answer: "Positive.",                                    difficulty: "easy"   },
      { id: "fc2", question: "What charge does an electron carry?",answer: "Negative.",                                    difficulty: "easy"   },
      { id: "fc3", question: "What charge does a neutron carry?",  answer: "No charge (neutral).",                         difficulty: "easy"   },
      { id: "fc4", question: "What is the atomic number?",         answer: "The number of protons in the nucleus.",        difficulty: "easy"   },
      { id: "fc5", question: "What is the mass number?",           answer: "The total number of protons and neutrons.",    difficulty: "medium" },
      { id: "fc6", question: "Where are electrons found?",         answer: "In shells (energy levels) around the nucleus.",difficulty: "medium" },
    ],

    quiz: [
      { id: "qz1", type: "mcq", question: "What defines which element an atom belongs to?", choices: ["Mass number","Number of neutrons","Atomic number","Number of electrons"], answer: "Atomic number", explanation: "The atomic number (protons) uniquely identifies the element." },
      { id: "qz2", type: "mcq", question: "Where are protons and neutrons found?",          choices: ["Electron shells","Nucleus","Outer orbit","Energy levels"],                answer: "Nucleus",        explanation: "The nucleus sits at the centre of the atom." },
      { id: "qz3", type: "mcq", question: "What is the mass number of an atom?",            choices: ["Protons only","Electrons only","Protons + neutrons","Protons + electrons"], answer: "Protons + neutrons", explanation: "Electrons have negligible mass." },
      { id: "qz4", type: "mcq", question: "Atoms of the same element with different neutrons are called:", choices: ["Ions","Isotopes","Molecules","Compounds"], answer: "Isotopes", explanation: "Isotopes have the same atomic number but different mass numbers." },
      { id: "qz5", type: "mcq", question: "What charge does the overall nucleus have?",     choices: ["Negative","Neutral","Positive","Varies"],                                 answer: "Positive",       explanation: "The nucleus contains protons (positive) and neutral neutrons." },
    ],

    teach_back:
      "Think of an atom like a tiny solar system. At the centre is the nucleus, made of protons which are positive and neutrons which have no charge. Orbiting around the outside are electrons, which are negative. The number of protons tells you what element it is — that is the atomic number. Carbon always has 6 protons. If you change the number of protons you get a different element entirely.",

    flashcard_count: 6,
    quiz_count:      5,

    profile_snapshot: {
      practice:   0.45,
      teach_back: 0.28,
      flashcards: 0.17,
      visual:     0.10,
    },

    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

/* ════════════════════════════════════════
   STUDY PACKS API
════════════════════════════════════════ */
export const studyPacksApi = {
  /* ── List all study packs (optionally limited) ── */
  list: (params?: ListStudyPacksParams): Promise<StudyPack[]> =>
    callOrMock(
      () => get<StudyPack[]>("/api/study-packs", { params }),
      params?.limit ? MOCK_PACKS.slice(0, params.limit) : MOCK_PACKS,
      500
    ),

  /* ── Get a single study pack by ID ── */
  getById: (packId: string): Promise<StudyPack> =>
    callOrMock(
      () => get<StudyPack>(`/api/study-packs/${packId}`),
      MOCK_PACKS.find(p => p.id === packId) ?? MOCK_PACKS[0],
      400
    ),
};
