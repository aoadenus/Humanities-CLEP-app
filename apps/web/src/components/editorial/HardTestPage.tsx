"use client";

import Link from "next/link";

import { AssessmentPage } from "@/components/editorial/AssessmentPage";
import { Card } from "@/components/editorial/Card";
import { useEditorialProgress } from "@/components/editorial/editorial-progress-provider";
import { buildSectionHref } from "@/lib/editorial-navigation";
import type { EditorialChapter, EditorialSection } from "@/lib/types";

export function HardTestPage({
  chapter,
  chapterId,
  section,
}: {
  chapter: EditorialChapter;
  chapterId: string;
  section: EditorialSection;
}) {
  const { progress } = useEditorialProgress();
  const sectionProgress = progress?.chapters[chapterId]?.sections[section.id] ?? null;
  const unlocked = Boolean(sectionProgress?.quizSubmitted);
  const currentIndex = chapter.sections.findIndex((item) => item.id === section.id);
  const nextSection = chapter.sections[currentIndex + 1] ?? null;

  if (!unlocked) {
    return (
      <Card className="p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🔒 Hard Test Locked
        </div>
        <h1 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">Submit the quiz first</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          Finish and submit the section quiz to unlock this harder test.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AssessmentPage chapterId={chapterId} section={section} mode="hard-test" title={`${section.title} Hard Test`} />

      {sectionProgress?.hardTestSubmitted ? (
        <Card className="p-6">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {sectionProgress.hardTestScore !== null && sectionProgress.hardTestScore >= section.hardTest.passThreshold
              ? "🎉 Section Complete"
              : "📚 Keep Going"}
          </div>
          <h2 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">
            {sectionProgress.hardTestScore !== null && sectionProgress.hardTestScore >= section.hardTest.passThreshold
              ? "Hard test passed"
              : "Review and try again"}
          </h2>
          <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
            {sectionProgress.hardTestScore !== null && sectionProgress.hardTestScore >= section.hardTest.passThreshold
              ? nextSection
                ? `This section is complete. You can move straight into Section ${currentIndex + 2} or stay here to review.`
                : "This section is complete."
              : "You can reset the hard test above, revisit the learn pages, or reinforce with flashcards."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {sectionProgress.hardTestScore !== null && sectionProgress.hardTestScore >= section.hardTest.passThreshold && nextSection ? (
              <Link href={buildSectionHref(chapterId, nextSection.id)} className="button-primary inline-flex">
                Continue to Section {currentIndex + 2} →
              </Link>
            ) : null}
            <Link href={buildSectionHref(chapterId, section.id)} className="button-secondary inline-flex">
              Back to Section Hub
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
