"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { useEditorialProgress } from "@/components/editorial/editorial-progress-provider";
import { buildMaterialHref } from "@/lib/editorial-navigation";
import type { EditorialMaterialId, EditorialSection } from "@/lib/types";

export function ResultsPage({
  chapterId,
  section,
}: {
  chapterId: string;
  section: EditorialSection;
}) {
  const router = useRouter();
  const { progress, clearAssessment } = useEditorialProgress();
  const sectionProgress = progress?.chapters[chapterId]?.sections[section.id] ?? null;

  if (!sectionProgress?.quizSubmitted || sectionProgress.quizScore === null) {
    return (
      <Card className="p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">📊 Results</div>
        <h1 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">Take the quiz first</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          Results appear after the section quiz has been submitted.
        </p>
        <Link href={buildMaterialHref(chapterId, section.id, "quiz")} className="button-primary mt-5 inline-flex">
          Go to Quiz →
        </Link>
      </Card>
    );
  }

  const score = sectionProgress.quizScore;
  const ratio = score / section.quiz.questions.length;
  const missedQuestions = section.quiz.questions.filter(
    (question) => sectionProgress.quizAnswers[question.id] !== question.correct,
  );
  const reviewMaterialIds = [...new Set(missedQuestions.flatMap((question) => question.reviewMaterialIds))]
    .filter((materialId) => section.materials.some((material) => material.id === materialId));
  const firstLearnId = section.learnPages[0]?.id ?? null;

  const scoreBand = score >= section.quiz.passThreshold ? "mastered" : score >= 5 ? "almost" : "rebuild";

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">📊 Results</div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">Section feedback</h1>
        <div className="mt-5 text-3xl font-bold text-[var(--text-primary)]">
          You scored {score}/{section.quiz.questions.length}
        </div>
        <div className="mt-4">
          <ProgressBar value={ratio} />
        </div>
        <p className="mt-5 text-[18px] leading-8 text-[var(--text-secondary)]">
          {scoreBand === "mastered"
            ? "You cleared the quiz threshold. The hard test is ready whenever you want it."
            : scoreBand === "almost"
              ? "Almost there. Use the targeted review links below, then retry the quiz."
              : "The core ideas need another pass. Revisit the learn material before trying the quiz again."}
        </p>
      </Card>

      <Card className="p-6">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">🎯 Next Move</div>
        <h2 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">Take the hard test</h2>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          The hard test is the final challenge for this section. It unlocks as soon as the quiz has been submitted.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={buildMaterialHref(chapterId, section.id, "hard-test")} className="button-primary inline-flex">
            Take the Hard Test →
          </Link>
        </div>
      </Card>

      {scoreBand === "almost" ? (
        <Card className="p-6">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">📚 Review Routing</div>
          <h2 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">Target the weak spots</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {reviewMaterialIds.map((materialId) => (
              <Link
                href={buildMaterialHref(chapterId, section.id, materialId as EditorialMaterialId)}
                key={materialId}
                className="button-secondary inline-flex"
              >
                Go back to {materialId.replace("-", " ")}
              </Link>
            ))}
            <button
              className="button-primary"
              onClick={() => {
                clearAssessment(chapterId, section.id, "quiz");
                router.push(buildMaterialHref(chapterId, section.id, "quiz"));
              }}
              type="button"
            >
              Retry Quiz
            </button>
          </div>
        </Card>
      ) : null}

      {scoreBand === "rebuild" ? (
        <Card className="p-6">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">💪 Rebuild</div>
          <h2 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">Restart the learning path</h2>
          <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
            This score says the base concepts need another pass. Re-read the learn material in order and then retry the
            quiz.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={buildMaterialHref(chapterId, section.id, firstLearnId ?? "flashcards")}
              className="button-primary inline-flex"
            >
              {firstLearnId ? `Start ${section.learnPages[0]?.title ?? "Learn"} →` : "Open Flashcards →"}
            </Link>
            <button
              className="button-secondary"
              onClick={() => {
                clearAssessment(chapterId, section.id, "quiz");
                router.push(buildMaterialHref(chapterId, section.id, "quiz"));
              }}
              type="button"
            >
              Reset Quiz
            </button>
          </div>
        </Card>
      ) : null}

      <Card className="p-6">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">🧠 Cheat Sheet</div>
        <div className="mt-3 text-2xl font-bold text-[var(--text-primary)]">{section.cheatSheet.summaryLine}</div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Top reminders</div>
            <ul className="mt-3 space-y-2 pl-5 text-[16px] leading-7 text-[var(--text-primary)]">
              {section.cheatSheet.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Mnemonic recap</div>
            <ul className="mt-3 space-y-2 pl-5 text-[16px] leading-7 text-[var(--text-primary)]">
              {section.cheatSheet.mnemonics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
