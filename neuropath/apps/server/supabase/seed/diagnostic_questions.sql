-- NeuroPath Seed Data
-- Diagnostic questions for grade band 9-10 (Photosynthesis topic)
-- These are pre-loaded so the diagnostic works on day one

INSERT INTO diagnostic_questions (grade_band, method, type, difficulty, question, choices, answer, explanation) VALUES

-- ── Flashcard round ──────────────────────────────────────────────────────────
('9-10','flashcards','mcq','easy',
 'What is the process plants use to make food using sunlight?',
 '["Respiration","Photosynthesis","Transpiration","Fermentation"]',
 'Photosynthesis',
 'Photosynthesis converts light energy into glucose.'),

('9-10','flashcards','mcq','easy',
 'Which gas do plants absorb during photosynthesis?',
 '["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"]',
 'Carbon dioxide',
 'Plants take in CO₂ and release O₂.'),

('9-10','flashcards','mcq','medium',
 'Where in the cell does photosynthesis take place?',
 '["Nucleus","Mitochondria","Chloroplast","Ribosome"]',
 'Chloroplast',
 'Chloroplasts contain chlorophyll which captures light.'),

('9-10','flashcards','mcq','medium',
 'What pigment in leaves captures light energy?',
 '["Melanin","Chlorophyll","Carotene","Hemoglobin"]',
 'Chlorophyll',
 'Chlorophyll gives leaves their green colour.'),

('9-10','flashcards','mcq','hard',
 'What is the main sugar product of photosynthesis?',
 '["Fructose","Sucrose","Glucose","Starch"]',
 'Glucose',
 'Glucose is produced and used for energy or stored as starch.'),

-- ── Practice round ───────────────────────────────────────────────────────────
('9-10','practice','mcq','easy',
 'If you remove light from a plant, what happens to photosynthesis?',
 '["Speeds up","Stops","Continues normally","Doubles"]',
 'Stops',
 'Light is required as the energy source.'),

('9-10','practice','mcq','easy',
 'A plant is placed in a dark room for a week. What will happen?',
 '["It grows faster","It dies","It produces more glucose","No change"]',
 'It dies',
 'Without light, photosynthesis cannot occur.'),

('9-10','practice','mcq','medium',
 'Why do leaves appear green?',
 '["They absorb green light","They reflect green light","They produce green gas","Green is the colour of glucose"]',
 'They reflect green light',
 'Chlorophyll absorbs red and blue light, reflecting green.'),

('9-10','practice','mcq','medium',
 'What two raw materials are needed for photosynthesis?',
 '["Oxygen and glucose","Water and carbon dioxide","Nitrogen and oxygen","Glucose and starch"]',
 'Water and carbon dioxide',
 'Water comes from roots, CO₂ from the air.'),

('9-10','practice','mcq','hard',
 'Increasing CO₂ concentration (up to a point) will do what to photosynthesis?',
 '["Decrease it","Have no effect","Increase it","Stop it"]',
 'Increase it',
 'More CO₂ means more raw material available.'),

-- ── Visual round ─────────────────────────────────────────────────────────────
('9-10','visual','visual_label','easy',
 'Which label represents where light energy is captured?',
 '["Chloroplast","Nucleus","Cell wall","Vacuole"]',
 'Chloroplast',
 'Chloroplasts are the site of light capture.'),

('9-10','visual','visual_label','easy',
 'Which arrow shows carbon dioxide entering the leaf?',
 '["Arrow A (stomata)","Arrow B (roots)","Arrow C (stem)","Arrow D (flower)"]',
 'Arrow A (stomata)',
 'CO₂ enters through tiny pores called stomata.'),

('9-10','visual','visual_label','medium',
 'What does the upward arrow from the leaf represent?',
 '["Glucose","Water","Oxygen","Carbon dioxide"]',
 'Oxygen',
 'Oxygen is released as a byproduct.'),

('9-10','visual','visual_label','medium',
 'Which part of the diagram shows water being absorbed?',
 '["Leaves","Stem","Roots","Flowers"]',
 'Roots',
 'Water is absorbed from soil through roots.'),

('9-10','visual','visual_label','hard',
 'In the energy flow diagram, what is the first step?',
 '["Glucose storage","Light absorption","Oxygen release","Water transport"]',
 'Light absorption',
 'Light energy must be captured before anything else.'),

-- ── Teach-back round ─────────────────────────────────────────────────────────
('9-10','teach_back','teach_back','easy',
 'Explain photosynthesis as if you are teaching a younger student.',
 NULL,
 'Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide.',
 NULL),

('9-10','teach_back','teach_back','easy',
 'Why do plants need sunlight? Explain in your own words.',
 NULL,
 'Sunlight provides the energy needed to power the chemical reactions in photosynthesis.',
 NULL),

('9-10','teach_back','teach_back','medium',
 'What would happen if there were no chlorophyll in a plant?',
 NULL,
 'Without chlorophyll, plants could not capture light energy and photosynthesis would stop.',
 NULL),

('9-10','teach_back','teach_back','medium',
 'Explain the relationship between photosynthesis and respiration.',
 NULL,
 'Photosynthesis produces glucose and oxygen; respiration uses them to release energy.',
 NULL),

('9-10','teach_back','teach_back','hard',
 'Explain why photosynthesis is important for all living things, not just plants.',
 NULL,
 'Photosynthesis produces the oxygen all animals breathe and forms the base of every food chain.',
 NULL);
