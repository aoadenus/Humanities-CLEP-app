"use client";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { StatusBadge } from "@/components/editorial/StatusBadge";
import { getMaterialStatus } from "@/components/editorial/editorial-progress-provider";
import { buildChapterHref, buildMaterialHref, getSectionProgressRatio } from "@/lib/editorial-navigation";
import type { EditorialSection, EditorialSectionProgress } from "@/lib/types";

export function SectionHub({
  chapterId,
  section,
  sectionProgress,
}: {
  chapterId: string;
  section: EditorialSection;
  sectionProgress: EditorialSectionProgress | null;
}) {
  if (!sectionProgress?.unlocked) {
    return (
      <div className="space-y-4">
        <div>
          <a href={buildChapterHref(chapterId)} className="button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
            Back to Chapter Overview
          </a>
        </div>
        <Card className="p-8">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Section Locked
          </div>
          <h1 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">{section.title}</h1>
          <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
            This section is not available yet.
          </p>
        </Card>
      </div>
    );
  }

  const ratio = getSectionProgressRatio(section, sectionProgress);
  const firstLearnId = section.learnPages[0]?.id ?? null;
  const learnStepLabels = section.learnPages.map((page) => page.title);
  const flowLabels = [
    ...learnStepLabels,
    "Flashcards",
    "Videos",
    "Quiz",
    "Results",
    "Hard Test",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href={buildChapterHref(chapterId)} className="button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
          Back to Chapter Overview
        </a>
      </div>
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {section.emoji} Section Hub
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">{section.purpose}</p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--text-secondary)]">
            <span>Section progress</span>
            <span>{Math.round(ratio * 100)}%</span>
          </div>
          <ProgressBar value={ratio} />
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 text-xs font-semibold text-[var(--text-muted)]">
            {flowLabels.map((step, index) => (
              <span key={step} className="flex items-center gap-1">
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1">
                  {step}
                </span>
                {index < flowLabels.length - 1 && <span className="text-[var(--border)]">→</span>}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Start with the learn material, use flashcards and videos as reinforcement, then submit the quiz to unlock
            the hard test.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={buildMaterialHref(chapterId, section.id, firstLearnId ?? "flashcards")}
            className="button-primary inline-flex"
          >
            {firstLearnId ? `Begin ${section.learnPages[0]?.title ?? "Learn"}` : "Open Flashcards"}
          </a>
          <a href={buildMaterialHref(chapterId, section.id, "flashcards")} className="button-secondary inline-flex">
            Open Flashcards
          </a>
          <a href={buildMaterialHref(chapterId, section.id, "quiz")} className="button-secondary inline-flex">
            Take Quiz
          </a>
        </div>
      </Card>

      {section.objectives.length > 0 && (
        <Card className="p-6">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            What you will learn
          </div>
          <ul className="space-y-2">
            {section.objectives.map((objective) => (
              <li key={objective.id} className="flex items-start gap-2 text-[15px] text-[var(--text-secondary)]">
                <span className="mt-0.5 shrink-0 font-bold text-[var(--accent)]">→</span>
                <span>{objective.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-6">
        <div className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Materials
        </div>
        <p className="mb-5 text-[15px] leading-7 text-[var(--text-secondary)]">
          All section materials are open except the hard test. The hard test unlocks after quiz submission.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {section.materials.map((material) => {
            const status = getMaterialStatus(sectionProgress, material.id);
            const locked = status === "locked";
            const tone = locked
              ? "locked"
              : status === "complete"
                ? "complete"
                : status === "in_progress"
                  ? "progress"
                  : "info";
            const label = locked
              ? "Locked"
              : status === "complete"
                ? "Complete"
                : status === "in_progress"
                  ? "In progress"
                  : "Ready";

            const cardBody = (
              <Card className={`h-full p-5 ${locked ? "opacity-70" : "transition-transform hover:-translate-y-1"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl">{material.emoji}</div>
                    <div className="mt-3 text-xl font-bold text-[var(--text-primary)]">{material.title}</div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)]">
                      {material.id === "hub"
                        ? "Section overview"
                        : material.id.startsWith("learn-")
                          ? "Guided reading"
                          : material.id === "flashcards"
                            ? "One-card study mode"
                            : material.id === "videos"
                              ? "Videos and resources"
                              : material.id === "quiz"
                                ? "Section assessment"
                                : material.id === "results"
                                  ? "Score and review routing"
                                  : "Challenge gate"}
                    </div>
                  </div>
                  <StatusBadge label={label} tone={tone} />
                </div>
              </Card>
            );

            return locked ? (
              <div key={material.id}>{cardBody}</div>
            ) : (
              <a href={buildMaterialHref(chapterId, section.id, material.id)} key={material.id} className="block">
                {cardBody}
              </a>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
