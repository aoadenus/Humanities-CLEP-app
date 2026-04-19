"use client";

import Link from "next/link";

import { Card } from "@/components/editorial/Card";
import { useEditorialProgress } from "@/components/editorial/editorial-progress-provider";
import { buildMaterialHref } from "@/lib/editorial-navigation";
import type { EditorialQuestion, EditorialSection } from "@/lib/types";

function getSelectedAnswer(
  answers: Record<number, number>,
  question: EditorialQuestion,
) {
  return answers[question.id];
}

export function AssessmentPage({
  chapterId,
  section,
  mode,
  title,
}: {
  chapterId: string;
  section: EditorialSection;
  mode: "quiz" | "hard-test";
  title: string;
}) {
  const {
    progress,
    answerQuestion,
    clearAssessment,
    finalizeAssessment,
  } = useEditorialProgress();
  const sectionProgress = progress?.chapters[chapterId]?.sections[section.id] ?? null;
  const assessment = mode === "quiz" ? section.quiz : section.hardTest;
  const answers = mode === "quiz" ? sectionProgress?.quizAnswers ?? {} : sectionProgress?.hardTestAnswers ?? {};
  const submitted = mode === "quiz" ? sectionProgress?.quizSubmitted ?? false : sectionProgress?.hardTestSubmitted ?? false;
  const score = mode === "quiz" ? sectionProgress?.quizScore ?? null : sectionProgress?.hardTestScore ?? null;

  const submit = () => {
    const total = assessment.questions.reduce((count, question) => {
      return count + (getSelectedAnswer(answers, question) === question.correct ? 1 : 0);
    }, 0);

    finalizeAssessment(chapterId, section.id, total, mode);
  };

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {mode === "quiz" ? "📝 Section Quiz" : "🏆 Hard Test"}
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          Choose one answer for each question. When you submit, the whole page is graded at once and the
          explanations appear under each question.
        </p>
        {submitted && score !== null ? (
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4">
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Score</div>
            <div className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
              You scored {score}/{assessment.questions.length} {score >= assessment.passThreshold ? "🎉" : "📚"}
            </div>
          </div>
        ) : null}
      </Card>

      <div className="space-y-5">
        {assessment.questions.map((question, questionIndex) => {
          const selected = getSelectedAnswer(answers, question);

          return (
            <Card key={question.id} className="p-5 md:p-6">
              <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Question {questionIndex + 1}
              </div>
              <h2 className="mt-3 text-[22px] font-bold leading-9 text-[var(--text-primary)]">{question.text}</h2>

              <div className="mt-5 space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const isCorrect = submitted && optionIndex === question.correct;
                  const isWrong = submitted && isSelected && optionIndex !== question.correct;
                  const className = [
                    "quiz-option step-transition",
                    isSelected && !submitted ? "is-selected" : "",
                    isCorrect ? "is-correct" : "",
                    isWrong ? "is-wrong" : "",
                  ]
                    .join(" ")
                    .trim();

                  return (
                    <button
                      key={`${question.id}-${optionIndex}`}
                      className={className}
                      disabled={submitted}
                      onClick={() => answerQuestion(chapterId, section.id, question.id, optionIndex, mode)}
                      style={{ animationDelay: `${optionIndex * 50}ms` }}
                      type="button"
                    >
                      <span className="mr-3 font-bold text-[var(--text-secondary)]">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      <span className="text-[17px] leading-7 text-[var(--text-primary)]">{option}</span>
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <div className="mt-4 rounded-xl bg-[var(--bg-secondary)] px-4 py-4 text-[16px] leading-7 text-[var(--text-secondary)]">
                  <div className="font-bold text-[var(--text-primary)]">Explanation</div>
                  <div className="mt-2">{question.explanation}</div>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-[16px] leading-7 text-[var(--text-secondary)]">
            {submitted
              ? "Reset to try this assessment again."
              : "Submit when you want the whole set graded."}
          </div>

          <div className="flex flex-wrap gap-3">
            {submitted ? (
              <button
                className="button-secondary"
                onClick={() => clearAssessment(chapterId, section.id, mode)}
                type="button"
              >
                Retry {mode === "quiz" ? "Quiz" : "Hard Test"}
              </button>
            ) : (
              <button className="button-primary" onClick={submit} type="button">
                Submit Answers
              </button>
            )}

            {submitted && mode === "quiz" ? (
              <Link
                href={buildMaterialHref(chapterId, section.id, "results")}
                className="button-primary inline-flex items-center"
              >
                View Results →
              </Link>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
