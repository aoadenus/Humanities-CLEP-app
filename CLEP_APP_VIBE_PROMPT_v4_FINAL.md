# ENHANCED VIBE CODING PROMPT — CLEP Humanities Mastery App (v4 FINAL)
## For existing Next.js App Router project: `apps/web/src/`
## Strategy: Parallel editorial shell — do NOT mutate `study-shell.tsx`

> Paste this entire prompt into Claude Code while inside your `Humanities Study App` project root.

---

## PROMPT START

I have a working Next.js App Router project. Here is what exists:

```
apps/web/src/
  app/
    page.tsx              ← entry point, currently renders <StudyShell />
    layout.tsx            ← loads Space Grotesk + Source Sans 3 via next/font/google
    globals.css           ← dark/neon/glass theme tokens + Tailwind
    api/                  ← existing API routes (progress, coach, modules, attempts)
  components/
    study-shell.tsx       ← current 923-line gamified shell (DO NOT MODIFY)
    pwa-register.tsx      ← PWA service worker (keep)
  content/
    course.ts             ← normalized Module → Section → Objective content
    module-2.ts           ← additional module content
  lib/
    types.ts              ← existing types (Module, Section, Objective, etc.)
    constants.ts          ← app constants
    progress-store.ts     ← client-side progress state
    server-progress.ts    ← Supabase persistence
```

The current app is a dark, neon-accented, gamified study shell. **I am replacing the entire front-end experience** with a warm, editorial, step-by-step learning flow. I am building a parallel editorial shell and swapping the entry point. I am NOT modifying `study-shell.tsx` or `course.ts`.

**Read every file listed above before making any changes.**

---

## PHASE 1: VISUAL SYSTEM OVERHAUL

### 1A. Rewrite `globals.css`

Strip out the entire dark/neon/glass token system. Remove all gradient backgrounds, glow/shadow effects, shimmer keyframes, neon accent colors, glass-card styles, backdrop-blur, purple/cyan/amber palette.

Replace with:

```css
:root {
  --bg-primary: #FDFAF6;
  --bg-secondary: #F5F0E8;
  --bg-card: #FFFFFF;
  --accent: #5B4A3F;
  --accent-light: #8B7355;
  --accent-hover: #3D2E24;
  --text-primary: #2C2420;
  --text-secondary: #6B5E54;
  --text-muted: #9B8E82;
  --success: #4A7C59;
  --error: #A3443A;
  --highlight: #E8DCC8;
  --border: #E5DDD3;
  --progress-track: #E5DDD3;
  --progress-fill: #5B4A3F;
}
```

Keep Tailwind base/components/utilities. Add utility classes:
- `.callout` — 3px left border `var(--accent)`, background `var(--highlight)`, padding 16px 20px, font-size 15px
- `.callout-label` — small-caps, letter-spacing 0.08em, 12px, `var(--text-muted)`, margin-bottom 6px
- `.card` — `var(--bg-card)`, 1px solid `var(--border)`, border-radius 12px, shadow `0 1px 3px rgba(0,0,0,0.06)`
- `.mnemonic-card` — `var(--bg-secondary)` background, 2px left border `var(--accent-light)`, padding 20px, border-radius 8px
- Flashcard 3D flip classes (perspective, preserve-3d, backface-visibility, rotateY)
- Step transition classes (fade + translateY, 300ms ease)
- Progress dot pulse animation (scale 1→1.15→1, 1.5s infinite)

Body background: `var(--bg-primary)`. No dark mode.

### 1B. Update `layout.tsx`

Replace Space Grotesk → **DM Sans** (UI/nav/buttons).
Replace Source Sans 3 → **Literata** (body/learning content).
Load via `next/font/google`. DM Sans as default. Literata applied via `.font-reading` class.
Keep: metadata, viewport, PWA registration.

---

## PHASE 2: TYPES AND CONTENT

### 2A. Add editorial types to `types.ts`

Add alongside existing types (do NOT remove them):

```typescript
// === EDITORIAL LEARNING FLOW TYPES ===

export interface EditorialCallout {
  type: 'beginner' | 'exam-clue' | 'why-it-matters' | 'recognition-cue' | 'compare';
  text: string;
}

export interface EditorialLearnBlock {
  title: string;
  content: string;
  callouts?: EditorialCallout[];
}

export interface EditorialKeyTerm {
  term: string;
  definition: string;
}

export interface EditorialExamClue {
  signal: string;
  think: string;
}

export interface EditorialFlashcard {
  front: string;
  back: string;
}

export interface EditorialComparison {
  title: string;
  left: { label: string; items: string[] };
  right: { label: string; items: string[] };
}

export interface EditorialQuizQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number; // 0-indexed
  explanation: string;
  relatedObjectives: string[];
}

export interface EditorialMnemonic {
  label: string;       // e.g., "SPRAWL"
  purpose: string;     // e.g., "Features of civilization"
  items: { letter: string; meaning: string }[];
}

export interface EditorialVideo {
  title: string;
  embedUrl: string;
  watchFor: string;    // prompt shown below the video
}

export interface EditorialImageLink {
  title: string;
  url: string;
  description: string;
}

export interface EditorialSection {
  id: string;
  title: string;
  purpose: string;
  goals: string[];
  objectives: { id: string; label: string }[];
  learnBlocks: EditorialLearnBlock[];
  keyTerms: EditorialKeyTerm[];
  examClues: EditorialExamClue[];
  flashcards: EditorialFlashcard[];
  comparisons: EditorialComparison[];
  mnemonics: EditorialMnemonic[];
  quiz: { questions: EditorialQuizQuestion[] };
  harderTest: { questions: EditorialQuizQuestion[] };
  videos: EditorialVideo[];
  imageLinks: EditorialImageLink[];
  cheatSheet: {
    memoryLine: string;
    keyWords: { word: string; meaning: string }[];
    topSeven: string[];
    fastContrasts: { left: string; right: string }[];
    mnemonicRecap: string;
  };
}

export interface EditorialModule {
  id: string;
  title: string;
  sections: EditorialSection[];
}

export interface EditorialCourse {
  modules: EditorialModule[];
}

export interface EditorialProgressState {
  currentModuleIndex: number;
  currentSectionIndex: number;
  currentStep: number; // 0-9
  completedSteps: number[];
  quizAnswers: Record<number, number>;
  quizSubmitted: boolean;
  quizScore: number | null;
  weakObjectives: string[];
  flashcardIndex: number;
  flashcardFlipped: boolean;
  sectionCompleted: boolean;
  menuOpen: boolean;
}
```

### 2B. Create `apps/web/src/content/editorial-course.ts`

This is the editorial content file. Do NOT modify `course.ts`. Populate with ALL content from the bottom of this prompt. Every paragraph, callout, flashcard, quiz question, mnemonic, video, image link, and cheat sheet item. No truncation. No placeholders.

---

## PHASE 3: THE LEARNING FLOW — 10 STEPS

The original prompt had 8 steps. With the additional content (mnemonics, videos, harder test, cheat sheet), the flow expands to **10 steps**:

```
STEP 0  — SECTION INTRO         Title, purpose, goals
STEP 1  — LEARN BLOCK PART 1    First 4 learn subsections
STEP 2  — LEARN BLOCK PART 2    Next 4 learn subsections
STEP 3  — KEY TERMS + MNEMONICS Term cards + mnemonic cards (SPRAWL, WRITE, ART, H-S-S-C)
STEP 4  — EXAM CLUES            Signal/think pairs + comparison charts
STEP 5  — VIDEOS                Embedded YouTube videos with watch-for prompts
STEP 6  — FLASHCARDS            20 flip cards, one at a time
STEP 7  — SECTION QUIZ          10 multiple-choice questions, graded on submit
STEP 8  — RESULTS & ROUTING     Score → next section, review, or retry
STEP 9  — HARDER TEST           10 CLEP-style questions (unlocked after passing quiz)
```

---

## PHASE 4: EDITORIAL COMPONENTS

Create all in `apps/web/src/components/editorial/`:

### `editorial-shell.tsx` — The orchestrator

Top-level component. Loads editorial course data. Manages all state via `useReducer`. Routes to correct step based on `currentStep` (0–9). Renders top bar, step content with fade transitions, and sticky bottom bar.

NO sidebar. NO floating coach. NO module switching grid. One section, one step at a time.

### `editorial-top-bar.tsx`

- Left: "Classical → From Survival to Culture"
- Center: 10 progress dots. Completed = filled `var(--accent)`. Current = filled + pulse. Future = outlined muted. Step 9 dot only appears once quiz is passed.
- Right: menu icon → slide-out panel

### `editorial-menu-panel.tsx`

Slides from right. Shows module → section → step names. Completed = checkmark. Current = highlighted. Future = grayed/locked. Tapping completed step navigates to it. Backdrop click to close.

### `editorial-step-intro.tsx` — Step 0

- "SECTION INTRO" label (DM Sans, 14px, uppercase, letter-spaced, muted)
- Section title (Literata, 28px, bold)
- Purpose paragraph (Literata, 17px, line-height 1.75)
- Numbered goals list
- Button: "Begin Learning"

### `editorial-learn-block.tsx` — Steps 1 and 2

Receives array of learn blocks (4 per step). Each block:
- Subheading (Literata, 20px, semibold)
- Body paragraphs (Literata, 17px, line-height 1.75)
- Callout boxes with `.callout` class + `.callout-label` showing type in small caps
- Single scrollable page. Read, then Continue.

### `editorial-key-terms.tsx` — Step 3

Two sections on one scrollable page:

**Section A: Key Terms**
- Scrollable term/definition cards. Term bold left (DM Sans, 15px), definition right (Literata, 15px). Alternating row backgrounds.

**Section B: Memory Aids**
- Each mnemonic rendered as a `.mnemonic-card`:
  - Mnemonic label large and bold (e.g., "SPRAWL")
  - Purpose line below (e.g., "Features of civilization")
  - Letter → meaning pairs in a clean list
- Show all 4 mnemonics: SPRAWL, WRITE, ART, H-S-S-C

Button: "Continue"

### `editorial-exam-clues.tsx` — Step 4

- "If the question mentions..." / "Think..." paired cards
- Below: comparison charts (side-by-side on desktop, stacked on mobile)
- Button: "Continue to Videos"

### `editorial-videos.tsx` — Step 5

- Step label: "VIDEOS TO WATCH"
- Each video rendered as:
  - Video title (DM Sans, 16px, semibold)
  - Embedded YouTube iframe (responsive, max-width 640px, 16:9 aspect ratio)
  - Watch-for prompt below in a callout box
- Show all 6 videos with their prompts
- Button: "Continue to Flashcards"

### `editorial-flashcards.tsx` — Step 6

ONE card at a time. Centered, max-width 480px. Click to flip (3D CSS: perspective 1000px, preserve-3d, backface-visibility hidden, rotateY 180deg, 500ms). Front: cream background. Back: light accent background. Below: "← Previous" / "Card 3 of 20" / "Next →". Top-right: "Shuffle" button. Reset flip on card change. NOT a grid or list.

Button: "Continue to Quiz"

### `editorial-quiz.tsx` — Step 7

**10 questions** on one scrollable page (not 5 — using the full 10-question quiz from the resource pack).

Each question: numbered card + 5 selectable option cards (A–E). Selected = accent border + cream fill. On submit: correct = green, wrong = red + correct highlighted. Explanation below each. Score at top: "You scored 8/10". Staggered fade-in on options (50ms delay each).

Button: "Submit Answers"

### `editorial-results.tsx` — Step 8

Score summary with visual bar.

- **8–10/10**: "Section complete!" → "Continue to Section 2" button. Also shows: "Want a challenge? Try the harder test." → unlocks Step 9.
- **5–7/10**: "Almost there." → weak objectives list → "Review Flashcards" + "Retry Quiz" buttons
- **0–4/10**: "Let's strengthen your foundation." → "Review Full Section" button (back to Step 1)

Also shows the cheat sheet content:
- Memory line
- Top 7 things to remember
- Fast contrasts
- Mnemonic recap line

### `editorial-harder-test.tsx` — Step 9

Only accessible after passing the quiz (8+/10). 10 harder CLEP-style questions. Same interaction as quiz. Graded on submit. Score shown. No gating — this is for reinforcement, not progression.

### `editorial-comparison-chart.tsx`

Reusable component. Side-by-side columns on desktop (min-width 640px), stacked on mobile. Left: `var(--bg-secondary)`. Right: `var(--bg-card)`. Label headers bold DM Sans. Bullet items Literata.

### `editorial-continue-button.tsx`

Sticky bottom bar. Full-width button, max-width 720px centered. Background `var(--accent)`, white text, border-radius 10px, padding 14px. Hover: `var(--accent-hover)`, translateY(-1px) + shadow. Label changes per step.

---

## PHASE 5: SWAP ENTRY POINT

Update `page.tsx`: replace `<StudyShell />` with `<EditorialShell />`. Keep `study-shell.tsx` in codebase for reference.

---

## INTERACTION RULES

1. **Linear only**: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Step 9 unlocked only after passing quiz.
2. **Backward via menu**: Completed steps revisitable. Future steps locked.
3. **Flashcards free-nav within step**: Prev/next/shuffle freely within Step 6.
4. **Quiz all-at-once**: All 10 questions visible. Submit grades all. No resubmit without reset.
5. **Results gate**: 8+/10 unlocks next section + optional harder test. 5–7 offers review. 0–4 loops back.
6. **Step transitions**: Fade out (opacity 0, translateY 10px) → fade in (opacity 1, translateY 0). 300ms ease. CSS only.

---

## WHAT NOT TO DO

- ❌ DO NOT modify `study-shell.tsx`, `course.ts`, or remove existing types
- ❌ DO NOT keep dark/neon/glass theme
- ❌ DO NOT keep left sidebar, floating coach, or module switching grid
- ❌ DO NOT build a dashboard or landing page
- ❌ DO NOT use tabs/accordions for learning content
- ❌ DO NOT show flashcards as grid/list
- ❌ DO NOT truncate content
- ❌ DO NOT use emoji
- ❌ DO NOT use localStorage/sessionStorage
- ❌ DO NOT add dark mode, settings, or profile

---

## EXECUTION ORDER

1. Read all existing files
2. Rewrite `globals.css`
3. Update `layout.tsx` (fonts)
4. Add editorial types to `types.ts`
5. Create `editorial-course.ts` with ALL content below
6. Create all editorial components in `components/editorial/`
7. Create `editorial-shell.tsx`
8. Update `page.tsx` to render `<EditorialShell />`
9. Test full 10-step flow

---

## COMPLETE CONTENT — POPULATE IN `editorial-course.ts`

### Module: Classical — Section: From Survival to Culture

```typescript
{
  id: "from-survival-to-culture",
  title: "From Survival to Culture",
  purpose: "This section teaches the most basic starting point: before Greece, Rome, philosophy, temples, and epics, humans first had to become cultural beings. That means this section is about what makes humans human, how culture begins, why art comes before formal civilization, how humans move from survival to meaning, and why the humanities begin before written history. This is the foundation section for the whole Classical module.",
  goals: [
    "Explain what the humanities are in simple terms",
    "Explain the difference between survival and culture",
    "Describe why prehistoric art matters",
    "Explain what a civilization is",
    "Explain why writing, farming, and settlement matter",
    "Understand why the Classical World starts earlier than Greece alone",
    "Connect early culture to later literature, religion, art, and architecture"
  ],
  objectives: [
    { id: "classical.foundations.humanities_definition", label: "Understand what the humanities study" },
    { id: "classical.foundations.humans_as_symbol_makers", label: "Understand that humans create meaning through symbols, stories, ritual, and art" },
    { id: "classical.foundations.prehistoric_art", label: "Understand why prehistoric art matters in humanities" },
    { id: "classical.foundations.survival_to_culture", label: "Understand the shift from mere survival to organized culture" },
    { id: "classical.foundations.features_of_civilization", label: "Know the major features of civilization" },
    { id: "classical.foundations.role_of_writing", label: "Understand why writing changes human culture" },
    { id: "classical.foundations.why_early_civilizations_matter", label: "Understand why Mesopotamia and Egypt matter before Greece and Rome" },
    { id: "classical.foundations.classical_world_as_arc", label: "Understand that the Classical World is a long development arc, not just Greek mythology" }
  ],
```

### Learn Blocks (8)

```typescript
  learnBlocks: [
    {
      title: "What are the humanities?",
      content: "The humanities are the study of how human beings create meaning. That meaning shows up in stories, poems, plays, art, music, religion, architecture, philosophy, ritual, and public symbols. So the humanities are not just 'old books' or 'fine arts.' They are the record of how humans answer questions like: Who are we? What matters? What is beauty? What is justice? What happens when we die? What is power supposed to look like? What makes a life good or meaningful?",
      callouts: [
        { type: "beginner", text: "If science studies how the world works, the humanities often study how humans understand and express their world." },
        { type: "exam-clue", text: "When CLEP asks about literature, art, architecture, music, philosophy, and cultural roles in one exam, that is because humanities is about human expression across forms, not one subject only." }
      ]
    },
    {
      title: "Humans are symbol-makers",
      content: "One of the most important beginner ideas is this: humans do not just live. Humans interpret. Animals survive. Humans survive and make meaning. That means humans tell stories, decorate objects, create rituals, use symbols, imagine gods, make images, preserve memory, honor the dead, and create customs and laws. This is one of the biggest reasons art matters so early in human history. Art is not a luxury added later. It is part of what humans do when they try to make life understandable.",
      callouts: [
        { type: "why-it-matters", text: "If you understand this idea, then the rest of the humanities makes more sense. Greek myths, Roman epics, Egyptian tomb paintings, and Gothic cathedrals all come from the same deep human need: to make meaning visible." }
      ]
    },
    {
      title: "Why prehistoric art matters",
      content: "Prehistoric art matters because it proves that before formal civilization, humans were already observing carefully, representing the world visually, attaching significance to animals, bodies, and ritual, and using images for more than decoration. Examples often discussed in humanities courses include cave paintings, carved figures, ritual objects, and burial goods. Prehistoric art tells us that art begins as something tied to belief, identity, memory, ritual, survival, and community. It is not just 'pretty.'",
      callouts: [
        { type: "recognition-cue", text: "If a question points to very early human culture before writing, and asks what art likely did, the answer will usually relate to ritual, symbolic meaning, memory, or community — not 'art for art's sake.'" }
      ]
    },
    {
      title: "The shift from survival to culture",
      content: "At first, humans lived in small groups focused mainly on food, safety, shelter, migration, and reproduction. Over time, some major shifts happened. Shift 1: Agriculture — humans began to grow food instead of depending only on hunting and gathering. Shift 2: Settlement — groups could stay in one place longer. Shift 3: Specialization — not everyone had to do the same job. Shift 4: Social complexity — larger communities required rules, roles, and systems. Shift 5: Collective memory — humans needed ways to preserve knowledge, beliefs, and identity. That is where culture becomes more complex.",
      callouts: [
        { type: "compare", text: "Survival is about immediate needs. Culture is about organized meaning across time." }
      ]
    },
    {
      title: "What is a civilization?",
      content: "A civilization is not just 'people living somewhere.' It usually includes several things: permanent settlement, agriculture, organized leadership, religion, social structure, economic exchange, labor specialization, architecture, writing or record-keeping, and law or organized custom. A civilization is what happens when human life becomes settled, organized, layered, symbolic, and recorded. Once civilization exists, humans can create and preserve epics, legal codes, temples, monuments, official myths, state religion, court art, and public architecture. That is when the humanities become easier to trace historically."
    },
    {
      title: "Why writing matters",
      content: "Writing is one of the most important cultural inventions in human history. Because writing allows humans to preserve stories, record laws, keep economic records, pass on religion, stabilize authority, organize states, and teach across generations. Without writing, culture survives mainly through memory and oral tradition. With writing, culture becomes much more durable and much easier to expand.",
      callouts: [
        { type: "beginner", text: "Writing does not create culture from nothing. It preserves and strengthens culture that already exists." },
        { type: "exam-clue", text: "If a question asks why early writing systems matter, think: memory, law, administration, religion, continuity." }
      ]
    },
    {
      title: "Why early civilizations matter before Greece and Rome",
      content: "A lot of students want to skip to Greece because that feels more 'classical.' But that creates a weak foundation. Before Greece and Rome, earlier civilizations already developed kingship, myth, temple culture, legal systems, monumental architecture, writing, religious imagery, and trade networks. That means Greece and Rome did not invent civilization. They entered a world already shaped by earlier cultures. Once you understand this, you stop seeing the Classical World as a sudden miracle. You start seeing it as a long chain of development. That is a much smarter humanities perspective."
    },
    {
      title: "The Classical World as an arc",
      content: "The Classical World should be understood as a long cultural arc: 1) prehistoric humans create meaning, 2) early civilizations form, 3) writing and political order grow, 4) regional cultures interact, 5) the Aegean world develops, 6) Greece produces major forms in literature, art, drama, and philosophy, 7) Rome scales culture into empire, law, engineering, and public infrastructure. So the Classical World is not just gods, columns, and philosophers. It is the story of how human culture becomes organized, recorded, symbolic, artistic, civic, and philosophical. That is the big picture."
    }
  ],
```

### Key Terms (10)

```typescript
  keyTerms: [
    { term: "Humanities", definition: "The study of human culture, meaning, and expression." },
    { term: "Symbol", definition: "Something that stands for more than itself." },
    { term: "Ritual", definition: "Repeated action with social, religious, or symbolic meaning." },
    { term: "Culture", definition: "Shared beliefs, practices, values, symbols, and creative expression." },
    { term: "Civilization", definition: "A complex society with settlement, structure, religion, leadership, and often writing." },
    { term: "Agriculture", definition: "The cultivation of crops and domestication of animals." },
    { term: "Settlement", definition: "Living in one place for an extended period." },
    { term: "Specialization", definition: "Different people doing different types of work." },
    { term: "Oral tradition", definition: "Knowledge passed by speaking, storytelling, and performance rather than writing." },
    { term: "Writing", definition: "A system for recording language and preserving information." }
  ],
```

### Mnemonics (4)

```typescript
  mnemonics: [
    {
      label: "SPRAWL",
      purpose: "Features of civilization",
      items: [
        { letter: "S", meaning: "Settlement" },
        { letter: "P", meaning: "Production (agriculture / food supply)" },
        { letter: "R", meaning: "Religion / ritual" },
        { letter: "A", meaning: "Authority (leaders / government)" },
        { letter: "W", meaning: "Writing / record-keeping" },
        { letter: "L", meaning: "Labor specialization" }
      ]
    },
    {
      label: "WRITE",
      purpose: "Why writing matters",
      items: [
        { letter: "W", meaning: "Worship / religion preserved" },
        { letter: "R", meaning: "Records kept" },
        { letter: "I", meaning: "Identity passed on" },
        { letter: "T", meaning: "Taxes, trade, law, administration" },
        { letter: "E", meaning: "Education and memory across generations" }
      ]
    },
    {
      label: "ART",
      purpose: "Why prehistoric art matters",
      items: [
        { letter: "A", meaning: "Ancestors were symbolic" },
        { letter: "R", meaning: "Ritual and meaning were already present" },
        { letter: "T", meaning: "Thought was visible before writing" }
      ]
    },
    {
      label: "H-S-S-C",
      purpose: "Big picture arc of Section 1",
      items: [
        { letter: "H", meaning: "Human" },
        { letter: "S", meaning: "Symbol" },
        { letter: "S", meaning: "Settlement" },
        { letter: "C", meaning: "Civilization" }
      ]
    }
  ],
```

### Exam Clues (4)

```typescript
  examClues: [
    { signal: "Very early human society, cave painting, burial objects, ritual figures, pre-writing culture", think: "Symbolism, ritual, early meaning-making, collective memory" },
    { signal: "What changed when humans settled and farmed?", think: "Social complexity, specialization, religion, leadership, architecture, record-keeping" },
    { signal: "Why does writing matter?", think: "Preservation, administration, law, cultural continuity" },
    { signal: "Why start before Greece?", think: "Greece and Rome build on earlier civilizations; culture develops over time" }
  ],
```

### Comparisons (3)

```typescript
  comparisons: [
    {
      title: "Survival vs Culture",
      left: { label: "Survival", items: ["Food", "Shelter", "Immediate protection", "Short-term needs"] },
      right: { label: "Culture", items: ["Memory", "Symbols", "Ritual", "Art", "Law", "Religion", "Collective meaning"] }
    },
    {
      title: "Oral Tradition vs Writing",
      left: { label: "Oral Tradition", items: ["Flexible", "Remembered", "Performed", "Communal"] },
      right: { label: "Writing", items: ["Fixed", "Preservable", "Portable across time", "Useful for law, government, and literature"] }
    },
    {
      title: "Small Group vs Civilization",
      left: { label: "Small Group", items: ["Simpler structure", "Less specialization", "Mostly immediate needs"] },
      right: { label: "Civilization", items: ["Hierarchy", "Record-keeping", "Complex religion", "Architecture", "Administration", "Public culture"] }
    }
  ],
```

### Flashcards (20)

```typescript
  flashcards: [
    { front: "What do the humanities study?", back: "The humanities study human culture, meaning, and expression through literature, art, music, architecture, philosophy, religion, and related forms." },
    { front: "What is culture?", back: "Culture is the shared beliefs, values, practices, symbols, and forms of expression of a group." },
    { front: "What is a symbol?", back: "A symbol is something that stands for more than itself." },
    { front: "What is prehistory?", back: "The period before written records." },
    { front: "Why does prehistoric art matter?", back: "It shows that humans were already thinking symbolically and creating meaning before formal civilization." },
    { front: "What is oral tradition?", back: "The passing down of stories, beliefs, and knowledge by speaking and performance rather than writing." },
    { front: "What is civilization?", back: "A complex society with settlement, agriculture, leadership, religion, social organization, and usually writing or record-keeping." },
    { front: "What is agriculture?", back: "The cultivation of crops and domestication of animals." },
    { front: "What is labor specialization?", back: "A system where different people perform different kinds of work." },
    { front: "Why is writing one of the most important inventions in human history?", back: "It preserves law, memory, stories, religion, administration, and cultural continuity." },
    { front: "Humans are not only survivors. What else are they?", back: "Meaning-makers and symbol-makers." },
    { front: "What is the difference between survival and culture?", back: "Survival handles immediate needs; culture organizes shared meaning, ritual, memory, values, and expression." },
    { front: "Why is art not just decoration in early human life?", back: "Because it is tied to ritual, memory, identity, belief, and symbolic meaning." },
    { front: "What usually changes when humans settle in one place?", back: "Communities become more complex, creating leadership, religion, specialization, architecture, and record-keeping." },
    { front: "Why should the Classical World not begin only with Greece?", back: "Because earlier human and early civilizational developments made Greek and Roman culture possible." },
    { front: "If a CLEP-style question mentions cave paintings, ritual objects, or burial goods, what broad idea should you think of?", back: "Early symbolic culture and meaning-making." },
    { front: "If a question asks why writing changed civilization, what are the strongest answer ideas?", back: "Law, memory, administration, religion, and continuity." },
    { front: "If a question asks what makes civilization possible, what mnemonic should you use?", back: "SPRAWL = Settlement, Production, Religion, Authority, Writing, Labor specialization." },
    { front: "If a question asks why humans matter in humanities before formal history, what is the answer?", back: "Because humans made meaning through image, ritual, and symbol before they wrote." },
    { front: "Big picture of Section 1 in one line", back: "Humans moved from survival to symbolic culture, then to settled civilization and recorded history." }
  ],
```

### Quiz — 10 Questions

```typescript
  quiz: {
    questions: [
      { id: 1, text: "The humanities are best defined as the study of", options: ["A. only politics", "B. only religion", "C. human culture, meaning, and expression", "D. only military history", "E. scientific experimentation"], correct: 2, explanation: "The humanities study human culture, meaning, and expression across many forms.", relatedObjectives: ["classical.foundations.humanities_definition"] },
      { id: 2, text: "Prehistoric art is important because it shows that early humans", options: ["A. already had written literature", "B. created symbolic meaning before formal civilization", "C. avoided ritual life", "D. focused only on decoration", "E. rejected community life"], correct: 1, explanation: "Prehistoric art proves humans were already making meaning symbolically before civilization.", relatedObjectives: ["classical.foundations.prehistoric_art"] },
      { id: 3, text: "Which development most strongly helped preserve law, stories, and administration across generations?", options: ["A. migration", "B. hunting", "C. writing", "D. metalworking", "E. trade alone"], correct: 2, explanation: "Writing stabilizes and preserves records across time far more durably than oral tradition.", relatedObjectives: ["classical.foundations.role_of_writing"] },
      { id: 4, text: "Which of the following is the best definition of civilization?", options: ["A. A small temporary hunting party", "B. A complex society with settlement, organization, and often writing", "C. A group with no religion or leadership", "D. Any group that creates tools", "E. A single empire only"], correct: 1, explanation: "Civilization includes settlement, organization, leadership, religion, and usually writing.", relatedObjectives: ["classical.foundations.features_of_civilization"] },
      { id: 5, text: "Which item below is most directly tied to symbolic early culture?", options: ["A. modern factory blueprint", "B. cave painting", "C. railroad schedule", "D. constitution", "E. bank ledger"], correct: 1, explanation: "Cave paintings are direct evidence of early symbolic culture and meaning-making.", relatedObjectives: ["classical.foundations.prehistoric_art", "classical.foundations.humans_as_symbol_makers"] },
      { id: 6, text: "The move from survival to culture most directly involves the growth of", options: ["A. symbols, rituals, and shared meaning", "B. instant democracy", "C. universal literacy", "D. large industrial systems", "E. global trade routes"], correct: 0, explanation: "The shift from survival to culture is about shared symbols, rituals, and meaning.", relatedObjectives: ["classical.foundations.survival_to_culture"] },
      { id: 7, text: "Labor specialization means", options: ["A. everyone performs the same work", "B. communities stop producing food", "C. different people take on different roles", "D. only rulers can make decisions", "E. writing disappears"], correct: 2, explanation: "Specialization means different people perform different kinds of work.", relatedObjectives: ["classical.foundations.features_of_civilization"] },
      { id: 8, text: "Why is it misleading to start the Classical World only with Greece?", options: ["A. Greece has no role in humanities", "B. Earlier human cultures and civilizations already developed key foundations", "C. Rome came first in all things", "D. Greece had no literature", "E. Classical culture is mostly modern"], correct: 1, explanation: "Earlier civilizations already had writing, religion, law, and monumental culture.", relatedObjectives: ["classical.foundations.why_early_civilizations_matter", "classical.foundations.classical_world_as_arc"] },
      { id: 9, text: "Oral tradition is best described as", options: ["A. laws engraved in stone", "B. knowledge passed through speaking and performance", "C. temple construction", "D. trade across seas", "E. agricultural surplus"], correct: 1, explanation: "Oral tradition preserves knowledge through speech and performance, not writing.", relatedObjectives: ["classical.foundations.role_of_writing"] },
      { id: 10, text: "Which mnemonic best summarizes the features of civilization?", options: ["A. WRITE", "B. ART", "C. SPRAWL", "D. HERO", "E. MYTH"], correct: 2, explanation: "SPRAWL = Settlement, Production, Religion, Authority, Writing, Labor specialization.", relatedObjectives: ["classical.foundations.features_of_civilization"] }
    ]
  },
```

### Harder Test — 10 Questions

```typescript
  harderTest: {
    questions: [
      { id: 101, text: "A humanities course begins with cave painting, burial practice, and ritual objects primarily to show that", options: ["A. civilization begins with urban law codes", "B. symbolic culture predates written history", "C. religion emerges only after empire", "D. art first appears in classical Greece", "E. philosophy replaces ritual"], correct: 1, explanation: "These artifacts prove symbolic culture existed before written records.", relatedObjectives: ["classical.foundations.prehistoric_art", "classical.foundations.humans_as_symbol_makers"] },
      { id: 102, text: "Which statement best captures the relationship between prehistory and civilization?", options: ["A. Prehistory is irrelevant once writing appears", "B. Civilization replaces culture entirely", "C. Civilization grows out of earlier human symbolic and social development", "D. Civilization begins only with democracy", "E. Civilization depends only on warfare"], correct: 2, explanation: "Civilization builds on earlier symbolic and social foundations.", relatedObjectives: ["classical.foundations.classical_world_as_arc"] },
      { id: 103, text: "A question asking why writing transformed culture is most likely testing your understanding of", options: ["A. architecture only", "B. preservation, administration, and continuity", "C. comedy and drama", "D. modern scientific method", "E. industrial capitalism"], correct: 1, explanation: "Writing matters for preservation, administration, law, and cultural continuity.", relatedObjectives: ["classical.foundations.role_of_writing"] },
      { id: 104, text: "A cave image of animals used in a ritual setting would most likely be interpreted in humanities as", options: ["A. a random sketch with no social meaning", "B. evidence of symbolic and communal thinking", "C. proof of advanced democracy", "D. an early bank record", "E. military propaganda"], correct: 1, explanation: "Ritual cave images are evidence of symbolic and communal thinking.", relatedObjectives: ["classical.foundations.prehistoric_art"] },
      { id: 105, text: "Which development most directly allows monuments, law codes, temples, and preserved myths to become central features of society?", options: ["A. constant nomadism", "B. settled complex civilization", "C. disappearance of religion", "D. rejection of labor specialization", "E. loss of agriculture"], correct: 1, explanation: "Settled civilization enables preservation of culture through monuments, law, and temples.", relatedObjectives: ["classical.foundations.features_of_civilization"] },
      { id: 106, text: "The strongest reason to study Mesopotamia and Egypt before Greece in a humanities course is that they", options: ["A. eliminate the importance of Greece", "B. show earlier foundations of law, kingship, religion, writing, and monumental culture", "C. prove Rome did not exist", "D. focus only on economics", "E. belong to the Renaissance"], correct: 1, explanation: "Mesopotamia and Egypt established foundations that Greece and Rome built upon.", relatedObjectives: ["classical.foundations.why_early_civilizations_matter"] },
      { id: 107, text: "A student says, 'The humanities start when people write books.' The best correction is that the humanities begin earlier because humans", options: ["A. needed factories first", "B. already created meaning through image, symbol, and ritual", "C. only mattered after cities formed", "D. avoided collective life", "E. did not use memory"], correct: 1, explanation: "Humans made meaning through symbols and ritual long before writing.", relatedObjectives: ["classical.foundations.humans_as_symbol_makers"] },
      { id: 108, text: "Which pair best represents the contrast between immediate survival and organized culture?", options: ["A. hunting / symbolism", "B. writing / record-keeping", "C. trade / empire", "D. empire / law", "E. sculpture / architecture"], correct: 0, explanation: "Hunting represents survival; symbolism represents the emergence of culture.", relatedObjectives: ["classical.foundations.survival_to_culture"] },
      { id: 109, text: "If a CLEP-style item asks what cave art, figurines, and ritual objects reveal, the best broad answer is", options: ["A. they prove universal literacy", "B. they show the rise of symbolic thought and communal meaning", "C. they demonstrate Roman engineering", "D. they reject religious life", "E. they are mainly examples of portraiture"], correct: 1, explanation: "These artifacts demonstrate the rise of symbolic thought and communal meaning.", relatedObjectives: ["classical.foundations.prehistoric_art", "classical.foundations.humans_as_symbol_makers"] },
      { id: 110, text: "The phrase 'from survival to culture' most nearly means", options: ["A. humans stopped needing food", "B. humans moved from immediate need toward shared symbols, memory, and organized meaning", "C. people abandoned community", "D. all societies became empires", "E. religion disappeared"], correct: 1, explanation: "The phrase describes humans moving from immediate needs to shared meaning and organized culture.", relatedObjectives: ["classical.foundations.survival_to_culture"] }
    ]
  },
```

### Videos (6)

```typescript
  videos: [
    { title: "What are the Humanities? — Prof G", embedUrl: "https://www.youtube.com/embed/dvQSYH-IRbM", watchFor: "Watch for how the humanities connects many art forms, not just history." },
    { title: "Cave Art 101 — National Geographic", embedUrl: "https://www.youtube.com/embed/ZjejoT1gFOc", watchFor: "Watch for what cave art suggests about memory, ritual, and symbolic thinking." },
    { title: "Cuneiform: Irving Finkel & Jonathan Taylor — British Museum", embedUrl: "https://www.youtube.com/embed/6OC_kpFyfT0", watchFor: "Watch for how writing helps preserve records, law, and identity." },
    { title: "How to write cuneiform — Irving Finkel", embedUrl: "https://www.youtube.com/embed/XVmsfL5LG90", watchFor: "Watch for how writing helps preserve records, law, and identity." },
    { title: "Art History Timeline — Joanna Revelle", embedUrl: "https://www.youtube.com/embed/kgYcZp00ZwI", watchFor: "Use this as a broad visual timeline of art periods." },
    { title: "Catalhoyuk and the Dawn of Civilization", embedUrl: "https://www.youtube.com/embed/mrxh2H7JlP8", watchFor: "Watch for what changes when humans settle permanently." }
  ],
```

### Image Links (9)

```typescript
  imageLinks: [
    { title: "Prehistoric overview — Smarthistory", url: "https://smarthistory.org/period-culture-style/prehistoric/", description: "High-level landing page for prehistoric art and culture." },
    { title: "Hall of Bulls, Lascaux — Smarthistory", url: "https://smarthistory.org/hall-of-bulls-lascaux/", description: "Cave painting and symbolic early art." },
    { title: "Lascaux official site", url: "https://archeologie.culture.gouv.fr/lascaux/en", description: "Gallery-style visuals and context for Lascaux." },
    { title: "Venus of Willendorf — Smarthistory", url: "https://smarthistory.org/venus-of-willendorf/", description: "Portable prehistoric objects and symbolic form." },
    { title: "Stonehenge — UNESCO", url: "https://whc.unesco.org/en/list/373/", description: "Early monumentality and ritual/ceremonial space." },
    { title: "Stonehenge Gallery — UNESCO", url: "https://whc.unesco.org/en/list/373/gallery/", description: "Swipeable visuals of Stonehenge." },
    { title: "Catalhoyuk — UNESCO", url: "https://whc.unesco.org/en/list/1405/", description: "Settlement to civilization — Neolithic settlement example." },
    { title: "How to write cuneiform — British Museum", url: "https://www.britishmuseum.org/blog/how-write-cuneiform", description: "Bridge from prehistory into writing and civilization." },
    { title: "Cuneiform introduction — Smarthistory", url: "https://smarthistory.org/cuneiform/", description: "Visual and text support for the writing objective." }
  ],
```

### Cheat Sheet

```typescript
  cheatSheet: {
    memoryLine: "Humans moved from surviving to settling to symbolizing to recording to building civilization.",
    keyWords: [
      { word: "Culture", meaning: "shared meaning" },
      { word: "Symbol", meaning: "something that stands for more than itself" },
      { word: "Civilization", meaning: "organized complex society" },
      { word: "Writing", meaning: "preserved memory" },
      { word: "Prehistory", meaning: "before written records" }
    ],
    topSeven: [
      "Humanities = human meaning",
      "Art starts early",
      "Prehistory still matters",
      "Symbols come before writing",
      "Writing preserves culture",
      "Civilization = organized culture",
      "Greece and Rome grow out of earlier foundations"
    ],
    fastContrasts: [
      { left: "Prehistory = before writing", right: "History = with writing" },
      { left: "Survival = immediate need", right: "Culture = shared meaning" },
      { left: "Oral tradition = spoken/remembered", right: "Writing = fixed/preserved" }
    ],
    mnemonicRecap: "H-S-S-C = Human → Symbol → Settlement → Civilization"
  }
}
```

---

## PROMPT END
