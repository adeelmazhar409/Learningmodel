import { callOrMock, get, post } from "./client";
import type {
  StartDiagnosticPayload,
  StartDiagnosticResponse,
  SubmitDiagnosticPayload,
  SubmitDiagnosticResponse,
  DiagnosticAttempt,
} from "@neuropath/types";

/* ─────────────────────────────────────────────────────────
   MOCK QUESTIONS
   Enough to run a full diagnostic flow in the browser
   without any backend connection.
───────────────────────────────────────────────────────── */
const MOCK_ROUND_QUESTIONS = {
  flashcards: [
    { id: "fq1", method: "flashcards" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "What is the process plants use to make food using sunlight?",       choices: ["Respiration", "Photosynthesis", "Transpiration", "Fermentation"], answer: "Photosynthesis", explanation: "Photosynthesis converts light energy into glucose." },
    { id: "fq2", method: "flashcards" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "Which gas do plants absorb during photosynthesis?",                  choices: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],               answer: "Carbon dioxide", explanation: "Plants take in CO₂ and release O₂." },
    { id: "fq3", method: "flashcards" as const, type: "mcq" as const, difficulty: "medium" as const, question: "Where in the cell does photosynthesis take place?",                  choices: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"],             answer: "Chloroplast",    explanation: "Chloroplasts contain chlorophyll which captures light." },
    { id: "fq4", method: "flashcards" as const, type: "mcq" as const, difficulty: "medium" as const, question: "What pigment in leaves captures light energy?",                      choices: ["Melanin", "Chlorophyll", "Carotene", "Hemoglobin"],               answer: "Chlorophyll",    explanation: "Chlorophyll gives leaves their green colour." },
    { id: "fq5", method: "flashcards" as const, type: "mcq" as const, difficulty: "hard"   as const, question: "What is the main sugar product of photosynthesis?",                  choices: ["Fructose", "Sucrose", "Glucose", "Starch"],                       answer: "Glucose",        explanation: "Glucose is produced and used for energy or stored as starch." },
  ],
  practice: [
    { id: "pq1", method: "practice" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "If you remove light from a plant, what happens to photosynthesis?",   choices: ["Speeds up", "Stops", "Continues normally", "Doubles"],            answer: "Stops",          explanation: "Light is required as the energy source." },
    { id: "pq2", method: "practice" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "A plant is placed in a dark room for a week. What will happen?",      choices: ["It grows faster", "It dies", "It produces more glucose", "No change"], answer: "It dies",    explanation: "Without light, photosynthesis cannot occur." },
    { id: "pq3", method: "practice" as const, type: "mcq" as const, difficulty: "medium" as const, question: "Why do leaves appear green?",                                         choices: ["They absorb green light", "They reflect green light", "They produce green gas", "Green is the colour of glucose"], answer: "They reflect green light", explanation: "Chlorophyll absorbs red and blue light, reflecting green." },
    { id: "pq4", method: "practice" as const, type: "mcq" as const, difficulty: "medium" as const, question: "What two raw materials are needed for photosynthesis?",                choices: ["Oxygen and glucose", "Water and carbon dioxide", "Nitrogen and oxygen", "Glucose and starch"], answer: "Water and carbon dioxide", explanation: "Water comes from roots, CO₂ from the air." },
    { id: "pq5", method: "practice" as const, type: "mcq" as const, difficulty: "hard"   as const, question: "Increasing CO₂ concentration (up to a point) will do what to the rate of photosynthesis?", choices: ["Decrease it", "Have no effect", "Increase it", "Stop it"], answer: "Increase it", explanation: "More CO₂ means more raw material available." },
  ],
  visual: [
    { id: "vq1", method: "visual" as const, type: "visual_label" as const, difficulty: "easy"   as const, question: "Which label represents where light energy is captured?",         choices: ["Chloroplast", "Nucleus", "Cell wall", "Vacuole"],                 answer: "Chloroplast",    explanation: "Chloroplasts are the site of light capture." },
    { id: "vq2", method: "visual" as const, type: "visual_label" as const, difficulty: "easy"   as const, question: "Which arrow shows carbon dioxide entering the leaf?",            choices: ["Arrow A (stomata)", "Arrow B (roots)", "Arrow C (stem)", "Arrow D (flower)"], answer: "Arrow A (stomata)", explanation: "CO₂ enters through tiny pores called stomata." },
    { id: "vq3", method: "visual" as const, type: "visual_label" as const, difficulty: "medium" as const, question: "What does the upward arrow from the leaf represent?",            choices: ["Glucose", "Water", "Oxygen", "Carbon dioxide"],                   answer: "Oxygen",         explanation: "Oxygen is released as a byproduct." },
    { id: "vq4", method: "visual" as const, type: "visual_label" as const, difficulty: "medium" as const, question: "Which part of the diagram shows water being absorbed?",          choices: ["Leaves", "Stem", "Roots", "Flowers"],                             answer: "Roots",          explanation: "Water is absorbed from soil through roots." },
    { id: "vq5", method: "visual" as const, type: "visual_label" as const, difficulty: "hard"   as const, question: "In the energy flow diagram, what is the first step?",           choices: ["Glucose storage", "Light absorption", "Oxygen release", "Water transport"], answer: "Light absorption", explanation: "Light energy must be captured before anything else can occur." },
  ],
  teach_back: [
    { id: "tq1", method: "teach_back" as const, type: "teach_back" as const, difficulty: "easy"   as const, question: "Explain photosynthesis as if you are teaching a younger student.", answer: "Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide." },
    { id: "tq2", method: "teach_back" as const, type: "teach_back" as const, difficulty: "easy"   as const, question: "Why do plants need sunlight? Explain in your own words.",       answer: "Sunlight provides the energy needed to power the chemical reactions in photosynthesis." },
    { id: "tq3", method: "teach_back" as const, type: "teach_back" as const, difficulty: "medium" as const, question: "What would happen if there were no chlorophyll in a plant?",   answer: "Without chlorophyll, plants could not capture light energy and photosynthesis would stop." },
    { id: "tq4", method: "teach_back" as const, type: "teach_back" as const, difficulty: "medium" as const, question: "Explain the relationship between photosynthesis and respiration.", answer: "Photosynthesis produces glucose and oxygen; respiration uses them to release energy." },
    { id: "tq5", method: "teach_back" as const, type: "teach_back" as const, difficulty: "hard"   as const, question: "Explain why photosynthesis is important for all living things, not just plants.", answer: "Photosynthesis produces the oxygen all animals breathe and forms the base of every food chain." },
  ],
};

/* 20 mixed recall questions — 5 from each method */
const MOCK_RECALL_QUESTIONS = [
  { id: "rq1",  method: "flashcards" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "What process do plants use to make food?",               choices: ["Respiration","Photosynthesis","Transpiration","Digestion"],     answer: "Photosynthesis",        explanation: "" },
  { id: "rq2",  method: "practice"   as const, type: "mcq" as const, difficulty: "easy"   as const, question: "Without light, photosynthesis will:",                    choices: ["Speed up","Stop","Slow down slightly","Double"],                 answer: "Stop",                  explanation: "" },
  { id: "rq3",  method: "visual"     as const, type: "mcq" as const, difficulty: "easy"   as const, question: "CO₂ enters the leaf through:",                           choices: ["Roots","Stomata","Stem","Petals"],                               answer: "Stomata",               explanation: "" },
  { id: "rq4",  method: "teach_back" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "Why is photosynthesis important to animals?",             choices: ["Produces glucose only","Produces oxygen we breathe","Makes water","Stores nitrogen"], answer: "Produces oxygen we breathe", explanation: "" },
  { id: "rq5",  method: "flashcards" as const, type: "mcq" as const, difficulty: "easy"   as const, question: "Which gas do plants release during photosynthesis?",      choices: ["Carbon dioxide","Nitrogen","Oxygen","Hydrogen"],                 answer: "Oxygen",                explanation: "" },
  { id: "rq6",  method: "practice"   as const, type: "mcq" as const, difficulty: "medium" as const, question: "Leaves appear green because chlorophyll:",                choices: ["Absorbs green light","Reflects green light","Produces green gas","Is green sugar"], answer: "Reflects green light", explanation: "" },
  { id: "rq7",  method: "visual"     as const, type: "mcq" as const, difficulty: "medium" as const, question: "Water is absorbed by the plant through its:",             choices: ["Leaves","Stem","Roots","Flowers"],                               answer: "Roots",                 explanation: "" },
  { id: "rq8",  method: "teach_back" as const, type: "mcq" as const, difficulty: "medium" as const, question: "Without chlorophyll, a plant would:",                    choices: ["Grow faster","Stop photosynthesising","Absorb more CO₂","Change colour only"], answer: "Stop photosynthesising", explanation: "" },
  { id: "rq9",  method: "flashcards" as const, type: "mcq" as const, difficulty: "medium" as const, question: "Photosynthesis takes place in the:",                      choices: ["Nucleus","Mitochondria","Chloroplast","Ribosome"],               answer: "Chloroplast",           explanation: "" },
  { id: "rq10", method: "practice"   as const, type: "mcq" as const, difficulty: "medium" as const, question: "The two raw materials needed for photosynthesis are:",    choices: ["Oxygen and glucose","Water and carbon dioxide","Nitrogen and oxygen","Starch and water"], answer: "Water and carbon dioxide", explanation: "" },
  { id: "rq11", method: "visual"     as const, type: "mcq" as const, difficulty: "medium" as const, question: "The first step in the energy flow of photosynthesis is:", choices: ["Glucose storage","Light absorption","Oxygen release","Water transport"], answer: "Light absorption",   explanation: "" },
  { id: "rq12", method: "teach_back" as const, type: "mcq" as const, difficulty: "medium" as const, question: "The relationship between photosynthesis and respiration:", choices: ["They are unrelated","Photosynthesis produces what respiration uses","Respiration produces what photosynthesis uses","They cancel each other out"], answer: "Photosynthesis produces what respiration uses", explanation: "" },
  { id: "rq13", method: "flashcards" as const, type: "mcq" as const, difficulty: "hard"   as const, question: "The main sugar produced by photosynthesis is:",           choices: ["Fructose","Sucrose","Glucose","Lactose"],                        answer: "Glucose",               explanation: "" },
  { id: "rq14", method: "practice"   as const, type: "mcq" as const, difficulty: "hard"   as const, question: "Increasing CO₂ concentration will (up to a limit):",     choices: ["Decrease photosynthesis","Have no effect","Increase photosynthesis","Stop photosynthesis"], answer: "Increase photosynthesis", explanation: "" },
  { id: "rq15", method: "visual"     as const, type: "mcq" as const, difficulty: "hard"   as const, question: "The upward arrow from the leaf in a photosynthesis diagram represents:", choices: ["Glucose","Water","Oxygen","Carbon dioxide"],           answer: "Oxygen",                explanation: "" },
  { id: "rq16", method: "teach_back" as const, type: "mcq" as const, difficulty: "hard"   as const, question: "Photosynthesis is important to all life because it:",     choices: ["Only feeds plants","Produces glucose and oxygen forming the base of all food chains","Makes rain","Stores carbon underground"], answer: "Produces glucose and oxygen forming the base of all food chains", explanation: "" },
  { id: "rq17", method: "flashcards" as const, type: "mcq" as const, difficulty: "hard"   as const, question: "Which pigment in leaves is responsible for capturing light energy?", choices: ["Melanin","Chlorophyll","Carotene","Hemoglobin"],           answer: "Chlorophyll",           explanation: "" },
  { id: "rq18", method: "practice"   as const, type: "mcq" as const, difficulty: "hard"   as const, question: "A plant kept in a dark room for a week will most likely:",choices: ["Grow faster","Survive on stored glucose briefly then die","Produce more oxygen","Absorb more water"], answer: "Survive on stored glucose briefly then die", explanation: "" },
  { id: "rq19", method: "visual"     as const, type: "mcq" as const, difficulty: "hard"   as const, question: "In the photosynthesis diagram, which enters through the roots?", choices: ["Carbon dioxide","Oxygen","Water","Glucose"],              answer: "Water",                 explanation: "" },
  { id: "rq20", method: "teach_back" as const, type: "mcq" as const, difficulty: "hard"   as const, question: "Sunlight provides what role in photosynthesis?",           choices: ["Raw material","Waste product","Energy source","Catalyst only"], answer: "Energy source",          explanation: "" },
];

const MOCK_START_RESPONSE: StartDiagnosticResponse = {
  attempt_id:       "mock-attempt-001",
  round_questions:  [
    ...MOCK_ROUND_QUESTIONS.flashcards,
    ...MOCK_ROUND_QUESTIONS.practice,
    ...MOCK_ROUND_QUESTIONS.visual,
    ...MOCK_ROUND_QUESTIONS.teach_back,
  ],
  recall_questions: MOCK_RECALL_QUESTIONS,
};

const MOCK_SUBMIT_RESPONSE: SubmitDiagnosticResponse = {
  scores: {
    flashcards:  { accuracy: 60, speed: 75, retention: 55, final: 63 },
    practice:    { accuracy: 88, speed: 82, retention: 84, final: 86 },
    visual:      { accuracy: 52, speed: 68, retention: 48, final: 54 },
    teach_back:  { accuracy: 74, speed: 71, retention: 78, final: 74 },
  },
  primary_method:   "practice",
  secondary_method: "teach_back",
  learning_profile: {
    practice:   0.45,
    teach_back: 0.28,
    flashcards: 0.17,
    visual:     0.10,
  },
};

/* ════════════════════════════════════════
   DIAGNOSTIC API
════════════════════════════════════════ */
export const diagnosticApi = {
  /* ── Start a new diagnostic attempt ── */
  start: (payload: StartDiagnosticPayload): Promise<StartDiagnosticResponse> =>
    callOrMock(
      () => post<StartDiagnosticResponse>("/api/diagnostic/start", payload),
      MOCK_START_RESPONSE,
      800
    ),

  /* ── Submit all answers and receive scored profile ── */
  submit: (payload: SubmitDiagnosticPayload): Promise<SubmitDiagnosticResponse> =>
    callOrMock(
      () => post<SubmitDiagnosticResponse>("/api/diagnostic/submit", payload),
      MOCK_SUBMIT_RESPONSE,
      1200
    ),

  /* ── Get a past attempt by ID ── */
  getAttempt: (attemptId: string): Promise<DiagnosticAttempt> =>
    callOrMock(
      () => get<DiagnosticAttempt>(`/api/diagnostic/attempts/${attemptId}`),
      {
        id:               attemptId,
        user_id:          "mock-user-001",
        subject:          "General (Critical Thinking)",
        grade_band:       "9-10",
        started_at:       new Date().toISOString(),
        completed_at:     new Date().toISOString(),
        answers:          [],
        scores:           MOCK_SUBMIT_RESPONSE.scores,
        primary_method:   "practice",
        secondary_method: "teach_back",
      },
      400
    ),
};
