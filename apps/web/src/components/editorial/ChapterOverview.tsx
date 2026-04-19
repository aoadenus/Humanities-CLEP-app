"use client";

import Link from "next/link";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { StatusBadge } from "@/components/editorial/StatusBadge";
import { buildSectionHref, getSectionProgressRatio } from "@/lib/editorial-navigation";
import type { EditorialChapter, EditorialProgress } from "@/lib/types";

export function ChapterOverview({
  chapter,
  progress,
}: {
  chapter: EditorialChapter;
  progress: EditorialProgress | null;
}) {
  const chapterProgress = progress?.chapters[chapter.id] ?? null;

  if (chapter.locked && !chapterProgress?.unlocked) {
    return (
      <Card className="p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          🔒 Locked Chapter
        </div>
        <h1 className="font-reading mt-3 text-3xl font-bold text-(--text-primary)">{chapter.title}</h1>
        <p className="mt-4 max-w-2xl text-[18px] leading-8 text-(--text-secondary)">
          This chapter is still a placeholder. Chapter 1 is the active build right now.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          {chapter.emoji} Chapter Overview
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-(--text-primary)">{chapter.title}</h1>
        <p className="mt-4 max-w-3xl text-[18px] leading-8 text-(--text-secondary)">
          Work through the six sections below as a sequential textbook track. Each section unlocks after the
          previous section hard test is passed, and each unlocked section contains complete instructional
          materials, references, and assessment sets designed for full-depth study.
        </p>
      </Card>

      <div className="space-y-4">
        {chapter.sections.map((section, index) => {
          const sectionProgress = chapterProgress?.sections[section.id] ?? null;
          const unlocked = sectionProgress?.unlocked ?? index === 0;
          const ratio = getSectionProgressRatio(section, sectionProgress);
          const statusTone = !unlocked
            ? "locked"
            : sectionProgress?.completed
              ? "complete"
              : ratio > 0
                ? "progress"
                : "info";
          const statusLabel = !unlocked
            ? "Locked"
            : sectionProgress?.completed
              ? "Complete"
              : ratio > 0
                ? "In progress"
                : "Not started";

          const cardBody = (
            <Card className={`p-5 md:p-6 ${unlocked ? "transition-transform hover:-translate-y-1" : "opacity-70"}`}>
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
                    Section {index + 1}
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="text-3xl">{section.emoji}</span>
                    <div className="min-w-0">
                      <h2 className="font-reading text-2xl font-bold text-(--text-primary)">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-[17px] leading-7 text-(--text-secondary)">
                        {section.purpose}
                      </p>
                    </div>
                  </div>
                </div>

                <StatusBadge label={statusLabel} tone={statusTone} />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-(--text-secondary)">
                  <span>Section progress</span>
                  <span>{unlocked ? `${Math.round(ratio * 100)}%` : "Locked"}</span>
                </div>
                <ProgressBar value={unlocked ? ratio : 0} />
              </div>
            </Card>
          );

          return unlocked ? (
            <Link href={buildSectionHref(chapter.id, section.id)} key={section.id}>
              {cardBody}
            </Link>
          ) : (
            <div key={section.id}>{cardBody}</div>
          );
        })}
      </div>
    </div>
  );
}
