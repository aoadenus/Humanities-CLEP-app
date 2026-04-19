# CLEP HUMANITIES STUDY APP — COMPLETE BUILD PROMPT (v5 FINAL)
## Canvas-Style Study App · Next.js App Router · `apps/web/src/`
## Content source: `CHAPTER 1 SECTION 1-6.txt` (all 6 sections fully written)

> Paste this entire prompt into Claude Code while inside your `Humanities Study App` project root.
> The file `CHAPTER 1 SECTION 1-6.txt` contains ALL the detailed textbook content for Chapter 1 Sections 1-6. Read it as the canonical content source.

---

## PROMPT START

## WHO THIS IS FOR

I am a student, not a developer. I do not want to spend hours debugging. I want a study app that works, looks great, and makes me want to study instead of scrolling social media. The backend does not matter. What matters is that this app is a genuinely good, fun, colorful, well-designed study experience that I can use on my laptop or phone browser and my progress stays when I come back.

---

## PART 1 — WHAT EXISTS (READ FIRST)

```
apps/web/src/
  app/page.tsx, layout.tsx, globals.css, api/
  components/study-shell.tsx (DO NOT MODIFY — we are replacing it)
  components/pwa-register.tsx (keep)
  content/course.ts (DO NOT MODIFY), module-2.ts
  lib/types.ts, constants.ts, progress-store.ts, server-progress.ts
```

The current app is a dark/neon gamified shell. I am replacing the ENTIRE front-end with a new Canvas-style study app. Do NOT modify `study-shell.tsx` or `course.ts`. Build everything new alongside them.

Also read the file `CHAPTER 1 SECTION 1-6.txt` — it contains the complete textbook-quality content for all 6 sections of Chapter 1. That file is the content source of truth.

---

## PART 2 — APP ARCHITECTURE (CANVAS-STYLE)

This app has a **3-level navigation hierarchy**, like Canvas LMS:

### LEVEL 1: COURSE DASHBOARD (`/`)
- Shows **6 chapter cards** in a grid (2 columns desktop, 1 column mobile)
- Each card shows: chapter number, chapter title, emoji icon, progress bar, status badge
- **Chapter 1** = unlocked, clickable, shows "Start" or progress %
- **Chapters 2-6** = locked with a lock icon, grayed out, shows "Coming Soon"
- Warm, colorful, inviting. Big text. Clear CTAs. This is the first thing the learner sees.

### LEVEL 2: CHAPTER OVERVIEW (`/chapter/[chapterId]`)
- Shows the **6 section cards** for the selected chapter in a list
- Each section card shows: section number, title, emoji, completion status (not started / in progress / complete / locked)
- **Section 1** = unlocked by default
- **Sections 2-6** = unlock sequentially as each previous section's hard test is passed
- Back button to dashboard
- Sidebar/menu shows all chapters + all sections of current chapter

### LEVEL 3: SECTION EXPERIENCE (`/chapter/[chapterId]/section/[sectionId]`)

#### Section Hub Page
When you click a section, you land on a **section hub** first — NOT directly into Learn 1. The hub shows:
- Section title and purpose paragraph
- Progress through the section's materials
- A **material menu** listing all materials in order:
  - Learn 1, Learn 2, Learn 3, Learn 4
  - Flashcards (Core 10 + Extra 10)
  - Videos
  - Quiz
  - Results
  - Hard Test (locked until quiz passed at 8+/10)
- Each material shows its status: not started, in progress, complete, or locked

#### Material Pages (`/chapter/[chapterId]/section/[sectionId]/material/[materialId]`)
Each material is its own page. Materials are:
- `learn-1`, `learn-2`, `learn-3`, `learn-4` — chunked reading pages
- `flashcards` — one-at-a-time flip cards
- `videos` — embedded YouTube + external links
- `quiz` — 10 questions, all-at-once grading
- `results` — score + targeted review routing
- `hard-test` — 10 harder questions, locked until quiz passed

**CRITICAL: Materials within a section are NOT locked against each other.** Once you enter a section, you can freely navigate between Learn 1, Learn 2, Flashcards, Videos, Quiz, etc. The only lock is the Hard Test (requires quiz pass). This is NOT a linear step-by-step flow within the section — it's free navigation with a recommended order.

---

## PART 3 — NAVIGATION & MENUS

### Persistent Navigation Menu (on every page below the dashboard)
- **Desktop**: Left sidebar rail, always visible
- **Mobile**: Hamburger menu that slides out from left
- Menu contents:
  - All 6 chapters (locked ones show lock icon)
  - Under the current chapter: all 6 sections (locked ones show lock icon)
  - Under the current section: all materials (Learn 1-4, Flashcards, Videos, Quiz, Results, Hard Test)
  - Current page is highlighted
  - Completed items show a checkmark emoji
  - Locked items are grayed out

### Sticky Bottom Navigation (on material pages only)
- Left side: **← Back** button (goes to previous material in sequence)
- Right side: **Next →** button (goes to next material in sequence)
- These follow the material order: Learn 1 → Learn 2 → Learn 3 → Learn 4 → Flashcards → Videos → Quiz
- On Section Hub: Back goes to chapter page, Next goes to Learn 1
- On Results: Next goes to Hard Test (if unlocked) or back to Section Hub

### Breadcrumb (top of every page)
- Shows: Dashboard > Chapter 1 > Section 1 > Learn 2 (each clickable)

---

## PART 4 — MATERIAL PAGE DESIGNS

### Learn Pages (learn-1 through learn-4)
- **Slideshow format** — one page per learn chunk, not one giant scroll
- Each learn page contains the textbook content for ~2 learn blocks from the section
- Content is rendered with:
  - Large, readable body text (18px minimum, line-height 1.8)
  - Bold headings with emoji decorators (e.g., "📖 What Are the Humanities?")
  - **Callout boxes** with colored left borders and labels:
    - 💡 BEGINNER TIP — blue-tinted
    - 🎯 EXAM CLUE — amber-tinted
    - ⚡ WHY IT MATTERS — green-tinted
    - 👁️ RECOGNITION CUE — purple-tinted
    - ⚖️ COMPARE — teal-tinted
  - **Key Takeaway boxes** at the end of major sections — bordered cards with bullet points
  - **Embedded images** — use curated images stored in `public/editorial/ch1/` with captions and source labels. If no direct image asset is available, show a designed artifact card with title, description, and "View Source →" link that opens in a new tab
  - **Chart.js diagrams** — at least 1 per section, embedded inline where relevant:
    - S1: "From Symbol to Civilization" flow diagram
    - S2: Mesopotamia vs Egypt comparison chart
    - S3: China / India / Africa comparison
    - S4: Cycladic → Minoan → Mycenaean timeline
    - S5: Athens civic system diagram
    - S6: Roman systems diagram
  - **Mnemonic cards** — styled with bold letter breakdown (e.g., SPRAWL)
- Back/Next buttons at bottom of each learn page

### Flashcards Page
- **ONE card at a time** — centered, max-width 500px
- Click card to flip (3D CSS flip animation)
- Front: question on cream/light background
- Back: answer on lightly tinted background
- Below card: `← Prev` | `Card 3 of 20` | `Next →`
- Top: "Shuffle 🔀" button
- Show Core 10 first, then Extra 10 (or toggle between sets)
- Card flip resets when changing cards
- **Star/bookmark** individual cards for later review

### Videos Page
- Each video:
  - Title with 🎬 emoji
  - Embedded YouTube iframe (responsive, 16:9 aspect ratio)
  - "Watch for:" callout below the video
  - "Open in New Tab ↗️" button
- All reference/image links from the section shown below videos as **rich link cards**:
  - Title, source, description
  - "Open in New Tab ↗️" button
  - These open in a new browser tab

### Quiz Page
- All 10 questions visible on one scrollable page
- Each question is a numbered card with 5 option buttons (A-E)
- Options are styled cards:
  - Default: light background, subtle border
  - Hover: slight lift + shadow
  - Selected: accent border + cream fill
  - After grading — correct: green border + light green fill ✅
  - After grading — wrong: red border + light red fill ❌, correct answer also highlighted green
- "Submit Answers" button at bottom (big, obvious, colorful)
- After submission: score shown at top ("You scored 8/10 🎉"), explanations appear below each question
- Cannot resubmit without resetting

### Results Page
- Score summary with visual progress bar or ring
- **8-10/10**: "Section mastered! 🎉" + cheat sheet content + "Take the Hard Test →" button + "Continue to Section 2 →" button
- **5-7/10**: "Almost there! 📚" + list of weak areas + specific "Go back to Learn X" buttons based on `reviewMaterialIds` on missed questions + "Retry Quiz" button
- **0-4/10**: "Let's rebuild 💪" + "Start from Learn 1 →" button
- Cheat sheet section shows: memory line, top 7 things to remember, fast contrasts, mnemonic recap

### Hard Test Page
- **LOCKED** until quiz score is 8+/10 (show lock icon + "Pass the quiz first" message)
- When unlocked: same interaction as quiz (10 harder questions, all-at-once, graded on submit)
- Passing (8+/10) marks the section as **complete** and unlocks the next section
- Score shown with celebration if passed

---

## PART 5 — VISUAL DESIGN SYSTEM

### Design Philosophy
This app needs to **replace the dopamine hit of social media**. It should be:
- Colorful and inviting, not sterile or academic-looking
- Friendly with emoji and iconography everywhere navigation and status appear
- Large, bold text that is comfortable for dyslexia (18px+ body, generous spacing)
- Dark text on light backgrounds (NO dark mode)
- Clean but not boring — think Canvas meets Duolingo meets a beautiful magazine

### Color Palette (CSS variables)
```css
:root {
  /* Base */
  --bg-primary: #FDFAF6;
  --bg-secondary: #F5F0E8;
  --bg-card: #FFFFFF;
  --text-primary: #2C2420;
  --text-secondary: #6B5E54;
  --text-muted: #9B8E82;
  --border: #E5DDD3;

  /* Accent (navigation, buttons, progress) */
  --accent: #5B4A3F;
  --accent-light: #8B7355;
  --accent-hover: #3D2E24;

  /* Status colors */
  --success: #4A7C59;
  --success-light: #E8F5E9;
  --error: #A3443A;
  --error-light: #FDECEA;
  --warning: #D4A843;
  --warning-light: #FFF8E1;
  --info: #4A6FA5;
  --info-light: #E3F2FD;

  /* Callout tints */
  --callout-beginner: #E3F2FD;      /* blue tint */
  --callout-exam: #FFF8E1;          /* amber tint */
  --callout-why: #E8F5E9;           /* green tint */
  --callout-recognition: #F3E5F5;   /* purple tint */
  --callout-compare: #E0F2F1;       /* teal tint */

  /* Chapter accent colors (for cards) */
  --ch1-color: #5B4A3F;
  --ch2-color: #4A6FA5;
  --ch3-color: #7B6B8D;
  --ch4-color: #4A7C59;
  --ch5-color: #A3443A;
  --ch6-color: #D4A843;

  /* Progress */
  --progress-track: #E5DDD3;
  --progress-fill: #4A7C59;

  /* Highlight */
  --highlight: #E8DCC8;
}
```

### Typography
- **Primary font**: `DM Sans` — used for EVERYTHING (body, UI, navigation, buttons, reading content)
- **Display font**: `Literata` — used ONLY for page titles and section headings (serif accent, not body text)
- Load both via `next/font/google` in `layout.tsx`
- Body text: 18px, line-height 1.8, `var(--text-primary)` on `var(--bg-primary)`
- Headings: bold, 24-32px
- Navigation text: 14-16px, semibold

### Icons & Emoji Usage
- ✅ Use emoji in: chapter cards, section cards, material menu items, status badges, callout labels, button labels, result messages, breadcrumbs
- ❌ Do NOT use emoji inside: long instructional paragraphs, quiz question text, flashcard text
- Use inline SVG or simple icon shapes for: lock icons, checkmarks, arrows, menu hamburger, progress indicators

### Animations
- Page transitions: fade + slight slide (300ms ease)
- Flashcard flip: 3D rotateY (500ms)
- Progress bars: animated fill on mount
- Buttons: hover lift with subtle shadow
- Quiz options: staggered fade-in (50ms each)
- Card hover: slight scale(1.02) + shadow

### Responsive
- Dashboard: 2-column grid on desktop, 1-column on mobile
- Material content: max-width 800px centered
- Navigation: sidebar on desktop, drawer on mobile
- Flashcards: centered, max-width 500px
- Everything must work cleanly from 360px to 1440px

---

## PART 6 — DATA MODEL

### Content Structure (`content/editorial-course.ts`)

Read `CHAPTER 1 SECTION 1-6.txt` and extract all 6 sections into this structure. The file contains complete content for each section including: textbook lesson, objectives, glossary, artifacts, images, videos, flashcards (Core 10 + Extra 10), quiz (10 questions), harder test (10 questions), weakness review map, and recommendation logic.

```typescript
export const EDITORIAL_COURSE: EditorialCourse = {
  chapters: [
    {
      id: "ch1",
      title: "Classical",
      emoji: "🏛️",
      color: "var(--ch1-color)",
      locked: false,
      sections: [
        {
          id: "s1",
          title: "From Survival to Culture",
          emoji: "🌍",
          locked: false,
          // ... all content from CHAPTER 1 SECTION 1-6.txt Section 1
          materials: [
            { id: "learn-1", title: "Learn 1", emoji: "📖", type: "learn" },
            { id: "learn-2", title: "Learn 2", emoji: "📖", type: "learn" },
            { id: "learn-3", title: "Learn 3", emoji: "📖", type: "learn" },
            { id: "learn-4", title: "Learn 4", emoji: "📖", type: "learn" },
            { id: "flashcards", title: "Flashcards", emoji: "🃏", type: "flashcards" },
            { id: "videos", title: "Videos & Resources", emoji: "🎬", type: "videos" },
            { id: "quiz", title: "Section Quiz", emoji: "📝", type: "quiz" },
            { id: "results", title: "Results", emoji: "📊", type: "results" },
            { id: "hard-test", title: "Hard Test", emoji: "🏆", type: "hard-test", lockedUntilQuizPass: true }
          ],
          learnContent: [...], // 4 learn pages, each with ~2 learn blocks
          flashcards: [...], // 20 cards (Core 10 + Extra 10)
          videos: [...],
          imageLinks: [...],
          quiz: { questions: [...], passThreshold: 8 },
          harderTest: { questions: [...], passThreshold: 8 },
          mnemonics: [...],
          keyTerms: [...],
          examClues: [...],
          comparisons: [...],
          cheatSheet: { ... },
          weaknessMap: { ... } // questionId -> reviewMaterialIds
        },
        // ... sections 2-6 from the same file
      ]
    },
    // Chapters 2-6: locked placeholders
    { id: "ch2", title: "Medieval", emoji: "⚔️", locked: true, sections: [] },
    { id: "ch3", title: "Renaissance", emoji: "🎨", locked: true, sections: [] },
    { id: "ch4", title: "Baroque & Enlightenment", emoji: "💡", locked: true, sections: [] },
    { id: "ch5", title: "19th Century", emoji: "🏭", locked: true, sections: [] },
    { id: "ch6", title: "20th Century & Beyond", emoji: "🌐", locked: true, sections: [] },
  ]
};
```

### Learn Page Content Splitting
Each section's textbook content should be split into **4 learn pages**. Use the section's H2 headers as natural break points. For Section 1:
- **Learn 1**: "What the humanities study" + "Paleolithic culture and symbolic thought" (~2 H2 blocks)
- **Learn 2**: "Neolithic revolution and settlement" + "Megaliths and myth" (~2 H2 blocks)
- **Learn 3**: "Civilization features" + "Writing and memory" (~2 H2 blocks)
- **Learn 4**: "Mesopotamia and Egypt foundations" + "Classical world as long arc" (~2 H2 blocks)

Each learn page includes its Key Takeaway boxes, callouts, embedded images, and any relevant Chart.js diagram.

### Quiz Question → Learn Page Mapping
Every quiz question must include `reviewMaterialIds: string[]` that maps to which learn page(s) to review if missed. Example:
```typescript
{
  id: 1,
  text: "The humanities are best defined as...",
  reviewMaterialIds: ["learn-1"], // missed this? go back to Learn 1
  // ...
}
```
This powers the Results page's "Go back to Learn X" routing.

---

## PART 7 — PROGRESS & PERSISTENCE

### Storage
- Use `idb-keyval` (already in `node_modules`) with key `clep-humanities-v1`
- Persist after every meaningful action (material visit, quiz submit, section complete)
- On page load, hydrate state from IndexedDB and resume where the learner left off

### State Shape
```typescript
interface EditorialProgress {
  currentRoute: string; // last visited route for resume
  chapters: {
    [chapterId: string]: {
      unlocked: boolean;
      sections: {
        [sectionId: string]: {
          unlocked: boolean;
          completed: boolean; // true after hard test passed
          visitedMaterials: string[]; // material IDs visited
          flashcardPosition: number;
          starredFlashcards: number[];
          quizAnswers: Record<number, number>;
          quizSubmitted: boolean;
          quizScore: number | null;
          hardTestAnswers: Record<number, number>;
          hardTestSubmitted: boolean;
          hardTestScore: number | null;
        }
      }
    }
  }
}
```

### Unlock Rules
- Chapter 1 unlocked by default. Chapters 2-6 locked.
- Section 1 unlocked by default. Sections 2-6 unlock sequentially.
- Section quiz pass = 8+/10 → unlocks Hard Test
- Hard Test pass = 8+/10 → marks section complete → unlocks next section
- Chapter 2 unlocks when ALL 6 Chapter 1 hard tests are passed

---

## PART 8 — COMPONENT STRUCTURE

Create all new components in `apps/web/src/components/editorial/`:

```
editorial/
  Dashboard.tsx           — 6 chapter cards grid
  ChapterPage.tsx         — 6 section cards for a chapter
  SectionHub.tsx          — section overview + material menu
  SectionShell.tsx        — persistent nav shell for material pages
  MaterialMenu.tsx        — sidebar/drawer with chapters > sections > materials
  Breadcrumb.tsx          — clickable breadcrumb trail
  LearnSlide.tsx          — one learn page with content, callouts, images, diagrams
  FlashcardViewer.tsx     — one-at-a-time flip cards with nav
  VideosPage.tsx          — embedded videos + reference links
  QuizPage.tsx            — 10 questions, all-at-once grading
  ResultsPage.tsx         — score + review routing + cheat sheet
  HardTestPage.tsx        — 10 harder questions, locked gate
  StickyNavBar.tsx        — bottom Back/Next buttons
  ProgressBar.tsx         — reusable progress indicator
  CalloutBox.tsx          — styled callout with emoji label
  KeyTakeawayBox.tsx      — bordered summary card
  MnemonicCard.tsx        — SPRAWL-style letter breakdown card
  ComparisonChart.tsx     — side-by-side comparison
  ChartDiagram.tsx        — Chart.js wrapper for study diagrams
  FlashcardCard.tsx       — individual flip card
  QuizQuestion.tsx        — individual quiz question card
  ChapterCard.tsx         — dashboard chapter card
  SectionCard.tsx         — chapter page section card
  StatusBadge.tsx         — emoji + text status indicator
```

---

## PART 9 — ROUTE STRUCTURE

```
app/
  page.tsx                                    → Dashboard
  chapter/
    [chapterId]/
      page.tsx                                → ChapterPage
      section/
        [sectionId]/
          page.tsx                            → SectionHub
          material/
            [materialId]/
              page.tsx                        → Material page (learn/flashcards/videos/quiz/results/hard-test)
```

All pages are client components that read from `EDITORIAL_COURSE` data and `EditorialProgress` state.

---

## PART 10 — WHAT NOT TO DO

- ❌ DO NOT modify `study-shell.tsx`, `course.ts`, or legacy API routes
- ❌ DO NOT make materials within a section locked against each other (only Hard Test is locked)
- ❌ DO NOT use a linear step-by-step flow within sections — it's free navigation with a menu
- ❌ DO NOT dump all learn content on one giant scroll page — split into 4 slideshow pages
- ❌ DO NOT show flashcards as a grid/list — one at a time with flip
- ❌ DO NOT use dark mode or dark backgrounds
- ❌ DO NOT use small text — minimum 18px body
- ❌ DO NOT skip emoji/icons on navigation and status elements
- ❌ DO NOT put emoji inside long reading paragraphs
- ❌ DO NOT use localStorage or sessionStorage — use idb-keyval (IndexedDB)
- ❌ DO NOT build backend features — this is a front-end study app
- ❌ DO NOT truncate or summarize content from `CHAPTER 1 SECTION 1-6.txt`
- ❌ DO NOT hotlink third-party article pages as image embeds — use local assets or designed cards
- ❌ DO NOT make this take a long time to build — keep it simple and working

---

## PART 11 — EXECUTION ORDER

1. Read all existing files listed in Part 1
2. Read `CHAPTER 1 SECTION 1-6.txt` for all content
3. Rewrite `globals.css` with the new color system and utility classes
4. Update `layout.tsx` with DM Sans + Literata fonts
5. Add editorial types to `types.ts`
6. Create `editorial-course.ts` with all 6 sections from the content file
7. Create the editorial progress store (`lib/editorial-progress.ts`)
8. Build all editorial components
9. Create the route pages
10. Update `app/page.tsx` to render the Dashboard instead of StudyShell
11. Test the full flow: Dashboard → Chapter 1 → Section 1 → Learn 1-4 → Flashcards → Videos → Quiz → Results → Hard Test → Section 2 unlocks

---

## PART 12 — CONTENT SOURCE

The file `CHAPTER 1 SECTION 1-6.txt` contains the complete content for all 6 Chapter 1 sections. Each section includes:
- Section relevance and stakes (use as section hub purpose text)
- Big ideas / pillars of understanding (distribute across learn pages)
- Full textbook section with H1/H2/H3 structure and Key Takeaway boxes (split into 4 learn pages)
- Technical terminology / glossary (show on learn pages where terms first appear)
- Key artifacts gallery (embed in relevant learn pages)
- Image links (curate into learn pages or videos page)
- Video links (videos page)
- Flashcards — Core 10 + Extra 10 (flashcards page)
- 10-question section quiz with answer key (quiz page)
- 10-question harder test / challenge questions (hard test page)
- Weakness review map — question to objective mapping (powers results routing)
- Recommendation logic — score bands (powers results page behavior)
- Mnemonics (embed in learn pages and show in results cheat sheet)

### Section titles and content source mapping:
1. **Section 1: From Survival to Culture** — `classical.s1.*` objectives
2. **Section 2: Mesopotamia and Egypt** — `classical.s2.*` objectives
3. **Section 3: Early Civilizations Beyond the Mediterranean** — `classical.s3.*` objectives
4. **Section 4: The Aegean World and Greek Beginnings** — `classical.s4.*` objectives
5. **Section 5: Classical Greece** — `classical.s5.*` objectives
6. **Section 6: Rome** — `classical.rome.*` objectives (normalize to `classical.s6.*`)

When the content file has multiple drafts of the same section, use the **later student-facing version** that includes the full textbook engine format (pillars of understanding, mastery checklist, hidden metadata, full textbook section, glossary, artifact gallery, visual support, flashcards, quiz, challenge questions, weakness map, recommendation logic).

---

## PROMPT END
