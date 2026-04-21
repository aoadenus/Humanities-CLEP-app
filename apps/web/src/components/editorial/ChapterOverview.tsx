"use client";

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
      <div className="space-y-4">
        <div>
          <a href="/" className="button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
            Back to Dashboard
          </a>
        </div>
        <Card className="p-8">
          <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Locked Chapter
          </div>
          <h1 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">{chapter.title}</h1>
          <p className="mt-4 max-w-2xl text-[18px] leading-8 text-[var(--text-secondary)]">
            This chapter is still in placeholder mode and does not have live section content yet.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <a href="/" className="button-secondary inline-flex items-center gap-2 px-4 py-2 text-sm">
          Back to Dashboard
        </a>
      </div>

      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {chapter.emoji} Chapter Overview
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{chapter.title}</h1>
        <p className="mt-4 max-w-3xl text-[18px] leading-8 text-[var(--text-secondary)]">
          Pick any section and continue into the section hub. Once a chapter is live, all of its sections are open and
          only the hard test stays gated inside each section.
        </p>
        {chapter.notebookLmUrl ? (
          <div className="notebook-prompt mt-5">
            <div className="notebook-prompt-label">📓 Chapter NotebookLM — AI Study Partner</div>
            <p className="text-sm leading-6 text-[#2B3D6B]">
              Each chapter has a dedicated NotebookLM — an AI assistant trained on the same source material in this course. Use it to go deeper on anything that isn't clicking.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#2B3D6B]">
              <strong>Suggested prompts to try:</strong>
            </p>
            <ul className="mt-1 space-y-1 pl-4 text-sm text-[#2B3D6B]">
              <li>• <em>"Explain [term] like I've never studied humanities before"</em></li>
              <li>• <em>"Give me a CLEP-style multiple choice question about [topic]"</em></li>
              <li>• <em>"What are the three most important things to remember about [concept]?"</em></li>
              <li>• <em>"How does [artwork/event] connect to [other topic]?"</em></li>
            </ul>
            <p className="mt-2 text-xs text-[#4A6FAA]">
              💡 Tip: Inside NotebookLM, enable <strong>Web Search</strong> to pull in additional sources beyond the chapter material.
            </p>
            <a
              className="notebook-prompt-link"
              href={chapter.notebookLmUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open {chapter.title} NotebookLM →
            </a>
          </div>
        ) : null}
      </Card>

      <div className="space-y-4">
        {chapter.sections.map((section, index) => {
          const sectionProgress = chapterProgress?.sections[section.id] ?? null;
          const unlocked = sectionProgress?.unlocked ?? !chapter.locked;
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
          const sectionHref = buildSectionHref(chapter.id, section.id);

          return (
            <Card
              key={section.id}
              className={`p-5 md:p-6 ${unlocked ? "transition-transform hover:-translate-y-1" : "opacity-70"}`}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    Section {index + 1}
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="text-3xl">{section.emoji}</span>
                    <div className="min-w-0">
                      <h2 className="font-reading text-2xl font-bold text-[var(--text-primary)]">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-[17px] leading-7 text-[var(--text-secondary)]">
                        {section.purpose}
                      </p>
                    </div>
                  </div>
                </div>

                <StatusBadge label={statusLabel} tone={statusTone} />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--text-secondary)]">
                  <span>Section progress</span>
                  <span>{unlocked ? `${Math.round(ratio * 100)}%` : "Locked"}</span>
                </div>
                <ProgressBar value={unlocked ? ratio : 0} />
              </div>

              {unlocked ? (
                <div className="mt-5">
                  <a href={sectionHref} className="button-primary inline-flex items-center gap-2 px-5 py-2 text-sm">
                    {sectionProgress?.completed ? "Review Section" : ratio > 0 ? "Continue to Section" : "Enter Section"}
                  </a>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
