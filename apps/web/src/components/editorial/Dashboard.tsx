"use client";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { StatusBadge } from "@/components/editorial/StatusBadge";
import { useEditorialProgress } from "@/components/editorial/editorial-progress-provider";
import { buildChapterHref, getChapterProgressRatio } from "@/lib/editorial-navigation";
import type { EditorialCourse } from "@/lib/types";

const chapterNotes: Record<string, string> = {
  ch1: "Full Chapter 1 flow: six sections, learn pages, flashcards, videos, quiz, results, and hard test.",
  ch2: "Locked placeholder for the next chapter release.",
  ch3: "Locked placeholder for the next chapter release.",
  ch4: "Locked placeholder for the next chapter release.",
  ch5: "Locked placeholder for the next chapter release.",
  ch6: "Locked placeholder for the next chapter release.",
};

export function Dashboard({ course }: { course: EditorialCourse }) {
  const { progress, ready } = useEditorialProgress();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="surface-tint overflow-hidden p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
            <div>
              <div className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Study Dashboard
              </div>
              <h1 className="font-reading text-4xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">
                CLEP Humanities
              </h1>
              <p className="mt-4 max-w-3xl text-[18px] leading-8 text-[var(--text-secondary)]">
                Start at Chapter 1, open a section, and move through the materials in order.
              </p>
            </div>

            <div className="space-y-3">
              {ready && progress?.currentRoute && progress.currentRoute !== "/" ? (
                <a href={progress.currentRoute} className="button-primary inline-flex w-full justify-center">
                  Resume where you left off
                </a>
              ) : null}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                  <div className="text-sm font-bold text-[var(--text-primary)]">Chapter 1 active</div>
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  Chapters 2-6 are visible but locked. Complete each section hard test to progress.
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {course.chapters.map((chapter, index) => {
            const unlocked = progress?.chapters[chapter.id]?.unlocked ?? !chapter.locked;
            const ratio = getChapterProgressRatio(chapter, progress);
            const tone = !unlocked ? "locked" : ratio >= 1 ? "complete" : ratio > 0 ? "progress" : "info";
            const statusLabel = !unlocked
              ? "Coming soon"
              : ratio >= 1
                ? "Complete"
                : ratio > 0
                  ? "In progress"
                  : "Start";

            const cardBody = (
              <Card
                className={`h-full overflow-hidden p-0 ${unlocked ? "transition-transform hover:-translate-y-1" : "opacity-70"}`}
                style={{
                  borderTop: `6px solid ${chapter.color}`,
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Chapter {index + 1}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-3xl">{chapter.emoji}</span>
                        <div>
                          <h2 className="font-reading text-2xl font-bold text-[var(--text-primary)]">
                            {chapter.title}
                          </h2>
                          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                            {chapterNotes[chapter.id] ?? "Study chapter"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <StatusBadge label={statusLabel} tone={tone} />
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-[var(--text-secondary)]">
                      <span>Progress</span>
                      <span>{unlocked ? `${Math.round(ratio * 100)}%` : "Locked"}</span>
                    </div>
                    <ProgressBar value={unlocked ? ratio : 0} />
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
                      style={{ background: chapter.color }}
                    >
                      {unlocked ? "Open Chapter" : "Coming Soon"}
                    </div>
                  </div>
                </div>
              </Card>
            );

            return unlocked ? (
              <a href={buildChapterHref(chapter.id)} key={chapter.id}>
                {cardBody}
              </a>
            ) : (
              <div key={chapter.id}>{cardBody}</div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
