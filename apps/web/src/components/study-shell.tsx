"use client";

import { startTransition, useEffect, useState } from "react";

import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase";
import {
  clearProgressState,
  getRecommendation,
  isAssessmentUnlocked,
  loadProgressState,
  markPendingAttemptsSynced,
  markFlashcardsReviewed,
  markObjectiveLearned,
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
} from "@/lib/types";

interface StudyShellProps {
  initialModules: ModuleSummary[];
}

interface AssessmentResult {
  score: number;
  total: number;
  correct: number;
}

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

function getSectionLabel(module: ModuleBundle, objective: Objective) {
  return (
    module.sections.find((section) => section.id === objective.sectionId)?.title ??
    "Objective"
  );
}

function isModuleAssessmentUnlocked(
  assessment: AssessmentBundle,
  module: ModuleBundle,
  progress: LocalProgressState | null,
) {
  if (!progress) return assessment.mode === "checkpoint";
  if (assessment.mode === "checkpoint") return true;
  if (assessment.mode === "module_quiz") {
    return module.checkpoints.every(
      (cp) => progress.sectionProgress[cp.id.replace("checkpoint-", "")]?.passed,
    );
  }
  if (assessment.mode === "module_test") {
    return (progress.moduleProgress[module.id]?.quizScore ?? 0) >= assessment.passingScore;
  }
  return true;
}

/* ─── FLASHCARD ─────────────────────────────────────────────────────────── */
function FlipCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`flip-card${flipped ? " flipped" : ""}`}
      style={{ minHeight: 120 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--muted)] mb-2">
            Question — tap to flip
          </p>
          <p className="font-semibold text-[color:var(--ink)] leading-6">{front}</p>
        </div>
        <div className="flip-card-back">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-2)] mb-2">
            Answer ✓
          </p>
          <p className="text-sm leading-6 text-[color:var(--copy)]">{back}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── OBJECTIVE CARD ────────────────────────────────────────────────────── */
function ObjectiveCard({
  objective,
  module,
  progress,
  onMarkLearned,
  onMarkCards,
  onAskCoach,
}: {
  objective: Objective;
  module: ModuleBundle;
  progress: LocalProgressState | null;
  onMarkLearned: (objectiveId: string) => void;
  onMarkCards: (objectiveId: string) => void;
  onAskCoach: (question: string, objectiveId: string) => void;
}) {
  const op = progress?.objectiveProgress[objective.id];
  const [allFlipped, setAllFlipped] = useState(false);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());

  function handleCardFlip(id: string) {
    const next = new Set(flippedIds).add(id);
    setFlippedIds(next);
    if (next.size >= objective.flashcards.length) setAllFlipped(true);
  }

  const disciplineStripe =
    objective.discipline === "literature" ? "stripe-lit" :
    objective.discipline === "arts"       ? "stripe-art" :
    "stripe-mixed";

  return (
    <article
      className={`rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-[0_12px_48px_rgba(0,0,0,0.36)] ${disciplineStripe}`}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[color:var(--muted)]">
            {getSectionLabel(module, objective)}
          </p>
          <h3 className="mt-2 font-display text-2xl font-700 text-[color:var(--ink)] leading-snug">
            {objective.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {objective.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[color:var(--surface-2)] px-3 py-1 text-[0.68rem] font-semibold text-[color:var(--muted)] border border-[color:var(--line)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-col gap-2 items-end">
          <span className={`progress-pill ${op?.learned ? "progress-pill-done" : "progress-pill-pending"}`}>
            {op?.learned ? "✅ Learned" : "📘 Not learned"}
          </span>
          <span className={`progress-pill ${op?.flashcardsReviewed ? "progress-pill-done" : "progress-pill-pending"}`}>
            {op?.flashcardsReviewed ? "🃏 Cards done" : "🃏 Cards pending"}
          </span>
          {(op?.averageScore ?? 0) > 0 && (
            <span className={`progress-pill ${(op?.averageScore ?? 0) >= 75 ? "progress-pill-done" : "progress-pill-pending"}`}>
              📊 {op?.averageScore}% avg
            </span>
          )}
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">

        {/* Learn block */}
        <div className="rounded-[1.4rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] p-5 stripe-lit">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-2)]">
            📖 Learn
          </p>
          <p className="mt-3 text-sm leading-[1.85] text-[color:var(--copy)]">
            {objective.learn.conciseExplanation}
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[1rem] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[color:var(--accent-2)] mb-1">🔑 Key Example</p>
              <p className="text-sm leading-[1.8] text-[color:var(--copy)]">{objective.learn.keyExample}</p>
            </div>
            <div className="rounded-[1rem] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[color:var(--accent-3)] mb-1">💡 Exam Clue</p>
              <p className="text-sm leading-[1.8] text-[color:var(--copy)]">{objective.learn.examClue}</p>
            </div>
            <div className="rounded-[1rem] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[color:var(--muted)] mb-1">↔️ Compare</p>
              <p className="text-sm leading-[1.8] text-[color:var(--copy)]">{objective.learn.compareContrast}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className={op?.learned ? "button-success" : "button-primary"}
              onClick={() => onMarkLearned(objective.id)}
            >
              {op?.learned ? "✅ Learned!" : "Mark Learn Complete"}
            </button>
            <button
              className="button-secondary"
              onClick={() =>
                onAskCoach(`Explain ${objective.title} in simpler test-ready language.`, objective.id)
              }
            >
              ✨ Ask Coach
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="grid gap-4">
          {/* Flashcards */}
          <div className="rounded-[1.4rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--accent)]">
                🃏 Flashcards
              </p>
              <button
                className={allFlipped || op?.flashcardsReviewed ? "button-success" : "button-secondary"}
                onClick={() => onMarkCards(objective.id)}
              >
                {op?.flashcardsReviewed ? "✅ Done" : "Mark Reviewed"}
              </button>
            </div>
            <div className="grid gap-3">
              {objective.flashcards.map((card) => (
                <div key={card.id} onClick={() => handleCardFlip(card.id)}>
                  <FlipCard front={card.front} back={card.back} />
                </div>
              ))}
            </div>
            {!op?.flashcardsReviewed && objective.flashcards.length > 0 && (
              <p className="mt-3 text-[0.68rem] text-[color:var(--muted)]">
                Tap each card to flip. Mark reviewed after you&apos;ve seen all answers.
              </p>
            )}
          </div>

          {/* Video support */}
          <div className="rounded-[1.4rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] p-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-3)] mb-3">
              ▶ Video Support
            </p>
            {objective.videos.length ? (
              <div className="grid gap-3">
                {objective.videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.1rem] border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-4 flex gap-3 items-start transition hover:-translate-y-0.5 hover:border-[color:var(--accent-3)]"
                  >
                    <span className="text-2xl mt-0.5">▶</span>
                    <div>
                      <p className="font-semibold text-[color:var(--ink)] text-sm">{video.title}</p>
                      <p className="mt-1.5 text-xs leading-[1.75] text-[color:var(--copy)]">
                        <span className="font-bold text-[color:var(--accent-3)]">Watch for:</span>{" "}
                        {video.watchFor}
                      </p>
                      <p className="mt-1.5 text-xs leading-[1.75] text-[color:var(--copy)]">
                        <span className="font-bold text-[color:var(--muted)]">After watching:</span>{" "}
                        {video.retrievalPrompt}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-[1.8] text-[color:var(--muted)]">
                No video needed — the learn → cards → checkpoint loop covers this one.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── ASSESSMENT RUNNER ─────────────────────────────────────────────────── */
function AssessmentRunner({
  assessment,
  onSubmit,
}: {
  assessment: AssessmentBundle;
  onSubmit: (
    assessment: AssessmentBundle,
    answers: Record<string, string>,
  ) => Promise<AssessmentResult>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allAnswered = Object.keys(answers).length === assessment.questions.length;
  const passed = result && result.score >= assessment.passingScore;

  return (
    <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 stripe-mixed">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-3)]">
            {assessment.mode.replace(/_/g, " ")}
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-700 text-[color:var(--ink)]">
            {assessment.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-[1.8] text-[color:var(--copy)]">
            {assessment.description}
          </p>
        </div>
        <div className="rounded-[1rem] bg-[color:var(--surface-2)] px-4 py-2.5 text-sm border border-[color:var(--line)]">
          <span className="text-[color:var(--muted)]">Pass at </span>
          <strong className="text-[color:var(--accent-3)]">{assessment.passingScore}%</strong>
        </div>
      </div>

      {/* Questions */}
      <div className="grid gap-5">
        {assessment.questions.map((question, index) => (
          <fieldset
            key={question.id}
            className="rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--surface-2)] px-5 py-5"
          >
            <legend className="px-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[color:var(--accent-3)]">
              Q{index + 1} · {question.objectiveTitle}
            </legend>
            <p className="mt-3 text-base leading-[1.8] text-[color:var(--ink)] font-medium">
              {question.prompt}
            </p>
            <div className="mt-4 grid gap-2.5">
              {question.choices.map((choice, ci) => {
                const selected = answers[question.id] === choice;
                const showCorrect = Boolean(result) && choice === question.answer;
                const showWrong = Boolean(result) && selected && choice !== question.answer;

                return (
                  <label
                    key={choice}
                    className={[
                      "rounded-[1rem] border px-4 py-3.5 text-sm leading-[1.7] transition flex items-center gap-3 cursor-pointer",
                      showCorrect
                        ? "border-emerald-500 bg-[rgba(16,185,129,0.14)] text-[color:var(--ink)]"
                        : showWrong
                        ? "border-rose-500 bg-[rgba(244,63,94,0.14)] text-[color:var(--ink)]"
                        : selected
                        ? "border-[color:var(--accent-3)] bg-[color:var(--accent-3-soft)] text-[color:var(--ink)]"
                        : "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--copy)] hover:border-[color:var(--line-strong)]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                          ? "bg-rose-500 text-white"
                          : selected
                          ? "bg-[color:var(--accent-3)] text-white"
                          : "bg-[color:var(--surface-2)] text-[color:var(--muted)]",
                      ].join(" ")}
                    >
                      {showCorrect ? "✓" : showWrong ? "✗" : CHOICE_LETTERS[ci]}
                    </span>
                    <input
                      className="sr-only"
                      type="radio"
                      name={question.id}
                      value={choice}
                      checked={selected}
                      onChange={() =>
                        !result &&
                        setAnswers((cur) => ({ ...cur, [question.id]: choice }))
                      }
                    />
                    {choice}
                  </label>
                );
              })}
            </div>
            {result && (
              <div className="mt-3 rounded-[0.9rem] bg-[color:var(--surface-3)] px-4 py-3 text-sm leading-[1.8] text-[color:var(--copy)]">
                <span className="font-bold text-[color:var(--ink)]">Explanation: </span>
                {question.explanation}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      {/* Submit / Result row */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!result ? (
          <button
            className="button-amber disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isSubmitting || !allAnswered}
            onClick={async () => {
              setIsSubmitting(true);
              const next = await onSubmit(assessment, answers);
              setResult(next);
              setIsSubmitting(false);
            }}
          >
            {isSubmitting ? "Scoring…" : "Submit Assessment"}
          </button>
        ) : (
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className={`rounded-[1.2rem] px-6 py-4 text-center border ${
                passed
                  ? "bg-[rgba(16,185,129,0.14)] border-emerald-500"
                  : "bg-[rgba(244,63,94,0.14)] border-rose-500"
              }`}
            >
              <p className={`text-4xl font-display font-bold ${passed ? "score-pass" : "score-fail"}`}>
                {result.score}%
              </p>
              <p className="text-sm text-[color:var(--copy)] mt-1">
                {result.correct}/{result.total} correct
              </p>
              <p className={`text-xs font-bold mt-1 ${passed ? "score-pass" : "score-fail"}`}>
                {passed ? "🎉 Passed!" : "Keep studying — you've got this"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── STUDY SHELL ───────────────────────────────────────────────────────── */
export function StudyShell({ initialModules }: StudyShellProps) {
  const [selectedModuleId, setSelectedModuleId] = useState(initialModules[0]?.id ?? "");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [selectedCumulativeId, setSelectedCumulativeId] = useState<string>("");
  const [module, setModule] = useState<ModuleBundle | null>(null);
  const [progress, setProgress] = useState<LocalProgressState | null>(null);
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authMessage, setAuthMessage] = useState<string>("");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string>("");
  const [hostedReady, setHostedReady] = useState<boolean>(() => !hasSupabaseEnv());
  const [isPending, setIsPending] = useState(false);
  const selectedObjective = module?.objectives[0] ?? null;

  useEffect(() => {
    let active = true;
    void (async () => {
      const state = await loadProgressState();
      if (active) setProgress(state);

      const response = await fetch(`/api/modules/${selectedModuleId}`);
      const payload = (await response.json()) as { module: ModuleBundle };
      if (active) {
        setModule(payload.module);
        setSelectedAssessmentId(
          payload.module.checkpoints[0]?.id ?? payload.module.moduleQuiz?.id ?? "",
        );
        setSelectedCumulativeId(payload.module.cumulativeAssessments[0]?.id ?? "");
      }
    })();
    return () => { active = false; };
  }, [selectedModuleId]);

  useEffect(() => {
    if (!hasSupabaseEnv() || !signedInEmail || !progress?.pendingAttempts.length) return;
    let active = true;
    void (async () => {
      setSyncMessage("Syncing queued attempts to Supabase…");
      const responses = await Promise.all(
        progress.pendingAttempts.map(async (attempt) => {
          const res = await fetch("/api/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(attempt),
          });
          return { attemptId: attempt.id, ok: res.ok };
        }),
      );
      const syncedIds = responses.filter((r) => r.ok).map((r) => r.attemptId);
      if (!syncedIds.length) {
        if (active) setSyncMessage("Attempt sync paused. Local progress is still safe.");
        return;
      }
      let next = await markPendingAttemptsSynced(syncedIds);
      const remoteRes = await fetch("/api/progress");
      if (remoteRes.ok) {
        const payload = (await remoteRes.json()) as { progress: LocalProgressState };
        next = await mergeRemoteProgressState(payload.progress);
      }
      if (active) {
        setProgress(next);
        setSyncMessage("Hosted attempt history is up to date.");
      }
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
      if (!response.ok) {
        if (active) {
          setSyncMessage("Signed in, but hosted progress could not be loaded yet.");
          setHostedReady(false);
        }
        return;
      }
      const payload = (await response.json()) as { progress: LocalProgressState };
      const merged = await mergeRemoteProgressState(payload.progress);
      if (active) {
        setProgress(merged);
        setSyncMessage("Hosted progress loaded.");
        setHostedReady(true);
      }
    })();
    return () => { active = false; };
  }, [signedInEmail]);

  useEffect(() => {
    if (!hasSupabaseEnv() || !signedInEmail || !progress || !hostedReady) return;
    const tid = window.setTimeout(() => {
      void fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      }).then((res) => { if (res.ok) setSyncMessage("Progress synced."); });
    }, 400);
    return () => window.clearTimeout(tid);
  }, [progress, signedInEmail, hostedReady]);

  const recommendation = module && progress ? getRecommendation(module, progress) : null;
  const moduleAssessments = module
    ? [
        ...module.checkpoints,
        ...(module.moduleQuiz ? [module.moduleQuiz] : []),
        ...(module.moduleTest ? [module.moduleTest] : []),
      ]
    : [];
  const cumulativeAssessments = module?.cumulativeAssessments ?? [];
  const selectedAssessment =
    moduleAssessments.find((a) => a.id === selectedAssessmentId) ??
    moduleAssessments[0] ??
    null;
  const selectedCumulativeAssessment =
    cumulativeAssessments.find((a) => a.id === selectedCumulativeId) ??
    cumulativeAssessments[0] ??
    null;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-6 lg:px-8">

      {/* ── HERO HEADER ── */}
      <header className="relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.32) 0%, rgba(6,182,212,0.18) 60%, rgba(245,158,11,0.1) 100%), var(--surface)",
        }}
      >
        {/* background glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.3),transparent_70%)]" />
          <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.2),transparent_70%)]" />
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🎓</span>
              <span className="progress-pill progress-pill-ready text-xs">Private Study Lab</span>
            </div>
            <h1 className="font-display text-4xl font-700 leading-[1.15] text-[color:var(--ink)] md:text-5xl">
              Master the Humanities.
              <br />
              <span style={{ color: "var(--accent-2)" }}>Every lesson linked. Every gap found.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-[1.85] text-[color:var(--copy)]">
              Built for the CLEP exam — structured, objective-driven, and designed so nothing falls through the cracks.
            </p>
            {isPending && (
              <p className="mt-3 text-sm text-[color:var(--accent-2)] animate-pulse">Loading module…</p>
            )}
          </div>

          {/* Auth card */}
          <section
            className="min-w-[300px] max-w-sm rounded-[1.5rem] border border-[color:var(--line-strong)] p-5"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)" }}
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              🔐 Auth &amp; Sync
            </p>
            <p className="mt-2.5 text-sm leading-[1.8] text-[color:var(--copy)]">
              {hasSupabaseEnv()
                ? "Supabase detected — use magic-link sign-in to sync progress across devices."
                : "Preview mode — progress saves locally to IndexedDB."}
            </p>
            {hasSupabaseEnv() && (
              <div className="mt-4 grid gap-3">
                <input
                  className="rounded-[0.9rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-3)] px-4 py-3 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted)]"
                  type="email"
                  placeholder="you@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
                <button
                  className="button-primary"
                  onClick={async () => {
                    const client = createSupabaseBrowserClient();
                    if (!client || !authEmail) return;
                    const { error } = await client.auth.signInWithOtp({
                      email: authEmail,
                      options: { emailRedirectTo: window.location.origin },
                    });
                    setAuthMessage(
                      error
                        ? error.message
                        : "Magic link sent — open it on this device.",
                    );
                  }}
                >
                  Send magic link
                </button>
                <p className="text-xs text-[color:var(--muted)]">
                  Signed in:{" "}
                  <strong className="text-[color:var(--ink)]">{signedInEmail ?? "Not yet"}</strong>
                </p>
              </div>
            )}
            {authMessage && (
              <p className="mt-3 text-xs leading-[1.7] text-[color:var(--copy)]">{authMessage}</p>
            )}
            {syncMessage && (
              <p className="mt-2 text-xs leading-[1.7] text-[color:var(--accent-2)]">⟳ {syncMessage}</p>
            )}
          </section>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <main className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

        {/* ── SIDEBAR ── */}
        <aside className="grid h-fit gap-5">

          {/* Module list */}
          <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[color:var(--muted)] mb-4">
              📚 Modules
            </p>
            <div className="grid gap-3">
              {initialModules.map((item, idx) => {
                const mp = progress?.moduleProgress[item.id];
                const isSelected = selectedModuleId === item.id;
                const isShell = item.state === "shell";
                const color = MODULE_COLORS[idx % MODULE_COLORS.length];
                const emoji = MODULE_EMOJIS[idx % MODULE_EMOJIS.length];
                return (
                  <button
                    key={item.id}
                    className={[
                      "rounded-[1.25rem] border px-4 py-4 text-left transition-all",
                      isSelected
                        ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] shadow-[0_0_0_1px_rgba(124,58,237,0.4)]"
                        : "border-[color:var(--line)] bg-[color:var(--surface-2)] hover:border-[color:var(--line-strong)]",
                      isShell ? "opacity-60" : "",
                    ].join(" ")}
                    style={isSelected ? {} : { borderLeftColor: color, borderLeftWidth: 3 }}
                    onClick={() => {
                      setIsPending(true);
                      startTransition(() => {
                        setSelectedModuleId(item.id);
                        setIsPending(false);
                      });
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl mt-0.5">{isShell ? "🔒" : emoji}</span>
                        <div>
                          <p className="font-bold text-sm text-[color:var(--ink)] leading-snug">{item.title}</p>
                          <p className="mt-1 text-xs leading-[1.7] text-[color:var(--copy)] line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span
                        className={`progress-pill text-[0.6rem] ${
                          mp?.status === "passed" || mp?.status === "mastered" ? "progress-pill-done" :
                          mp?.status === "learning" || mp?.status === "needs_review" ? "progress-pill-pending" :
                          "progress-pill-locked"
                        }`}
                      >
                        {mp?.status ?? "not started"}
                      </span>
                      {isShell && (
                        <span className="progress-pill progress-pill-locked text-[0.6rem]">coming soon</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Next best action */}
          <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                🎯 Next Action
              </p>
              <button
                className="button-secondary text-[0.7rem] px-3 py-2"
                onClick={async () => {
                  await clearProgressState();
                  setProgress(await loadProgressState());
                }}
              >
                Reset
              </button>
            </div>
            {recommendation ? (
              <div className="rounded-[1.2rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] p-4">
                <p className="font-bold text-sm text-[color:var(--ink)]">{recommendation.title}</p>
                <p className="mt-2 text-xs leading-[1.8] text-[color:var(--copy)]">{recommendation.detail}</p>
              </div>
            ) : (
              <p className="text-sm leading-[1.8] text-[color:var(--muted)]">
                Select a module to activate the recommendation engine.
              </p>
            )}
          </section>
        </aside>

        {/* ── CONTENT AREA ── */}
        <section className="grid gap-6">
          {module ? (
            <>
              {/* Module header */}
              <section
                className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6"
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: MODULE_COLORS[(module.order - 1) % MODULE_COLORS.length],
                }}
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{MODULE_EMOJIS[(module.order - 1) % MODULE_EMOJIS.length]}</span>
                      <span className="progress-pill progress-pill-ready text-[0.65rem]">
                        Module {module.order}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl font-700 text-[color:var(--ink)] leading-snug">
                      {module.title}
                    </h2>
                    <p className="mt-2.5 max-w-3xl text-sm leading-[1.85] text-[color:var(--copy)]">
                      {module.description}
                    </p>
                  </div>
                  <div className="rounded-[1.1rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] px-4 py-3 text-xs text-[color:var(--muted)] grid gap-1.5">
                    <span><span className="font-bold text-[color:var(--ink)]">CLEP buckets:</span> {module.officialBuckets.join(", ")}</span>
                    <span><span className="font-bold text-[color:var(--ink)]">Focus:</span> {module.focus}</span>
                  </div>
                </div>
              </section>

              {/* Shell state */}
              {module.state === "shell" ? (
                <section className="rounded-[1.75rem] p-[1px] shimmer-border">
                  <div className="rounded-[1.7rem] bg-[color:var(--surface)] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🔒</span>
                      <div>
                        <h3 className="font-display text-2xl font-700 text-[color:var(--ink)]">
                          Coming Soon
                        </h3>
                        <span className="progress-pill progress-pill-locked text-[0.6rem] mt-1">
                          Shell — awaiting normalization
                        </span>
                      </div>
                    </div>
                    <p className="max-w-2xl text-sm leading-[1.85] text-[color:var(--copy)]">
                      This module is structured and ready. Once its objectives are approved, the full
                      learn → flashcards → checkpoint → quiz → test loop will appear here automatically.
                    </p>
                    {module.shellSections && module.shellSections.length > 0 && (
                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {module.shellSections.map((s) => (
                          <article
                            key={s.title}
                            className="rounded-[1.2rem] bg-[color:var(--surface-2)] border border-[color:var(--line)] p-4"
                          >
                            <p className="font-semibold text-sm text-[color:var(--ink)]">{s.title}</p>
                            <p className="mt-1.5 text-xs leading-[1.75] text-[color:var(--copy)]">{s.description}</p>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <>
                  {/* Objective cards */}
                  <section className="grid gap-6">
                    {module.objectives.map((objective) => (
                      <ObjectiveCard
                        key={objective.id}
                        objective={objective}
                        module={module}
                        progress={progress}
                        onMarkLearned={async (id) => setProgress(await markObjectiveLearned(id))}
                        onMarkCards={async (id) => setProgress(await markFlashcardsReviewed(id))}
                        onAskCoach={(question, objectiveId) => {
                          setCoachQuestion(question);
                          void (async () => {
                            const res = await fetch("/api/coach", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ moduleId: module.id, objectiveId, question }),
                            });
                            const payload = (await res.json()) as { reply: string };
                            setCoachMessages((cur) => [
                              ...cur,
                              { role: "user", content: question },
                              { role: "assistant", content: payload.reply },
                            ]);
                          })();
                        }}
                      />
                    ))}
                  </section>

                  {/* Module assessments */}
                  {selectedAssessment && (
                    <section className="grid gap-4">
                      <div className="flex flex-wrap gap-2.5">
                        {moduleAssessments.map((a) => {
                          const unlocked = isModuleAssessmentUnlocked(a, module, progress);
                          return (
                            <button
                              key={a.id}
                              className={[
                                "rounded-full px-4 py-2 text-sm font-bold transition",
                                selectedAssessmentId === a.id
                                  ? "bg-[color:var(--accent-3)] text-white shadow-[0_4px_14px_rgba(245,158,11,0.4)]"
                                  : "bg-[color:var(--surface-2)] text-[color:var(--copy)] border border-[color:var(--line)] hover:border-[color:var(--line-strong)]",
                                unlocked ? "" : "opacity-50",
                              ].join(" ")}
                              onClick={() => setSelectedAssessmentId(a.id)}
                            >
                              {unlocked ? "" : "🔒 "}{a.title}
                            </button>
                          );
                        })}
                      </div>
                      {isModuleAssessmentUnlocked(selectedAssessment, module, progress) ? (
                        <AssessmentRunner
                          key={selectedAssessment.id}
                          assessment={selectedAssessment}
                          onSubmit={async (a, ans) => {
                            const result = await recordAssessmentResult(module, a, ans);
                            setProgress(result.state);
                            return { score: result.score, total: result.total, correct: result.correct };
                          }}
                        />
                      ) : (
                        <div className="rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-sm leading-[1.8] text-[color:var(--copy)]">
                          <span className="text-2xl mr-3">🔒</span>
                          {selectedAssessment.mode === "module_quiz"
                            ? "Pass every section checkpoint at 70%+ to unlock the module quiz."
                            : "Score 75%+ on the module quiz to unlock the module test."}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Cumulative milestones */}
                  {cumulativeAssessments.length > 0 && progress && (
                    <section className="grid gap-4">
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[color:var(--muted)]">
                          🏆 Cumulative Milestones
                        </p>
                        <h3 className="mt-1.5 font-display text-2xl font-700 text-[color:var(--ink)]">
                          Midpoint &amp; Final Readiness
                        </h3>
                        <p className="mt-1.5 max-w-2xl text-sm leading-[1.8] text-[color:var(--copy)]">
                          These unlock from passed modules and draw from every objective you&apos;ve studied.
                        </p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {cumulativeAssessments.map((a) => {
                          const unlocked = isAssessmentUnlocked(a, progress);
                          const result = progress.assessmentProgress[a.id];
                          return (
                            <button
                              key={a.id}
                              className={[
                                "rounded-[1.5rem] border px-5 py-5 text-left transition-all",
                                selectedCumulativeId === a.id
                                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                                  : "border-[color:var(--line)] bg-[color:var(--surface-2)] hover:border-[color:var(--line-strong)]",
                                unlocked ? "" : "opacity-60",
                              ].join(" ")}
                              onClick={() => setSelectedCumulativeId(a.id)}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <p className="font-bold text-sm text-[color:var(--ink)]">{a.title}</p>
                                <span className={`progress-pill text-[0.6rem] ${unlocked ? "progress-pill-ready" : "progress-pill-locked"}`}>
                                  {unlocked ? "ready" : "🔒 locked"}
                                </span>
                              </div>
                              <p className="mt-2 text-xs leading-[1.75] text-[color:var(--copy)]">{a.description}</p>
                              <div className="mt-3 flex flex-wrap gap-2 text-[0.65rem] text-[color:var(--muted)]">
                                <span className="progress-pill progress-pill-locked">{a.questions.length} questions</span>
                                {a.timeLimitMinutes && (
                                  <span className="progress-pill progress-pill-locked">⏱ {a.timeLimitMinutes} min</span>
                                )}
                              </div>
                              <p className="mt-2 text-xs text-[color:var(--copy)]">
                                {unlocked
                                  ? `Pass at ${a.passingScore}%`
                                  : a.unlockRule?.label}
                              </p>
                              {result && (
                                <p className="mt-2 text-xs font-bold" style={{ color: (result.score ?? 0) >= a.passingScore ? "#34d399" : "#fb7185" }}>
                                  Latest: {result.score ?? 0}%
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {selectedCumulativeAssessment &&
                        isAssessmentUnlocked(selectedCumulativeAssessment, progress) ? (
                        <AssessmentRunner
                          key={selectedCumulativeAssessment.id}
                          assessment={selectedCumulativeAssessment}
                          onSubmit={async (a, ans) => {
                            const result = await recordAssessmentResult(module, a, ans);
                            setProgress(result.state);
                            return { score: result.score, total: result.total, correct: result.correct };
                          }}
                        />
                      ) : selectedCumulativeAssessment ? (
                        <div className="rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-sm leading-[1.8] text-[color:var(--copy)]">
                          <span className="text-2xl mr-3">🔒</span>
                          {selectedCumulativeAssessment.unlockRule?.label ?? "This milestone is still locked."}
                        </div>
                      ) : null}
                    </section>
                  )}

                  {/* AI Coach */}
                  <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-6">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[color:var(--accent)]">
                      ✨ AI Coach
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-700 text-[color:var(--ink)]">
                      Ask from published context only
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-[1.85] text-[color:var(--copy)]">
                      Constrained to the objectives already in this module — for clarifying concepts, comparing ideas, or translating a weak area into simpler language.
                    </p>

                    {/* Input row */}
                    <div className="mt-5 flex gap-3">
                      <input
                        className="min-w-0 flex-1 rounded-[1rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted)]"
                        placeholder="Ask about this module or a specific objective…"
                        value={coachQuestion}
                        onChange={(e) => setCoachQuestion(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key !== "Enter" || !coachQuestion) return;
                          const q = coachQuestion;
                          setCoachQuestion("");
                          const res = await fetch("/api/coach", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ moduleId: module.id, objectiveId: selectedObjective?.id, question: q }),
                          });
                          const payload = (await res.json()) as { reply: string };
                          setCoachMessages((cur) => [
                            ...cur,
                            { role: "user", content: q },
                            { role: "assistant", content: payload.reply },
                          ]);
                        }}
                      />
                      <button
                        className="button-primary px-5"
                        onClick={async () => {
                          if (!coachQuestion) return;
                          const q = coachQuestion;
                          setCoachQuestion("");
                          const res = await fetch("/api/coach", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ moduleId: module.id, objectiveId: selectedObjective?.id, question: q }),
                          });
                          const payload = (await res.json()) as { reply: string };
                          setCoachMessages((cur) => [
                            ...cur,
                            { role: "user", content: q },
                            { role: "assistant", content: payload.reply },
                          ]);
                        }}
                      >
                        →
                      </button>
                    </div>

                    {/* Chat messages */}
                    <div className="mt-5 grid gap-3">
                      {coachMessages.length ? (
                        coachMessages.map((msg, idx) => (
                          <article
                            key={`${msg.role}-${idx}`}
                            className={[
                              "rounded-[1.2rem] px-4 py-4 text-sm leading-[1.85]",
                              msg.role === "assistant"
                                ? "bg-[color:var(--surface-2)] border border-[color:var(--line)] text-[color:var(--copy)] ml-0 mr-8"
                                : "bg-[color:var(--accent-soft)] border border-[rgba(124,58,237,0.28)] text-[color:var(--ink)] ml-8 mr-0",
                            ].join(" ")}
                          >
                            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)] mb-2">
                              {msg.role === "assistant" ? "✨ Coach" : "You"}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </article>
                        ))
                      ) : (
                        <p className="text-sm leading-[1.8] text-[color:var(--muted)]">
                          Ask anything — the coach stays focused on what you&apos;ve studied in this module.
                        </p>
                      )}
                    </div>
                  </section>
                </>
              )}
            </>
          ) : (
            <section className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-8 flex items-center gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-[color:var(--accent)] border-t-transparent animate-spin" />
              <p className="text-sm text-[color:var(--copy)]">Loading module…</p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
