"use client";

import { startTransition, useEffect, useRef, useState } from "react";

import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase";
import {
  clearProgressState,
  isAssessmentUnlocked,
  loadProgressState,
  markFlashcardsReviewed,
  markObjectiveLearned,
  markPendingAttemptsSynced,
  mergeRemoteProgressState,
  recordAssessmentResult,
} from "@/lib/progress-store";
import type {
  AssessmentBundle,
  CoachMessage,
  LocalProgressState,
  ModuleBundle,
  ModuleSummary,
  Objective,
  Section,
} from "@/lib/types";

interface StudyShellProps {
  initialModules: ModuleSummary[];
}

interface AssessmentResult {
  score: number;
  total: number;
  correct: number;
}

type StepKind =
  | { type: "learn"; section: Section; objectives: Objective[] }
  | { type: "flashcards"; section: Section; objectives: Objective[] }
  | { type: "videos"; section: Section; objectives: Objective[] }
  | { type: "assessment"; assessment: AssessmentBundle }
  | { type: "done" };

const MODULE_EMOJIS = ["🏛️", "🏰", "🎨", "🎭", "📖", "🌍"];
const MODULE_COLORS = [
  "var(--disc-art)",
  "var(--disc-lit)",
  "var(--accent-2)",
  "var(--accent-3)",
  "var(--disc-music)",
  "var(--disc-arch)",
];
const CHOICE_LETTERS = ["A", "B", "C", "D", "E"];
const MIN_FLASHCARDS = 20;

function buildSteps(module: ModuleBundle): StepKind[] {
  const steps: StepKind[] = [];
  for (const section of module.sections) {
    const objectives = module.objectives.filter((o) => o.sectionId === section.id);
    if (!objectives.length) continue;
    steps.push({ type: "learn", section, objectives });
    steps.push({ type: "flashcards", section, objectives });
    const hasVideos = objectives.some((o) => o.videos.length > 0);
    if (hasVideos) steps.push({ type: "videos", section, objectives });
  }
  for (const cp of module.checkpoints) {
    steps.push({ type: "assessment", assessment: cp });
  }
  if (module.moduleQuiz) steps.push({ type: "assessment", assessment: module.moduleQuiz });
  if (module.moduleTest) steps.push({ type: "assessment", assessment: module.moduleTest });
  steps.push({ type: "done" });
  return steps;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── FLIP CARD ──────────────────────────────────────────────────────────── */
function FlipCard({ front, back, onFlip }: { front: string; back: string; onFlip?: () => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip-card${flipped ? " flipped" : ""}`}
      style={{ minHeight: 130 }}
      onClick={() => { if (!flipped) { setFlipped(true); onFlip?.(); } }}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[color:var(--muted)] mb-2">Tap to reveal</p>
          <p className="font-semibold text-[color:var(--ink)] leading-6">{front}</p>
        </div>
        <div className="flip-card-back">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-2)] mb-2">Answer ✓</p>
          <p className="text-sm leading-6 text-[color:var(--copy)]">{back}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── MATCHING GAME ──────────────────────────────────────────────────────── */
function MatchingGame({ objectives, onComplete }: { objectives: Objective[]; onComplete: () => void }) {
  const source = objectives.flatMap((o) => o.flashcards).slice(0, 8);
  const [terms] = useState(() => shuffle(source.map((c) => ({ id: c.id, text: c.front }))));
  const [defs] = useState(() => shuffle(source.map((c) => ({ id: c.id, text: c.back }))));
  const [selTerm, setSelTerm] = useState<string | null>(null);
  const [selDef, setSelDef] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    if (!selTerm || !selDef) return;
    if (selTerm === selDef) {
      const next = new Set(matched).add(selTerm);
      setMatched(next);
      setSelTerm(null);
      setSelDef(null);
      if (next.size === source.length) onComplete();
    } else {
      const key = selTerm + "|" + selDef;
      setWrongKey(key);
      setTimeout(() => { setSelTerm(null); setSelDef(null); setWrongKey(null); }, 700);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selTerm, selDef]);

  if (!source.length) return null;

  const termClass = (id: string) =>
    matched.has(id) ? "border-emerald-500 bg-[rgba(16,185,129,0.14)] text-[color:var(--muted)] cursor-default" :
    selTerm === id ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--ink)]" :
    wrongKey?.includes(id) ? "border-rose-500 bg-[rgba(244,63,94,0.12)]" :
    "border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--copy)] hover:border-[color:var(--line-strong)]";

  const defClass = (id: string) =>
    matched.has(id) ? "border-emerald-500 bg-[rgba(16,185,129,0.14)] text-[color:var(--muted)] cursor-default" :
    selDef === id ? "border-[color:var(--accent-2)] bg-[color:var(--accent-2-soft)] text-[color:var(--ink)]" :
    wrongKey?.includes(id) ? "border-rose-500 bg-[rgba(244,63,94,0.12)]" :
    "border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--copy)] hover:border-[color:var(--line-strong)]";

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[color:var(--copy)]">Match each term to its definition. {matched.size}/{source.length} matched.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2 content-start">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[color:var(--accent)]">Terms</p>
          {terms.map((t) => (
            <button key={t.id} disabled={matched.has(t.id)} onClick={() => setSelTerm(t.id)}
              className={`rounded-[1rem] border px-3 py-3 text-sm text-left transition-all ${termClass(t.id)}`}>
              {matched.has(t.id) ? "✓ " : ""}{t.text}
            </button>
          ))}
        </div>
        <div className="grid gap-2 content-start">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[color:var(--accent-2)]">Definitions</p>
          {defs.map((d) => (
            <button key={d.id} disabled={matched.has(d.id)} onClick={() => setSelDef(d.id)}
              className={`rounded-[1rem] border px-3 py-3 text-sm text-left transition-all ${defClass(d.id)}`}>
              {matched.has(d.id) ? "✓ " : ""}{d.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LEARN STEP ─────────────────────────────────────────────────────────── */
function LearnStep({
  section, objectives, progress, onMarkLearned, onAskCoach, onNext,
}: {
  section: Section; objectives: Objective[]; progress: LocalProgressState | null;
  onMarkLearned: (id: string) => void; onAskCoach: (q: string, id: string) => void; onNext: () => void;
}) {
  const learnedCount = objectives.filter((o) => progress?.objectiveProgress[o.id]?.learned).length;
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[color:var(--accent-2)]">📖 Learn · {section.title}</p>
          <p className="mt-1 text-sm text-[color:var(--copy)] max-w-2xl">{section.description}</p>
        </div>
        <span className="progress-pill progress-pill-pending text-[0.62rem]">{learnedCount}/{objectives.length} learned</span>
      </div>

      {objectives.map((obj) => {
        const learned = progress?.objectiveProgress[obj.id]?.learned ?? false;
        const stripe = obj.discipline === "literature" ? "stripe-lit" : obj.discipline === "arts" ? "stripe-art" : "stripe-mixed";
        return (
          <article key={obj.id} className={`rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-6 ${stripe} ${learned ? "opacity-80" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {obj.tags.map((tag) => <span key={tag} className="progress-pill progress-pill-locked text-[0.58rem]">{tag}</span>)}
                </div>
                <h3 className="font-display text-xl font-700 text-[color:var(--ink)] leading-snug">{obj.title}</h3>
              </div>
              {learned && <span className="progress-pill progress-pill-done">✅ Learned</span>}
            </div>
            <p className="text-sm leading-[1.9] text-[color:var(--copy)] mb-5">{obj.learn.conciseExplanation}</p>
            <div className="grid gap-3 md:grid-cols-3 mb-5">
              <div className="rounded-[1.1rem] bg-[color:var(--surface-3)] px-4 py-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[color:var(--accent-2)] mb-1">🔑 Key Example</p>
                <p className="text-xs leading-[1.8] text-[color:var(--copy)]">{obj.learn.keyExample}</p>
              </div>
              <div className="rounded-[1.1rem] bg-[color:var(--surface-3)] px-4 py-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[color:var(--accent-3)] mb-1">💡 Exam Clue</p>
                <p className="text-xs leading-[1.8] text-[color:var(--copy)]">{obj.learn.examClue}</p>
              </div>
              <div className="rounded-[1.1rem] bg-[color:var(--surface-3)] px-4 py-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[color:var(--muted)] mb-1">↔️ Compare</p>
                <p className="text-xs leading-[1.8] text-[color:var(--copy)]">{obj.learn.compareContrast}</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button className={learned ? "button-success" : "button-primary"} onClick={() => onMarkLearned(obj.id)}>
                {learned ? "✅ Learned!" : "Mark as Learned"}
              </button>
              <button className="button-secondary" onClick={() => onAskCoach(`Explain "${obj.title}" in simpler, test-ready language.`, obj.id)}>
                ✨ Ask Coach
              </button>
            </div>
          </article>
        );
      })}

      <div className="flex justify-end mt-2">
        <button className="button-amber" onClick={onNext}>
          {learnedCount === objectives.length ? "Continue to Flashcards →" : "Skip to Flashcards →"}
        </button>
      </div>
    </div>
  );
}

/* ─── FLASHCARD STEP ─────────────────────────────────────────────────────── */
function FlashcardStep({
  section, objectives, progress, onMarkReviewed, onNext,
}: {
  section: Section; objectives: Objective[]; progress: LocalProgressState | null;
  onMarkReviewed: (ids: string[]) => void; onNext: () => void;
}) {
  const allCards = objectives.flatMap((o) => o.flashcards);
  const paddedCards = allCards.length < MIN_FLASHCARDS
    ? Array.from({ length: MIN_FLASHCARDS }, (_, i) => allCards[i % allCards.length]!)
    : allCards;

  const [mode, setMode] = useState<"flip" | "match">("flip");
  const [flippedCount, setFlippedCount] = useState(0);
  const [matchDone, setMatchDone] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 6;
  const totalPages = Math.ceil(paddedCards.length / perPage);
  const pageCards = paddedCards.slice(page * perPage, (page + 1) * perPage);

  const allReviewed = objectives.every((o) => progress?.objectiveProgress[o.id]?.flashcardsReviewed);
  const enoughFlipped = flippedCount >= Math.min(MIN_FLASHCARDS, paddedCards.length);
  const canProceed = allReviewed || enoughFlipped || matchDone;

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[color:var(--accent)]">🃏 Flashcards · {section.title}</p>
          <p className="mt-1 text-sm text-[color:var(--copy)]">{paddedCards.length} cards · flip at least {MIN_FLASHCARDS} to continue</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode("flip")} className={mode === "flip" ? "button-primary text-xs px-4 py-2.5" : "button-secondary text-xs px-4 py-2.5"}>Flip Cards</button>
          <button onClick={() => setMode("match")} className={mode === "match" ? "button-primary text-xs px-4 py-2.5" : "button-secondary text-xs px-4 py-2.5"}>Matching Game</button>
        </div>
      </div>

      {mode === "flip" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {pageCards.map((card, i) => (
              <FlipCard key={`${card.id}-${page}-${i}`} front={card.front} back={card.back} onFlip={() => setFlippedCount((n) => n + 1)} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button className="button-secondary text-xs px-4 py-2.5" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span className="text-xs text-[color:var(--muted)]">{page + 1} / {totalPages}</span>
              <button className="button-secondary text-xs px-4 py-2.5" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
          <p className="text-xs text-center text-[color:var(--muted)]">
            {flippedCount} / {MIN_FLASHCARDS} flipped{enoughFlipped ? " ✅" : ""}
          </p>
        </>
      ) : (
        <MatchingGame objectives={objectives} onComplete={() => setMatchDone(true)} />
      )}

      <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
        <button className="button-secondary text-xs" onClick={() => onMarkReviewed(objectives.map((o) => o.id))}>
          Mark all reviewed
        </button>
        <button className={canProceed ? "button-amber" : "button-secondary"} disabled={!canProceed} onClick={onNext}>
          {canProceed ? "Continue →" : `Flip ${Math.max(0, MIN_FLASHCARDS - flippedCount)} more to unlock`}
        </button>
      </div>
    </div>
  );
}

/* ─── VIDEO STEP ─────────────────────────────────────────────────────────── */
function VideoStep({ section, objectives, onNext }: { section: Section; objectives: Objective[]; onNext: () => void }) {
  const videos = objectives.flatMap((o) => o.videos.map((v) => ({ ...v, objectiveTitle: o.title })));
  return (
    <div className="grid gap-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[color:var(--accent-3)]">▶ Videos · {section.title}</p>
        <p className="mt-1 text-sm text-[color:var(--copy)]">Watch these before moving on.</p>
      </div>
      <div className="grid gap-4">
        {videos.map((video) => (
          <a key={video.id} href={video.url} target="_blank" rel="noreferrer"
            className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--surface-2)] px-5 py-5 flex gap-4 items-start transition hover:-translate-y-0.5 hover:border-[color:var(--accent-3)]">
            <span className="text-3xl mt-0.5 flex-shrink-0">▶</span>
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[color:var(--muted)] mb-1">{video.objectiveTitle}</p>
              <p className="font-semibold text-[color:var(--ink)] text-sm">{video.title}</p>
              <p className="mt-2 text-xs leading-[1.8] text-[color:var(--copy)]">
                <span className="font-bold text-[color:var(--accent-3)]">Watch for: </span>{video.watchFor}
              </p>
              <p className="mt-1.5 text-xs leading-[1.8] text-[color:var(--copy)]">
                <span className="font-bold text-[color:var(--muted)]">After watching: </span>{video.retrievalPrompt}
              </p>
            </div>
          </a>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button className="button-amber" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

/* ─── ASSESSMENT STEP ────────────────────────────────────────────────────── */
function AssessmentStep({
  assessment, progress, module, onSubmit, onNext,
}: {
  assessment: AssessmentBundle; progress: LocalProgressState | null; module: ModuleBundle;
  onSubmit: (a: AssessmentBundle, answers: Record<string, string>) => Promise<AssessmentResult>; onNext: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unlocked =
    assessment.mode === "checkpoint" ? true :
    assessment.mode === "module_quiz"
      ? module.checkpoints.every((cp) => progress?.sectionProgress[cp.id.replace("checkpoint-", "")]?.passed)
      : assessment.mode === "module_test"
      ? (progress?.moduleProgress[module.id]?.quizScore ?? 0) >= assessment.passingScore
      : true;

  const allAnswered = Object.keys(answers).length === assessment.questions.length;
  const passed = result && result.score >= assessment.passingScore;

  if (!unlocked) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] p-8 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="font-semibold text-[color:var(--ink)]">{assessment.title}</p>
        <p className="mt-2 text-sm text-[color:var(--copy)]">
          {assessment.mode === "module_quiz" ? "Pass every section checkpoint at 70%+ to unlock." : "Score 75%+ on the module quiz to unlock this test."}
        </p>
        <button className="button-secondary mt-4 text-sm" onClick={onNext}>Skip →</button>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[color:var(--accent-3)]">{assessment.mode.replace(/_/g, " ")}</p>
          <h3 className="mt-1.5 font-display text-2xl font-700 text-[color:var(--ink)]">{assessment.title}</h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-[1.8] text-[color:var(--copy)]">{assessment.description}</p>
        </div>
        <div className="rounded-[1rem] bg-[color:var(--surface-2)] px-4 py-2.5 text-sm border border-[color:var(--line)]">
          Pass at <strong className="text-[color:var(--accent-3)]">{assessment.passingScore}%</strong>
        </div>
      </div>
      <div className="grid gap-4">
        {assessment.questions.map((question, index) => (
          <fieldset key={question.id} className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--surface-2)] px-5 py-5">
            <legend className="px-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[color:var(--accent-3)]">Q{index + 1} · {question.objectiveTitle}</legend>
            <p className="mt-3 text-base leading-[1.8] text-[color:var(--ink)] font-medium">{question.prompt}</p>
            <div className="mt-4 grid gap-2.5">
              {question.choices.map((choice, ci) => {
                const selected = answers[question.id] === choice;
                const showCorrect = Boolean(result) && choice === question.answer;
                const showWrong = Boolean(result) && selected && choice !== question.answer;
                return (
                  <label key={choice} className={[
                    "rounded-[1rem] border px-4 py-3.5 text-sm leading-[1.7] transition flex items-center gap-3 cursor-pointer",
                    showCorrect ? "border-emerald-500 bg-[rgba(16,185,129,0.14)] text-[color:var(--ink)]" :
                    showWrong ? "border-rose-500 bg-[rgba(244,63,94,0.14)] text-[color:var(--ink)]" :
                    selected ? "border-[color:var(--accent-3)] bg-[color:var(--accent-3-soft)] text-[color:var(--ink)]" :
                    "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--copy)] hover:border-[color:var(--line-strong)]",
                  ].join(" ")}>
                    <span className={[
                      "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                      showCorrect ? "bg-emerald-500 text-white" : showWrong ? "bg-rose-500 text-white" :
                      selected ? "bg-[color:var(--accent-3)] text-white" : "bg-[color:var(--surface-2)] text-[color:var(--muted)]",
                    ].join(" ")}>
                      {showCorrect ? "✓" : showWrong ? "✗" : CHOICE_LETTERS[ci]}
                    </span>
                    <input className="sr-only" type="radio" name={question.id} value={choice} checked={selected}
                      onChange={() => !result && setAnswers((cur) => ({ ...cur, [question.id]: choice }))} />
                    {choice}
                  </label>
                );
              })}
            </div>
            {result && (
              <div className="mt-3 rounded-[0.9rem] bg-[color:var(--surface-3)] px-4 py-3 text-sm leading-[1.8] text-[color:var(--copy)]">
                <span className="font-bold text-[color:var(--ink)]">Explanation: </span>{question.explanation}
              </div>
            )}
          </fieldset>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-2">
        {!result ? (
          <button className="button-amber disabled:cursor-not-allowed disabled:opacity-40" disabled={isSubmitting || !allAnswered}
            onClick={async () => { setIsSubmitting(true); const r = await onSubmit(assessment, answers); setResult(r); setIsSubmitting(false); }}>
            {isSubmitting ? "Scoring…" : "Submit"}
          </button>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`rounded-[1.2rem] px-6 py-4 text-center border ${passed ? "bg-[rgba(16,185,129,0.14)] border-emerald-500" : "bg-[rgba(244,63,94,0.14)] border-rose-500"}`}>
              <p className={`text-4xl font-display font-bold ${passed ? "score-pass" : "score-fail"}`}>{result.score}%</p>
              <p className="text-sm text-[color:var(--copy)] mt-1">{result.correct}/{result.total} correct</p>
              <p className={`text-xs font-bold mt-1 ${passed ? "score-pass" : "score-fail"}`}>{passed ? "🎉 Passed!" : "Keep going!"}</p>
            </div>
            <button className="button-amber" onClick={onNext}>Continue →</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DONE STEP ──────────────────────────────────────────────────────────── */
function DoneStep({ module, onSelectModule }: { module: ModuleBundle; onSelectModule: () => void }) {
  return (
    <div className="rounded-[1.75rem] border border-emerald-500 bg-[rgba(16,185,129,0.08)] p-10 text-center grid gap-4">
      <p className="text-5xl">🎉</p>
      <h3 className="font-display text-3xl font-700 text-[color:var(--ink)]">Module Complete!</h3>
      <p className="text-sm leading-[1.8] text-[color:var(--copy)] max-w-lg mx-auto">
        You&apos;ve finished <strong>{module.title}</strong>. Select the next module from the sidebar to keep going.
      </p>
      <button className="button-success mx-auto mt-2" onClick={onSelectModule}>Choose next module →</button>
    </div>
  );
}

/* ─── STEP PROGRESS BAR ──────────────────────────────────────────────────── */
function StepBar({ steps, current, onJump }: { steps: StepKind[]; current: number; onJump: (i: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const label =
          step.type === "learn" ? `📖 ${step.section.title.split(" ").slice(0, 2).join(" ")}` :
          step.type === "flashcards" ? "🃏" :
          step.type === "videos" ? "▶" :
          step.type === "assessment"
            ? (step.assessment.mode === "module_quiz" ? "Quiz" : step.assessment.mode === "module_test" ? "Test" : "✔")
            : "✅";
        const title =
          step.type === "learn" ? `Learn: ${step.section.title}` :
          step.type === "flashcards" ? `Flashcards: ${step.section.title}` :
          step.type === "videos" ? `Videos: ${step.section.title}` :
          step.type === "assessment" ? step.assessment.title : "Complete";
        return (
          <button key={i} title={title} onClick={() => done && onJump(i)}
            className={[
              "rounded-full px-3 py-1.5 text-[0.63rem] font-bold transition border",
              active ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)] shadow-[0_0_0_2px_rgba(124,58,237,0.4)]" :
              done ? "bg-[rgba(16,185,129,0.18)] text-emerald-400 border-[rgba(16,185,129,0.3)] cursor-pointer hover:opacity-80" :
              "bg-[color:var(--surface-2)] text-[color:var(--muted)] border-[color:var(--line)] cursor-default opacity-50",
            ].join(" ")}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── AI COACH PANEL (floating) ──────────────────────────────────────────── */
function CoachPanel({
  moduleId, objectiveId, messages, onMessage,
}: {
  moduleId: string; objectiveId?: string; messages: CoachMessage[]; onMessage: (msgs: CoachMessage[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  async function send() {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion("");
    setLoading(true);
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, objectiveId, question: q }),
    });
    const payload = (await res.json()) as { reply: string };
    onMessage([...messages, { role: "user", content: q }, { role: "assistant", content: payload.reply }]);
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[color:var(--accent)] text-white text-xl shadow-[0_8px_32px_rgba(124,58,237,0.5)] flex items-center justify-center transition hover:scale-110 hover:shadow-[0_12px_40px_rgba(124,58,237,0.65)]"
        title="AI Coach"
      >
        {open ? "✕" : "✨"}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-3rem))] rounded-[1.75rem] border border-[color:var(--line-strong)] bg-[color:var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}
        >
          <div className="px-5 py-4 border-b border-[color:var(--line)] flex items-center gap-3 flex-shrink-0">
            <span className="text-lg">✨</span>
            <div>
              <p className="font-bold text-sm text-[color:var(--ink)]">AI Coach</p>
              <p className="text-[0.62rem] text-[color:var(--muted)]">Constrained to published course content</p>
            </div>
            {messages.length > 0 && (
              <button className="ml-auto text-[0.62rem] text-[color:var(--muted)] hover:text-[color:var(--ink)]" onClick={() => onMessage([])}>Clear</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 grid gap-3 content-start">
            {messages.length === 0 && (
              <p className="text-xs leading-[1.8] text-[color:var(--muted)] pt-2">
                Ask anything about this module — explanations, comparisons, exam tips.
              </p>
            )}
            {messages.map((msg, idx) => (
              <article key={idx} className={[
                "rounded-[1.1rem] px-3.5 py-3 text-sm leading-[1.85]",
                msg.role === "assistant"
                  ? "bg-[color:var(--surface-2)] border border-[color:var(--line)] text-[color:var(--copy)] mr-6"
                  : "bg-[color:var(--accent-soft)] border border-[rgba(124,58,237,0.28)] text-[color:var(--ink)] ml-6",
              ].join(" ")}>
                <p className="text-[0.58rem] font-bold uppercase tracking-widest text-[color:var(--muted)] mb-1.5">{msg.role === "assistant" ? "Coach" : "You"}</p>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </article>
            ))}
            {loading && (
              <div className="rounded-[1.1rem] px-3.5 py-3 bg-[color:var(--surface-2)] border border-[color:var(--line)] mr-6">
                <p className="text-xs text-[color:var(--muted)] animate-pulse">Thinking…</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="px-4 py-3 border-t border-[color:var(--line)] flex gap-2 flex-shrink-0">
            <input
              className="min-w-0 flex-1 rounded-[0.9rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] px-3 py-2.5 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted)]"
              placeholder="Ask a question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void send()}
            />
            <button className="button-primary px-4 py-2.5 text-sm" onClick={() => void send()} disabled={loading || !question.trim()}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── STUDY SHELL ────────────────────────────────────────────────────────── */
export function StudyShell({ initialModules }: StudyShellProps) {
  const [selectedModuleId, setSelectedModuleId] = useState(initialModules[0]?.id ?? "");
  const [module, setModule] = useState<ModuleBundle | null>(null);
  const [progress, setProgress] = useState<LocalProgressState | null>(null);
  const [steps, setSteps] = useState<StepKind[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState("");
  const [hostedReady, setHostedReady] = useState(() => !hasSupabaseEnv());
  const [isPending, setIsPending] = useState(false);

  const activeStep = steps[currentStep];
  const coachObjectiveId =
    activeStep?.type === "learn" || activeStep?.type === "flashcards" || activeStep?.type === "videos"
      ? activeStep.objectives[0]?.id
      : undefined;

  useEffect(() => {
    let active = true;
    void (async () => {
      setIsPending(true);
      const state = await loadProgressState();
      if (active) setProgress(state);
      const response = await fetch(`/api/modules/${selectedModuleId}`);
      const payload = (await response.json()) as { module: ModuleBundle };
      if (active) {
        const mod = payload.module;
        setModule(mod);
        setSteps(buildSteps(mod));
        setCurrentStep(0);
        setIsPending(false);
      }
    })();
    return () => { active = false; };
  }, [selectedModuleId]);

  useEffect(() => {
    if (!hasSupabaseEnv() || !signedInEmail || !progress?.pendingAttempts.length) return;
    let active = true;
    void (async () => {
      setSyncMessage("Syncing…");
      const responses = await Promise.all(
        progress.pendingAttempts.map(async (attempt) => {
          const res = await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(attempt) });
          return { attemptId: attempt.id, ok: res.ok };
        }),
      );
      const syncedIds = responses.filter((r) => r.ok).map((r) => r.attemptId);
      if (!syncedIds.length) { if (active) setSyncMessage("Sync paused."); return; }
      let next = await markPendingAttemptsSynced(syncedIds);
      const remoteRes = await fetch("/api/progress");
      if (remoteRes.ok) {
        const payload = (await remoteRes.json()) as { progress: LocalProgressState };
        next = await mergeRemoteProgressState(payload.progress);
      }
      if (active) { setProgress(next); setSyncMessage("Synced."); }
    })();
    return () => { active = false; };
  }, [progress?.pendingAttempts, signedInEmail]);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    client.auth.getSession().then(({ data }) => {
      setSignedInEmail(data.session?.user.email ?? null);
      setHostedReady(!data.session?.user.email);
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setSignedInEmail(session?.user.email ?? null);
      setHostedReady(!session?.user.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv() || !signedInEmail) return;
    let active = true;
    void (async () => {
      setSyncMessage("Loading hosted progress…");
      const response = await fetch("/api/progress");
      if (!response.ok) { if (active) { setSyncMessage("Could not load hosted progress."); setHostedReady(false); } return; }
      const payload = (await response.json()) as { progress: LocalProgressState };
      const merged = await mergeRemoteProgressState(payload.progress);
      if (active) { setProgress(merged); setSyncMessage("Hosted progress loaded."); setHostedReady(true); }
    })();
    return () => { active = false; };
  }, [signedInEmail]);

  useEffect(() => {
    if (!hasSupabaseEnv() || !signedInEmail || !progress || !hostedReady) return;
    const tid = window.setTimeout(() => {
      void fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ progress }) })
        .then((res) => { if (res.ok) setSyncMessage("Progress synced."); });
    }, 400);
    return () => window.clearTimeout(tid);
  }, [progress, signedInEmail, hostedReady]);

  function goNext() {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const modIndex = initialModules.findIndex((m) => m.id === selectedModuleId);
  const moduleColor = MODULE_COLORS[modIndex % MODULE_COLORS.length] ?? "var(--accent)";
  const moduleEmoji = MODULE_EMOJIS[modIndex % MODULE_EMOJIS.length] ?? "📖";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-4 py-6 lg:px-8">

      {/* ── HEADER ── */}
      <header className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] mb-6"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.28) 0%, rgba(6,182,212,0.14) 60%, rgba(245,158,11,0.08) 100%), var(--surface)" }}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_70%)]" />
          <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.15),transparent_70%)]" />
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎓</span>
              <span className="progress-pill progress-pill-ready text-[0.62rem]">CLEP Humanities</span>
              {isPending && <span className="text-xs text-[color:var(--accent-2)] animate-pulse">Loading…</span>}
            </div>
            <h1 className="font-display text-3xl font-700 text-[color:var(--ink)] leading-snug">Private Study Lab</h1>
            {syncMessage && <p className="mt-1.5 text-xs text-[color:var(--accent-2)]">⟳ {syncMessage}</p>}
          </div>
          {hasSupabaseEnv() && (
            <section className="min-w-[260px] max-w-xs rounded-[1.5rem] border border-[color:var(--line-strong)] p-4"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
              <p className="text-[0.62rem] font-bold uppercase tracking-widest text-[color:var(--muted)] mb-2">🔐 Sync</p>
              {signedInEmail ? (
                <p className="text-xs text-[color:var(--copy)]">Signed in as <strong className="text-[color:var(--ink)]">{signedInEmail}</strong></p>
              ) : (
                <div className="grid gap-2">
                  <input className="rounded-[0.8rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-3)] px-3 py-2.5 text-xs text-[color:var(--ink)] placeholder:text-[color:var(--muted)]"
                    type="email" placeholder="you@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                  <button className="button-primary text-xs py-2.5" onClick={async () => {
                    const client = createSupabaseBrowserClient();
                    if (!client || !authEmail) return;
                    const { error } = await client.auth.signInWithOtp({ email: authEmail, options: { emailRedirectTo: window.location.origin } });
                    setAuthMessage(error ? error.message : "Magic link sent!");
                  }}>Send magic link</button>
                  {authMessage && <p className="text-[0.65rem] text-[color:var(--copy)]">{authMessage}</p>}
                </div>
              )}
            </section>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

        {/* ── SIDEBAR ── */}
        <aside className="grid h-fit gap-3 lg:sticky lg:top-6">
          <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
            <p className="text-[0.62rem] font-bold uppercase tracking-widest text-[color:var(--muted)] mb-3">📚 Modules</p>
            <div className="grid gap-2">
              {initialModules.map((item, idx) => {
                const mp = progress?.moduleProgress[item.id];
                const isSelected = selectedModuleId === item.id;
                const isShell = item.state === "shell";
                return (
                  <button key={item.id}
                    className={[
                      "rounded-[1.2rem] border px-4 py-3.5 text-left transition-all",
                      isSelected ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] shadow-[0_0_0_1px_rgba(124,58,237,0.35)]" :
                      "border-[color:var(--line)] bg-[color:var(--surface-2)] hover:border-[color:var(--line-strong)]",
                      isShell ? "opacity-55" : "",
                    ].join(" ")}
                    style={isSelected ? {} : { borderLeftColor: MODULE_COLORS[idx % MODULE_COLORS.length], borderLeftWidth: 3 }}
                    onClick={() => {
                      if (isShell) return;
                      setIsPending(true);
                      startTransition(() => { setSelectedModuleId(item.id); setIsPending(false); });
                    }}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg mt-0.5 flex-shrink-0">{isShell ? "🔒" : MODULE_EMOJIS[idx % MODULE_EMOJIS.length]}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[color:var(--ink)] leading-snug">{item.title}</p>
                        <span className={`mt-1.5 inline-block progress-pill text-[0.58rem] ${
                          mp?.status === "passed" || mp?.status === "mastered" ? "progress-pill-done" :
                          mp?.status === "learning" ? "progress-pill-pending" : "progress-pill-locked"
                        }`}>{isShell ? "soon" : (mp?.status ?? "not started")}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
          <button className="button-secondary text-xs py-3" onClick={async () => {
            await clearProgressState();
            setProgress(await loadProgressState());
            setCurrentStep(0);
          }}>Reset Progress</button>
        </aside>

        {/* ── CONTENT ── */}
        <section className="grid gap-4 content-start">
          {module ? (
            <>
              {/* Module header + step bar */}
              <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5"
                style={{ borderLeftWidth: 3, borderLeftColor: moduleColor }}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-2xl">{moduleEmoji}</span>
                      <span className="progress-pill progress-pill-ready text-[0.6rem]">Module {module.order}</span>
                    </div>
                    <h2 className="font-display text-2xl font-700 text-[color:var(--ink)]">{module.title}</h2>
                    <p className="mt-1.5 text-xs leading-[1.8] text-[color:var(--copy)] max-w-2xl">{module.description}</p>
                  </div>
                  <div className="text-[0.62rem] text-[color:var(--muted)] grid gap-1">
                    <span><strong className="text-[color:var(--ink)]">Buckets:</strong> {module.officialBuckets.join(", ")}</span>
                    <span><strong className="text-[color:var(--ink)]">Focus:</strong> {module.focus}</span>
                  </div>
                </div>
                <StepBar steps={steps} current={currentStep} onJump={setCurrentStep} />
              </div>

              {/* Active step card */}
              <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6">
                {module.state === "shell" ? (
                  <div className="rounded-[1.75rem] p-[1px] shimmer-border">
                    <div className="rounded-[1.7rem] bg-[color:var(--surface)] p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">🔒</span>
                        <div>
                          <h3 className="font-display text-2xl font-700 text-[color:var(--ink)]">Coming Soon</h3>
                          <span className="progress-pill progress-pill-locked text-[0.6rem] mt-1">awaiting normalization</span>
                        </div>
                      </div>
                      <p className="max-w-2xl text-sm leading-[1.85] text-[color:var(--copy)]">
                        This module is structured and ready. Once its objectives are approved, the full section-by-section flow will appear here.
                      </p>
                      {(module.shellSections?.length ?? 0) > 0 && (
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {(module.shellSections ?? []).map((s) => (
                            <article key={s.title} className="rounded-[1.2rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] p-4">
                              <p className="font-semibold text-sm text-[color:var(--ink)]">{s.title}</p>
                              <p className="mt-1.5 text-xs leading-[1.75] text-[color:var(--copy)]">{s.description}</p>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeStep?.type === "learn" ? (
                  <LearnStep
                    section={activeStep.section}
                    objectives={activeStep.objectives}
                    progress={progress}
                    onMarkLearned={async (id) => setProgress(await markObjectiveLearned(id))}
                    onAskCoach={(q, objId) => {
                      setCoachMessages((cur) => [...cur, { role: "user", content: q }]);
                      void (async () => {
                        const res = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: module.id, objectiveId: objId, question: q }) });
                        const payload = (await res.json()) as { reply: string };
                        setCoachMessages((cur) => [...cur, { role: "assistant", content: payload.reply }]);
                      })();
                    }}
                    onNext={goNext}
                  />
                ) : activeStep?.type === "flashcards" ? (
                  <FlashcardStep
                    section={activeStep.section}
                    objectives={activeStep.objectives}
                    progress={progress}
                    onMarkReviewed={async (ids) => {
                      let next = progress;
                      for (const id of ids) next = await markFlashcardsReviewed(id);
                      setProgress(next);
                    }}
                    onNext={goNext}
                  />
                ) : activeStep?.type === "videos" ? (
                  <VideoStep section={activeStep.section} objectives={activeStep.objectives} onNext={goNext} />
                ) : activeStep?.type === "assessment" ? (
                  <AssessmentStep
                    assessment={activeStep.assessment}
                    progress={progress}
                    module={module}
                    onSubmit={async (a, ans) => {
                      const result = await recordAssessmentResult(module, a, ans);
                      setProgress(result.state);
                      return { score: result.score, total: result.total, correct: result.correct };
                    }}
                    onNext={goNext}
                  />
                ) : activeStep?.type === "done" ? (
                  <DoneStep
                    module={module}
                    onSelectModule={() => {
                      const next = initialModules.find((m) => m.state !== "shell" && m.id !== module.id);
                      if (next) setSelectedModuleId(next.id);
                    }}
                  />
                ) : null}
              </div>
            </>
          ) : (
            <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-8 flex items-center gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-[color:var(--accent)] border-t-transparent animate-spin" />
              <p className="text-sm text-[color:var(--copy)]">Loading module…</p>
            </section>
          )}
        </section>
      </main>

      {/* ── FLOATING AI COACH ── */}
      {module && (
        <CoachPanel
          moduleId={module.id}
          objectiveId={coachObjectiveId}
          messages={coachMessages}
          onMessage={setCoachMessages}
        />
      )}
    </div>
  );
}
