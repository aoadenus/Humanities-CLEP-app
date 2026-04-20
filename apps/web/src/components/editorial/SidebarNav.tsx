"use client";

import { Card } from "@/components/editorial/Card";
import { StatusBadge } from "@/components/editorial/StatusBadge";
import { getMaterialStatus } from "@/components/editorial/editorial-progress-provider";
import {
  buildChapterHref,
  buildMaterialHref,
  buildSectionHref,
  getChapterProgressRatio,
  getSectionProgressRatio,
} from "@/lib/editorial-navigation";
import type {
  EditorialCourse,
  EditorialMaterialId,
  EditorialProgress,
} from "@/lib/types";

function NavItem({
  href,
  active,
  locked,
  icon,
  label,
  secondary,
  onClick,
}: {
  href?: string;
  active?: boolean;
  locked?: boolean;
  icon: string;
  label: string;
  secondary?: string;
  onClick?: () => void;
}) {
  const className = [
    "flex items-center justify-between rounded-xl border px-3 py-3 transition-all",
    active
      ? "border-[var(--accent)] bg-[var(--bg-secondary)] shadow-sm"
      : "border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--bg-card)]",
    locked ? "cursor-not-allowed opacity-55" : "",
  ]
    .join(" ")
    .trim();

  const body = (
    <div className={className}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
          <span>{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        {secondary ? <div className="mt-1 text-xs text-[var(--text-secondary)]">{secondary}</div> : null}
      </div>
      <span className="ml-3 shrink-0 text-xs font-semibold">
        {locked ? (
          <span className="text-[var(--text-muted)]">🔒</span>
        ) : active ? (
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" aria-label="current" />
        ) : null}
      </span>
    </div>
  );

  if (!href || locked) {
    return body;
  }

  return (
    <a href={href} onClick={onClick}>
      {body}
    </a>
  );
}

export function SidebarNav({
  course,
  progress,
  chapterId,
  sectionId,
  materialId,
  currentPath,
  mobileOpen,
  onClose,
}: {
  course: EditorialCourse;
  progress: EditorialProgress | null;
  chapterId?: string;
  sectionId?: string;
  materialId?: EditorialMaterialId;
  currentPath: string;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const currentChapter = chapterId
    ? course.chapters.find((chapter) => chapter.id === chapterId) ?? null
    : null;
  const currentSection = sectionId
    ? currentChapter?.sections.find((section) => section.id === sectionId) ?? null
    : null;
  const currentSectionProgress =
    chapterId && sectionId && progress
      ? progress.chapters[chapterId]?.sections[sectionId] ?? null
      : null;

  const aside = (
    <aside className="sidebar-scroll flex h-full flex-col gap-5 overflow-y-auto bg-[var(--bg-secondary)] p-4">
      <div className="flex items-center justify-between md:hidden">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Menu</div>
        <button className="button-ghost px-3 py-2 text-sm" onClick={onClose} type="button">
          Close
        </button>
      </div>

      <div>
        <a
          href="/"
          className={[
            "flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-bold transition-all",
            currentPath === "/"
              ? "border-[var(--accent)] bg-[var(--bg-card)] text-[var(--accent)] shadow-sm"
              : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
          ].join(" ")}
          onClick={onClose}
        >
          <span className="text-base">Home</span>
          <span>Dashboard</span>
        </a>
      </div>

      <Card className="surface-tint p-4">
        <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Course Map
        </div>
        <div className="mt-2 text-xl font-bold text-[var(--text-primary)]">CLEP Humanities</div>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Jump between chapters, sections, and materials without losing your place.
        </p>
      </Card>

      <div>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Chapters
        </div>
        <div className="space-y-2">
          {course.chapters.map((chapter) => {
            const chapterProgress = progress?.chapters[chapter.id] ?? null;
            const unlocked = chapterProgress?.unlocked ?? !chapter.locked;
            const chapterRatio = getChapterProgressRatio(chapter, progress);
            const isActive = currentPath === buildChapterHref(chapter.id) || chapterId === chapter.id;

            return (
              <div key={chapter.id} className="space-y-2">
                <NavItem
                  href={unlocked ? buildChapterHref(chapter.id) : undefined}
                  active={isActive}
                  locked={!unlocked}
                  icon={chapter.emoji}
                  label={chapter.title}
                  secondary={unlocked ? `${Math.round(chapterRatio * 100)}% complete` : "Coming soon"}
                  onClick={onClose}
                />
              </div>
            );
          })}
        </div>
      </div>

      {currentChapter ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Sections
            </div>
            <StatusBadge
              label={`${Math.round(getChapterProgressRatio(currentChapter, progress) * 100)}%`}
              tone="info"
            />
          </div>
          <div className="space-y-2">
            {currentChapter.sections.map((section, index) => {
              const sectionProgress = progress?.chapters[currentChapter.id]?.sections[section.id] ?? null;
              const unlocked = sectionProgress?.unlocked ?? index === 0;
              const ratio = getSectionProgressRatio(section, sectionProgress);

              return (
                <NavItem
                  key={section.id}
                  href={unlocked ? buildSectionHref(currentChapter.id, section.id) : undefined}
                  active={sectionId === section.id}
                  locked={!unlocked}
                  icon={section.emoji}
                  label={`Section ${index + 1}: ${section.title}`}
                  secondary={
                    unlocked
                      ? sectionProgress?.completed
                        ? "✓ Completed"
                        : `${Math.round(ratio * 100)}% explored`
                      : "Complete previous hard test"
                  }
                  onClick={onClose}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {currentChapter && currentSection ? (
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Materials
          </div>
          <div className="space-y-2">
            {currentSection.materials.map((material) => {
              const status = getMaterialStatus(currentSectionProgress, material.id);
              const locked = status === "locked";
              const active =
                material.id === "hub"
                  ? currentPath === buildSectionHref(currentChapter.id, currentSection.id)
                  : materialId === material.id;

              return (
                <NavItem
                  key={material.id}
                  href={locked ? undefined : buildMaterialHref(currentChapter.id, currentSection.id, material.id)}
                  active={active}
                  locked={locked}
                  icon={material.emoji}
                  label={material.title}
                  secondary={
                    status === "complete"
                      ? "✓ Done"
                      : status === "in_progress"
                        ? "In progress"
                        : status === "locked"
                          ? "Finish quiz to unlock"
                          : undefined
                  }
                  onClick={onClose}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {currentSection ? (
        <Card className="mt-auto p-4">
          <div className="text-sm font-bold text-[var(--text-primary)]">Recommended order</div>
          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
            Learn 1–4 → Flashcards → Videos → Quiz → Hard Test
          </p>
        </Card>
      ) : null}
    </aside>
  );

  return (
    <>
      <div className="hidden h-screen border-r border-[var(--border)] md:block">{aside}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-[rgba(44,36,32,0.35)]"
            onClick={onClose}
            type="button"
          />
          <div className="absolute inset-y-0 left-0 w-[88vw] max-w-[320px] border-r border-[var(--border)] shadow-xl">
            {aside}
          </div>
        </div>
      ) : null}
    </>
  );
}
