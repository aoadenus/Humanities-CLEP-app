# Private CLEP Humanities App Canonical Plan

Date: 2026-04-10
Status: Canonical implementation spec
Operating mode: Private-only

## 1) Product Summary

The learner-facing course remains six modules:
1. Classical
2. Middle Ages
3. Renaissance
4. Baroque and Enlightenment
5. Romanticism and Realism
6. Twentieth and Twenty-First Centuries

The app runs on a checkpoint-driven progression model and uses objective-level mastery as the core adaptation unit.

## 2) Source Strategy and Material Status

Use these source families with explicit roles:
- College Board blueprint + sample questions: define what to cover and question feel.
- Sayre/Fiero + Modern States topic trees/transcripts/slides: lesson substance.
- Practice quiz material + normalized HTML visual guides (`01_timeline.html`, `02_art_movements.html`, `03_architecture.html`): support assets.
- Video/web source bundles (`videos.pdf`, `websources.pdf`): OCR/manual-curation backlog, never hard dependency for shipping authored content.

Reference-first rule:
- Imported Modern States artifacts and HTML pages are references.
- Extract normalized content into schema-driven lesson blocks.
- Do not treat imported pages as primary learner screens.

Sample-question anchor rule:
- `samplequestions.txt` remains the exam-style anchor for question tone and task shape.

## 3) Strategic Mesh: Dual Taxonomy

Run two taxonomies simultaneously:
- Learner taxonomy (course flow): 6 modules.
- Exam taxonomy (analytics/blueprint):
  - `classical`
  - `medieval_renaissance`
  - `seventeenth_eighteenth`
  - `nineteenth`
  - `twentieth_twentyfirst`
  - `non_western` (overlay tag)

## 4) Canonical Objective Map (Single Source of Truth)

Every publishable fact/skill is an Objective record and must connect all learning and assessment surfaces:
- Learn
- Flashcards
- Videos
- Quiz
- Test
- Weakness Review
- AI Coach

### 4.1 Objective schema

Each Objective includes:
- `objective_id`
- `module_id`
- `section_id`
- `official_period_bucket`
- `discipline`
- `subtype`
- `skill_type`
- `exam_task_type`
- `mastery_weight`
- `source_refs[]`
- `sample_anchor_ids[]`

### 4.2 Publishability chain

An objective is publishable only when it has all required linked assets:
- Learn:
  - 1 explanation block
  - 1 exam clue
  - 1 recognition cue
  - 1 compare/contrast or why-it-matters note
- Flashcards:
  - 2-4 cards
  - cards must use different recall shapes (not clones)
- Videos:
  - 0-2 tagged segments
  - each segment has a "watch for this" note and 1 retrieval prompt
- Quiz:
  - 2 variants in one family (typically recall + recognition/application)
- Test:
  - 1 harder delayed-feedback variant (often image, passage, or style-based)

Video constraint:
- Videos are reinforcement only and never grant mastery by themselves.

## 5) Section and Module Build Pattern

Target sizing:
- Section: 6-10 objectives
- Module: 4-5 sections

Fixed section output pattern:
1. Overview
2. Key Works and Ideas
3. Art/Architecture/Music Recognition
4. Terms and Compare
5. Checkpoint

## 6) Exam Task Typing and Question Families

`exam_task_type` is determined by sample-question strategy, not by topic label alone.

Allowed task types:
- `identify_work`
- `identify_creator`
- `recognize_style`
- `identify_medium_or_form`
- `interpret_symbol_or_theme`
- `situate_period`
- `compare_movements`
- `explain_cultural_role`

Question family rule:
- Use `QuestionFamily` records to express multi-form prompts for the same objective.
- Keep quiz and test variants aligned to the same objective to prevent mode drift.

## 7) Study Loop and Unlock Rules

### 7.1 Section flow
1. Learn objective blocks.
2. Optional targeted video support.
3. Section flashcards.
4. 5-question section checkpoint (instant feedback).
5. If score < 70%, route to weakness review for failed objectives only.

### 7.2 Module flow
- Unlock 12-question module quiz after all section checkpoints are passed.
- Unlock 20-question module test when module quiz average is >= 75%.
- Unlock next module only when:
  - all section checkpoints are complete, and
  - module test score is >= 75%.

### 7.3 Cumulative flow
- After Modules 1-3 passed:
  - unlock 24-question midpoint review quiz
  - unlock 40-question midpoint test
- After Module 6 passed:
  - unlock 30-question cumulative review quiz
  - unlock 140-question / 90-minute mock exam

## 8) Objective-Level Recommendation Engine

Recommendation logic runs only at objective granularity:
- Missed quiz/test items increase weak weights on linked objectives.
- Dashboard next step selects highest-weight weak objective.
- Recommendation points to exact matching remediation asset (lesson, cards, tagged video, or review quiz).

## 9) AI Coach Scope and Guardrails

Allowed coach actions:
- explain a current objective
- compare two linked objectives
- review missed questions
- summarize a source-backed lesson

Forbidden:
- invent canonical content outside published objectives

## 10) Required Domain Types

Required runtime types:
- `Module`
- `Section`
- `Objective`
- `SourceRef`
- `LessonBlock`
- `VideoSegment`
- `Flashcard`
- `QuestionFamily`
- `Attempt`
- `WeakObjective`
- `Recommendation`

## 11) Required Data Constraints

Enforce these invariants:
- no flashcard without `objective_id`
- no video without objective tags
- no question without `objective_id`, `skill_type`, and `exam_task_type`
- no lesson block without at least one `source_ref`
- no test blueprint without official period/discipline weighting metadata

## 12) Required Endpoints

- `GET /dashboard`
- `GET /modules/:id/bundle`
- `GET /sections/:id/objectives`
- `GET /review/weaknesses`
- `POST /attempts`
- `GET /recommendations/next`
- `POST /coach/explain`

## 13) Test and Verification Plan

Verify:
1. every published objective has full asset chain: learn, cards, quiz family, test variant (videos explicitly optional)
2. no quiz/test item exists without matching lesson explanation and flashcard set
3. module analytics report both learner-module progress and official CLEP bucket coverage
4. weak-objective routing returns learner to exact missed concept (not whole chapter fallback)
5. final mock matches 140 questions / 90 minutes / 50-50 literature-arts / 50-30-20 skill mix
6. cross-device sync preserves objective mastery, module unlock state, attempts, notes, AI review context
7. OCR/manual-curation backlog for `videos.pdf` and `websources.pdf` is isolated and non-blocking

## 14) Assumptions and Defaults

- Private-only model remains active.
- Six learner modules remain visible.
- Official CLEP reporting still uses five major period buckets plus non-Western overlay.
- MVP scope:
  - Module 1 fully authored
  - Modules 2-6 as structured shells
  - full objective schema + assessment engine implemented across all six from start
- Games are outside canonical mastery loop in v1.
- If games are added later, they must attach to `objective_id`.
- Imported Modern States artifacts are reference-first; only normalized content becomes live app content.

## 15) Example Objective Flow

Example objective ID:
- `classical.art.architecture.greek_orders`

Asset chain example:
- Learn: Doric/Ionic/Corinthian differences, frieze, temple function, key examples
- Flashcards: order -> capital, capital -> order, building -> order
- Video: Greek temple architecture segment tagged to the same objective
- Quiz: direct identification
- Test: image/style recognition or Greek vs Roman compare

## 16) Hosting and Deployment Architecture

Primary stack:
- `Vercel`: private Next.js PWA hosting, route handlers, admin UI, coach endpoints
- `Supabase`: Postgres, Auth, Storage, sync, and hosted backups

Deployment workflow:
1. app code in a private GitHub repository
2. repository connected to Vercel
3. `main` branch is production
4. short-lived feature branches produce preview deployments
5. initial production URL can remain default `*.vercel.app`
6. custom domain can be attached after stability

Hosting split:
- Vercel hosts app shell, pages, PWA manifest/service worker, and server-side app logic.
- Supabase hosts normalized course data, progress data, auth, and private buckets.

Raw-source policy:
- Do not bundle raw textbook/source PDFs in the Vercel app.
- Do not rely on production runtime to parse source files.
- Source ingestion is local/admin-side first; publish only normalized content.
- Upload raw source files to Supabase only when selectively required for private lookup.

## 17) Storage and Access Model

Required Supabase storage buckets:
- `lesson-media`: app graphics/thumbnails/approved lesson visuals, authenticated read
- `source-library`: private PDFs/transcripts/slides, admin-only read
- `generated-assets`: OCR outputs/derived thumbnails, admin-only write

Security model:
- Use Supabase magic-link email auth for the private user account.
- Enable RLS on all exposed tables.
- Keep private/internal tables in a non-public schema.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` server-only in Vercel env vars.
- Never expose `source-library` files by public URL.

## 18) App Runtime and Sync Model

Runtime behavior after login:
1. download normalized module bundles
2. cache bundles in `IndexedDB` and browser cache storage
3. support offline study for downloaded lessons/cards/quizzes/notes/pending attempts
4. sync pending attempts and progress to Supabase when online

AI coach runtime guardrail:
- Coach runs via Next.js route handlers on Vercel.
- Coach reads only approved objective-linked content from Supabase.
- Coach does not read raw source PDFs at runtime.

## 19) Environment Variables

Define in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `APP_BASE_URL`
- `SUPABASE_JWT_SECRET` (only if server logic explicitly requires it)

Rule:
- Secrets remain server-only; no service-role key in client bundles.

## 20) Content Operations Split

Operating layers:
- Admin/content layer (laptop): local scripts parse PDFs/HTML/transcripts/notes/quiz seeds.
- Study app layer (Vercel/Supabase): publishes only approved normalized content.

Operational use of current files:
- `practice.txt`: seed checkpoints and difficulty patterns
- Modern States imports (HTML/transcripts/slides): topic map and lesson substance
- `01_timeline.html`, `02_art_movements.html`, `03_architecture.html`: normalize into lesson/recognition assets
- `samplequestions.txt` and `sourceqs.txt`: question style and exam behavior anchor
- `videos.pdf` and `websources.pdf`: OCR/manual-curation backlog, never runtime dependency

Publish gate:
- No objective goes live without learn content, flashcards, and at least one quiz/test linkage.
- Video support is optional and never sole teaching asset.

## 21) Hosting-Specific Verification Additions

In addition to Section 13 verification, confirm:
1. phone and laptop both load same account state and sync progress correctly
2. offline study works after module bundle download
3. private source files require authenticated access and are not public
4. preview deployments trigger on feature-branch pushes
5. production deploys from `main`
6. coach explains only approved objective-linked content and weak-area context

## 22) Backup and Recovery

Backup strategy:
- use Supabase hosted database backups
- also export periodic local backups of:
  - normalized content
  - SQL schema/migrations
  - approved lesson JSON
  - private source library index

Recovery principle:
- hosted backups restore core runtime data; local exports restore authored curation state.
