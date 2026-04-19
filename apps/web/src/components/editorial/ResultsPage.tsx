"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { useEditorialProgress } from "@/components/editorial/editorial-progress-provider";
import {
  buildMaterialHref,
  buildSectionHref,
} from "@/lib/editorial-navigation";
import type { EditorialChapter, EditorialMaterialId, EditorialSection } from "@/lib/types";

export function ResultsPage({
  chapter,
  chapterId,
  section,
}: {
  chapter: EditorialChapter;
  chapterId: string;
  section: EditorialSection;
}) {
  const router = useRouter();
  const { progress, clearAssessment } = useEditorialProgress();
  const sectionProgress = progress?.chapters[chapterId]?.sections[section.id] ?? null;

  if (!sectionProgress?.quizSubmitted || sectionProgress.quizScore === null) {
    return (
      <Card className="p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          📊 Results
        </div>
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
  const reviewMaterialIds = [...new Set(missedQuestions.flatMap((question) => question.reviewMaterialIds))];
  const currentIndex = chapter.sections.findIndex((item) => item.id === section.id);
  const nextSection = chapter.sections[currentIndex + 1] ?? null;

  const scoreBand =
    score >= section.quiz.passThreshold ? "mastered" : score >= 5 ? "almost" : "rebuild";

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
            ? "Section mastered. The hard test is now unlocked and passing it unlocks the next section."
            : scoreBand === "almost"
              ? "Almost there. Use the targeted review links below, then retry the quiz."
              : "Let’s rebuild the foundation. Go back through the learn pages before trying the quiz again."}
        </p>
      </Card>

      {scoreBand === "mastered" ? (
        <Card className="p-6">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            🎉 Next Move
          </div>
          <h2 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">Take the hard test</h2>
          <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
            You passed the section quiz. The next gate is the hard test. Passing that test unlocks the next
            section.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={buildMaterialHref(chapterId, section.id, "hard-test")} className="button-primary inline-flex">
              Take the Hard Test →
            </Link>
            {sectionProgress.completed && nextSection ? (
              <Link href={buildSectionHref(chapterId, nextSection.id)} className="button-secondary inline-flex">
                Continue to Section {currentIndex + 2} →
              </Link>
            ) : null}
          </div>
        </Card>
      ) : null}

      {scoreBand === "almost" ? (
        <Card className="p-6">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            📚 Review Routing
          </div>
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
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            💪 Rebuild
          </div>
          <h2 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">
            Start from Learn 1
          </h2>
          <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
            This score says the base concepts need another pass. Re-read the learn slides in order and then retry
            the quiz.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={buildMaterialHref(chapterId, section.id, "learn-1")} className="button-primary inline-flex">
              Start Learn 1 →
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
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Top reminders
            </div>
            <ul className="mt-3 space-y-2 pl-5 text-[16px] leading-7 text-[var(--text-primary)]">
              {section.cheatSheet.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Mnemonic recap
            </div>
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
