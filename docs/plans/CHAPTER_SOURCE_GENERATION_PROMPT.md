# CLEP Humanities App — Chapter 2 Source File Generation Prompt

## HOW TO USE THIS PROMPT

1. Copy everything from START PROMPT to END PROMPT below
2. Paste it into Claude, ChatGPT-4o, or Gemini 1.5 Pro
3. Do not change the exact structure rules
4. The AI will output a complete .CANONICAL.txt file
5. Save the output as CHAPTER 2 SECTION 1-6.CANONICAL.txt
6. Drop it into apps/web/src/content/sources/
7. Register it in editorial-chapters.ts using the template at the bottom of this file

---

## START PROMPT

You are generating a source file for a CLEP Humanities study app. The file must follow an exact format — the app parser reads it programmatically. Do not deviate from the structure.

CHAPTER_NUMBER: 2
CHAPTER_TITLE: Medieval

---


### WHAT TO GENERATE

A complete source file covering **6 sections** of Chapter [CHAPTER_NUMBER] — [CHAPTER_TITLE].

This Chapter 2 file uses a normalized 6-section structure. Generate exactly these 6 sections and no others:

1. Late Rome, Judaism, and Christianity
2. Byzantium
3. Rise and Spread of Islam
4. Fiefdom, Monastery, and Romanesque World
5. Gothic Age
6. Siena, Florence, and Global Medieval Worlds

Each section follows the **identical numbered-block structure** shown below. Generate all 6 sections back to back, each preceded by its canonical header.

---

### SOURCE RULE FOR CHAPTER 2

Primary source spine:
Use Sayre, The Humanities: Culture, Continuity & Change, Volume I, Book 2, Chapters 9–14 as the main narrative and organizational spine for Sections 1–6.

Support rule:
Lean mostly on Sayre for Chapter 2. Use backup reinforcement only when it adds clarity, not as an equal second spine.

Assessment rule:
Keep CLEP tone focused on recognition of works, styles, periods, terms, and major ideas. Balance literature, religion, architecture, visual culture, and intellectual history.

---

### EXACT FILE FORMAT

The file begins with Section 1 and ends after Section 6. Each section starts with:

## Section N (Canonical)

Then immediately follows these numbered blocks in order, with no extra headings between them:

1) Section Relevance and Stakes
2) Big Ideas
3) Common Misconceptions to Correct
4) Learning Objectives
5) Textbook Content
6) Canonical Works and Terms
7) Primary Source Excerpts
8) Timeline Anchors
9) Exam Hot Zones
10) 10-Question Section Quiz
11) Answer Key with Explanations
12) Flashcards
13) 10 Later Test Questions
14) Link Images That Help
15) Link Videos to Embed
16) References
17) Mnemonics
18) Fast Cheat Sheet

---

### BLOCK-BY-BLOCK RULES

Block 1 — Section Relevance and Stakes
2–3 paragraphs. First paragraph: why this section matters for humanities understanding. Second paragraph: what CLEP specifically tests from this section. No bullet points.

Block 2 — Big Ideas
Exactly 6 Big Ideas. Each follows this pattern:

Big Idea N — [Short Title In Title Case]

[One paragraph: the core insight, 3–5 sentences]

[One paragraph: what students miss or get wrong, 2–4 sentences]

No sub-bullets. Two paragraphs per Big Idea, blank line between them.

Block 3 — Common Misconceptions to Correct
4–6 paragraphs. Each starts with "Students often think..." and ends with the correction. No bullets.

Block 4 — Learning Objectives
Exactly 8 objectives in tab-separated format:

[chapter].[sectionid].[slug]	[Plain-English description of the objective]

For Chapter 2, use:
medieval.s1.slug
medieval.s2.slug
medieval.s3.slug
medieval.s4.slug
medieval.s5.slug
medieval.s6.slug

Match the correct section number.

Block 5 — Textbook Content
This is the main reading content. Structure:
- Start with H1 — [Section Title]
- Then Key Takeaways Box
- Then 4–5 H2 — [Subtopic] sections, each with 3–5 paragraphs
- Each H2 may have one H3 — [sub-subtopic] with 2–3 paragraphs
- Each H2 or H3 ends with a Key Takeaways Box

Key Takeaways Box format (exact):

Key Takeaways Box
- [point one]
- [point two]
- [point three]
- [point four]

Do not use markdown bold, italics, or headers inside block 5. Use only H1 —, H2 —, H3 — prefixes and Key Takeaways Box exactly as shown.

Block 6 — Canonical Works and Terms
15–25 terms. Each on its own line:

[Term] — [Definition, 1–2 sentences]

Block 7 — Primary Source Excerpts
Exactly 3 excerpts. Each follows:

"[quote]"
— [Author/Source]

Why it matters: [1–2 sentences]

Use brief, accurate excerpts only. Do not fabricate quotations.

Block 8 — Timeline Anchors
8–12 entries. Each on its own line:

c. [date] — [event]

Block 9 — Exam Hot Zones
Exactly 5 entries. Each follows:

Trap: [common wrong assumption]. Correction: [what is actually true].

Block 10 — 10-Question Section Quiz
Exactly 10 questions. Each follows:

[N]. [Question text]
A. [option]
B. [option]
C. [option]
D. [option]
E. [option]

Blank line between questions. Correct answers must be distributed across A–E.

Block 11 — Answer Key with Explanations
Exactly 10 entries:

[N]. [Letter] - [Explanation, 2–3 sentences]

Block 12 — Flashcards
Exactly 20 flashcards: 10 Core, 10 Extra. Format:

Core 10

Front: [question or term]
Back: [answer, 1–3 sentences]

[blank line between cards]

Extra 10

Front: [question or term]
Back: [answer, 1–3 sentences]

The words Core 10 and Extra 10 must appear exactly as shown on their own lines.

Block 13 — 10 Later Test Questions
Exactly 10 harder questions. Same A–E format as block 10, but each ends with:

Answer: [Letter]

on its own line immediately after the options.

Block 14 — Link Images That Help
4–6 entries. Each follows:

[Descriptive title of the image/object]
Link: [full https URL — must be a real, working URL from Smarthistory, British Museum, Khan Academy, Met Museum, UNESCO, or similar]
Why it matters: [1–2 sentences]

Block 15 — Link Videos to Embed
Exactly 3 entries. Each follows:

[Video title]
Link: https://www.youtube.com/watch?v=[real video ID]
Watch-for: [1–2 sentences on what to focus on]

Use real YouTube video IDs. Prefer Smarthistory, Khan Academy, or reputable educational channels.

Block 16 — References
4–6 entries. Each follows:

[Source name] — [brief description]
Link: [full https URL]
Why useful: [1–2 sentences]

Block 17 — Mnemonics
Exactly 2 mnemonics. Each follows:

[MNEMONIC-LABEL-IN-CAPS]
Use this to remember [what it helps with].
[Line 1]
[Line 2]
[Line 3]
[Line 4]
[Line 5]
[Line 6]

Block 18 — Fast Cheat Sheet
Use exactly this format:

1-line: [One sentence summary of the whole section]
Highlights:
- [point]
- [point]
- [point]
- [point]
- [point]
- [point]
- [point]
Mnemonic: [MNEMONIC-LABEL]

---

### SECTION IDs AND TITLES FOR CHAPTER 2 — MEDIEVAL


Use these exact section titles and IDs:

| Section | ID | Title |
|---------|-----|-------|
| 1 | s1 | Late Rome, Judaism, and Christianity |
| 2 | s2 | Byzantium |
| 3 | s3 | Rise and Spread of Islam |
| 4 | s4 | Fiefdom, Monastery, and Romanesque World |
| 5 | s5 | Gothic Age |
| 6 | s6 | Siena, Florence, and Global Medieval Worlds |

Objective tag prefix: `medieval.s[N].[slug]`

---

### QUALITY RULES

1. Every URL in blocks 14, 15, and 16 must be a real, working URL.
2. Prefer these domains when possible:
   - https://smarthistory.org/
   - https://www.khanacademy.org/
   - https://www.britishmuseum.org/
   - https://www.metmuseum.org/
   - https://whc.unesco.org/
   - https://www.youtube.com/watch?v=
3. Quiz questions must have exactly 5 options (A–E).
4. Correct answers must be distributed across A–E, not clustered in one letter.
5. Flashcards must use exactly Front: and Back: prefixes.
6. Core 10 and Extra 10 must appear exactly as those words on their own lines.
7. Every H2 section in block 5 must have at least one Key Takeaways Box.
8. Big Ideas must be exactly 6, numbered Big Idea 1 through Big Idea 6.
9. Do not use markdown formatting inside the content blocks. No bold, no extra headers, no dividers.
10. Each section must be self-contained. A student reading only Section 3 should still understand it.
11. Do not use short, high-yield, one-line teaching as a substitute for explanation. If a range allows more depth, prefer fuller development.
12. When a block gives a range, prefer the fuller end of the range: 4–5 paragraphs over 2, 6–8 examples over 3, and 8–10 anchors over 4 when the topic supports it.
13. Use simplified explanations, clear keywords, direct definitions, and a storytelling flow so the lesson reads like guided teaching, not compressed notes.
14. When older Chapter 2 material has been merged into one of the 6 sections, absorb it naturally into that section. Do not mention discarded Section 7 or Section 8 labels in the output.

---

### SECTION FOCUS LOCKS

Use these content priorities when writing each section:

Section 1 — Late Rome, Judaism, and Christianity
Focus on late Roman crisis, Judaism, rise of Christianity, Christian iconography, Constantine, early church culture, Augustine, and Boethius.

Section 2 — Byzantium
Focus on Constantinople, Justinian and Theodora, Hagia Sophia, Ravenna, mosaics, icons, and iconoclasm.

Section 3 — Rise and Spread of Islam
Focus on Muhammad, Qur’an, Hadith, Muslim practice, Islamic expansion, mosque culture, calligraphy, Islamic Spain/Africa, and literary-mystical traditions.

Section 4 — Fiefdom, Monastery, and Romanesque World
Focus on Anglo-Saxon culture, feudalism, monastic preservation, manuscript culture, Charlemagne, Beowulf, Song of Roland, early medieval social order, pilgrimage, crusade, monastic reform, Romanesque church form, relic culture, castles, troubadours, and courtly literature.

Section 5 — Gothic Age
Focus on Saint-Denis, Chartres, stained glass, rib vaulting, Gothic sculpture, cathedral culture, universities, and scholasticism.

Section 6 — Siena, Florence, and Global Medieval Worlds
Focus on Giotto, Dante, Boccaccio, Petrarch, civic culture, Black Death, late medieval synthesis, and global medieval connections.

---

### OUTPUT FORMAT

Output the complete file as plain text.
Start immediately with:

## Section 1 (Canonical)

End after the Fast Cheat Sheet of Section 6.
No preamble.
No explanation.
No markdown code fences around the whole output.

---

## END PROMPT

---

## AFTER GENERATION: HOW TO REGISTER THE CHAPTER

Once you have the generated file saved as CHAPTER 2 SECTION 1-6.CANONICAL.txt in apps/web/src/content/sources/, add this to editorial-chapters.ts:

### Step 1 — Add section meta constant

**Already registered** — CHAPTER_2_SECTION_META is already in editorial-chapters.ts with these titles. If you change section titles, update both the source file AND the meta constant.

```typescript
export const CHAPTER_2_SECTION_META = [
  {
    id: "s1",
    title: "Late Rome, Judaism, and Christianity",
    emoji: "🏚️",
    canonicalHeader: "## Section 1 (Canonical)",
    anchors: ["Late Rome, Judaism, and Christianity"],
  },
  {
    id: "s2",
    title: "Byzantium",
    emoji: "✝️",
    canonicalHeader: "## Section 2 (Canonical)",
    anchors: ["Byzantium"],
  },
  {
    id: "s3",
    title: "Rise and Spread of Islam",
    emoji: "☪️",
    canonicalHeader: "## Section 3 (Canonical)",
    anchors: ["Rise and Spread of Islam"],
  },
  {
    id: "s4",
    title: "Fiefdom, Monastery, and Romanesque World",
    emoji: "⛪",
    canonicalHeader: "## Section 4 (Canonical)",
    anchors: ["Fiefdom, Monastery, and Romanesque World"],
  },
  {
    id: "s5",
    title: "Gothic Age",
    emoji: "🏰",
    canonicalHeader: "## Section 5 (Canonical)",
    anchors: ["Gothic Age"],
  },
  {
    id: "s6",
    title: "Siena, Florence, and Global Medieval Worlds",
    emoji: "🌍",
    canonicalHeader: "## Section 6 (Canonical)",
    anchors: ["Siena, Florence, and Global Medieval Worlds"],
  },
] as const satisfies readonly EditorialSectionMeta[];