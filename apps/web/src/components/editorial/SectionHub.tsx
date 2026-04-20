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
            Finish the previous section hard test to unlock this section.
          </p>
        </Card>
      </div>
    );
  }

  const ratio = getSectionProgressRatio(section, sectionProgress);

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
            <span>Progress through section materials</span>
            <span>{Math.round(ratio * 100)}%</span>
          </div>
          <ProgressBar value={ratio} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={buildMaterialHref(chapterId, section.id, "learn-1")} className="button-primary inline-flex">
            Begin Learn 1
          </a>
          <a href={buildMaterialHref(chapterId, section.id, "flashcards")} className="button-secondary inline-flex">
            Open Flashcards
          </a>
          <a href={buildMaterialHref(chapterId, section.id, "quiz")} className="button-secondary inline-flex">
            Open Quiz
          </a>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Objectives
        </div>
        <div className="flex flex-wrap gap-3">
          {section.objectives.map((objective) => (
            <span
              key={objective.id}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]"
            >
              {objective.label}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Materials
        </div>
        <p className="mb-5 text-[16px] leading-7 text-[var(--text-secondary)]">
          Use the section like a course module: move from the learn pages into flashcards, videos, quiz,
          results, and then the hard test. Once a section is open, everything except the hard test stays
          freely accessible.
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
