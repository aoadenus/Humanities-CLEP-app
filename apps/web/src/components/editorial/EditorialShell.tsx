"use client";

import { useEffect, useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/editorial/Breadcrumbs";
import { Card } from "@/components/editorial/Card";
import { ChapterOverview } from "@/components/editorial/ChapterOverview";
import { FlashcardsPage } from "@/components/editorial/FlashcardsPage";
import { HardTestPage } from "@/components/editorial/HardTestPage";
import { LearnPage } from "@/components/editorial/LearnPage";
import { QuizPage } from "@/components/editorial/QuizPage";
import { ResultsPage } from "@/components/editorial/ResultsPage";
import { SectionHub } from "@/components/editorial/SectionHub";
import { SidebarNav } from "@/components/editorial/SidebarNav";
import { StickyNav } from "@/components/editorial/StickyNav";
import { VideosPage } from "@/components/editorial/VideosPage";
import {
  getSectionProgress,
  isHardTestUnlocked,
  useEditorialProgress,
} from "@/components/editorial/editorial-progress-provider";
import {
  buildChapterHref,
  buildMaterialHref,
  buildSectionHref,
  getChapter,
  getMaterialTitle,
  getNextMaterialId,
  getPreviousMaterialId,
  getSection,
} from "@/lib/editorial-navigation";
import type { EditorialCourse, EditorialMaterialId } from "@/lib/types";

export function EditorialShell({
  course,
  pageType,
  chapterId,
  sectionId,
  materialId,
  currentPath,
}: {
  course: EditorialCourse;
  pageType: "chapter" | "section" | "material";
  chapterId: string;
  sectionId?: string;
  materialId?: EditorialMaterialId;
  currentPath: string;
}) {
  const { progress, ready, touchRoute, visitMaterial } = useEditorialProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const chapter = getChapter(course, chapterId);
  const section = sectionId ? getSection(course, chapterId, sectionId) : null;
  const sectionProgress =
    chapterId && sectionId && progress ? getSectionProgress(progress, chapterId, sectionId) : null;

  useEffect(() => {
    if (!ready) {
      return;
    }

    touchRoute(currentPath);
    if (sectionId) {
      visitMaterial(chapterId, sectionId, materialId ?? "hub");
    }
  }, [chapterId, currentPath, materialId, ready, sectionId, touchRoute, visitMaterial]);

  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [{ label: "Dashboard", href: "/" }];

    if (chapter) {
      items.push({ label: chapter.title, href: buildChapterHref(chapter.id) });
    }
    if (section) {
      items.push({ label: section.title, href: buildSectionHref(chapterId, section.id) });
    }
    if (pageType === "material" && section && materialId) {
      items.push({ label: getMaterialTitle(section, materialId) });
    }

    if (pageType === "chapter") {
      items[items.length - 1] = { label: chapter?.title ?? "Chapter" };
    }
    if (pageType === "section" && section) {
      items[items.length - 1] = { label: section.title };
    }

    return items;
  }, [chapter, chapterId, materialId, pageType, section]);

  const stickyNav = useMemo(() => {
    if (!section) {
      return null;
    }

    if (pageType === "section") {
      return {
        prevHref: buildChapterHref(chapterId),
        prevLabel: "Chapter",
        nextHref: sectionProgress?.unlocked ? buildMaterialHref(chapterId, section.id, "learn-1") : null,
        nextLabel: "Begin Learn 1",
      };
    }

    if (pageType !== "material" || !materialId) {
      return null;
    }

    const previous = getPreviousMaterialId(materialId);
    const next = getNextMaterialId(materialId);
    const currentIndex = chapter?.sections.findIndex((item) => item.id === section.id) ?? -1;
    const nextSection = currentIndex >= 0 ? chapter?.sections[currentIndex + 1] ?? null : null;

    if (materialId === "quiz") {
      return {
        prevHref: previous ? buildMaterialHref(chapterId, section.id, previous) : buildSectionHref(chapterId, section.id),
        prevLabel: previous ? getMaterialTitle(section, previous) : "Section Hub",
        nextHref: sectionProgress?.quizSubmitted ? buildMaterialHref(chapterId, section.id, "results") : null,
        nextLabel: "Results",
        nextDisabledLabel: sectionProgress?.quizSubmitted ? undefined : "Submit Quiz to Continue",
      };
    }

    if (materialId === "results") {
      return {
        prevHref: buildMaterialHref(chapterId, section.id, "quiz"),
        prevLabel: "Quiz",
        nextHref: isHardTestUnlocked(sectionProgress)
          ? buildMaterialHref(chapterId, section.id, "hard-test")
          : buildSectionHref(chapterId, section.id),
        nextLabel: isHardTestUnlocked(sectionProgress) ? "Hard Test" : "Back to Hub",
      };
    }

    if (materialId === "hard-test") {
      return {
        prevHref: buildMaterialHref(chapterId, section.id, "results"),
        prevLabel: "Results",
        nextHref:
          sectionProgress?.completed && nextSection
            ? buildSectionHref(chapterId, nextSection.id)
            : buildSectionHref(chapterId, section.id),
        nextLabel: sectionProgress?.completed && nextSection ? "Next Section" : "Back to Hub",
      };
    }

    return {
      prevHref: previous ? buildMaterialHref(chapterId, section.id, previous) : buildSectionHref(chapterId, section.id),
      prevLabel: previous ? getMaterialTitle(section, previous) : "Section Hub",
      nextHref: next ? buildMaterialHref(chapterId, section.id, next) : buildSectionHref(chapterId, section.id),
      nextLabel: next ? getMaterialTitle(section, next) : "Section Hub",
    };
  }, [chapter, chapterId, materialId, pageType, section, sectionProgress]);

  if (!chapter) {
    return (
      <main className="min-h-screen px-4 py-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="p-8">
            <h1 className="font-reading text-3xl font-bold text-[var(--text-primary)]">Chapter not found</h1>
          </Card>
        </div>
      </main>
    );
  }

  let content: React.ReactNode;

  if (!ready || !progress) {
    content = (
      <Card className="p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Loading</div>
        <div className="mt-3 text-xl font-bold text-[var(--text-primary)]">Restoring your study progress...</div>
      </Card>
    );
  } else if (pageType === "chapter") {
    content = <ChapterOverview chapter={chapter} progress={progress} />;
  } else if (!section) {
    content = (
      <Card className="p-8">
        <h1 className="font-reading text-3xl font-bold text-[var(--text-primary)]">Section not found</h1>
      </Card>
    );
  } else if (pageType === "section") {
    content = <SectionHub chapterId={chapterId} section={section} sectionProgress={sectionProgress} />;
  } else if (materialId === "flashcards") {
    content = <FlashcardsPage chapterId={chapterId} section={section} sectionProgress={sectionProgress} />;
  } else if (materialId === "videos") {
    content = <VideosPage section={section} />;
  } else if (materialId === "quiz") {
    content = <QuizPage chapterId={chapterId} section={section} />;
  } else if (materialId === "results") {
    content = <ResultsPage chapter={chapter} chapterId={chapterId} section={section} />;
  } else if (materialId === "hard-test") {
    content = <HardTestPage chapter={chapter} chapterId={chapterId} section={section} />;
  } else if (materialId?.startsWith("learn-")) {
    const page = section.learnPages.find((item) => item.id === materialId);
    content = page ? (
      <LearnPage section={section} page={page} />
    ) : (
      <Card className="p-8">
        <h1 className="font-reading text-3xl font-bold text-[var(--text-primary)]">Material not found</h1>
      </Card>
    );
  } else {
    content = (
      <Card className="p-8">
        <h1 className="font-reading text-3xl font-bold text-[var(--text-primary)]">Material not found</h1>
      </Card>
    );
  }

  const currentLabel =
    pageType === "chapter"
      ? chapter.title
      : pageType === "section"
        ? section?.title ?? chapter.title
        : section && materialId
          ? getMaterialTitle(section, materialId)
          : chapter.title;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[300px_minmax(0,1fr)]">
      <SidebarNav
        chapterId={chapterId}
        course={course}
        currentPath={currentPath}
        materialId={materialId}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        progress={progress}
        sectionId={sectionId}
      />

      <main className="min-w-0">
        <div className="border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 py-4 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <button className="button-secondary px-3 py-2 text-sm" onClick={() => setMobileOpen(true)} type="button">
              ☰ Menu
            </button>
            <div className="truncate text-sm font-bold text-[var(--text-primary)]">{currentLabel}</div>
          </div>
        </div>

        <div className="mx-auto max-w-[980px] px-4 py-6 md:px-8 md:py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="step-transition">{content}</div>
        </div>

        {stickyNav ? (
          <StickyNav
            nextDisabledLabel={stickyNav.nextDisabledLabel}
            nextHref={stickyNav.nextHref}
            nextLabel={stickyNav.nextLabel}
            prevHref={stickyNav.prevHref}
            prevLabel={stickyNav.prevLabel}
          />
        ) : null}
      </main>
    </div>
  );
}
