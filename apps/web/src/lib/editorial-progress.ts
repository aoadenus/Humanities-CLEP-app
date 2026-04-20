import { get, set } from "idb-keyval";

import type {
  EditorialCourse,
  EditorialMaterialId,
  EditorialProgress,
  EditorialSectionProgress,
} from "@/lib/types";

const STORAGE_KEY = "clep-humanities-v1";

function createSectionProgress(unlocked = false): EditorialSectionProgress {
  return {
    unlocked,
    completed: false,
    visitedMaterials: [],
    flashcardPosition: 0,
    starredFlashcards: [],
    quizAnswers: {},
    quizSubmitted: false,
    quizScore: null,
    hardTestAnswers: {},
    hardTestSubmitted: false,
    hardTestScore: null,
  };
}

function isChapterAvailable(course: EditorialCourse, chapterIndex: number) {
  const chapter = course.chapters[chapterIndex];
  return Boolean(chapter && !chapter.locked && chapter.sections.length > 0);
}

export function createEmptyEditorialProgress(): EditorialProgress {
  return {
    currentRoute: "/",
    chapters: {},
  };
}

export function ensureEditorialProgress(
  progress: EditorialProgress | null | undefined,
  course: EditorialCourse,
): EditorialProgress {
  const next = progress ? structuredClone(progress) : createEmptyEditorialProgress();

  for (const [chapterIndex, chapter] of course.chapters.entries()) {
    const chapterUnlocked = isChapterAvailable(course, chapterIndex);
    next.chapters[chapter.id] ??= { unlocked: chapterUnlocked, sections: {} };
    next.chapters[chapter.id].unlocked = chapterUnlocked;

    for (const section of chapter.sections) {
      next.chapters[chapter.id].sections[section.id] ??= createSectionProgress(chapterUnlocked);
      next.chapters[chapter.id].sections[section.id].unlocked = chapterUnlocked;
    }
  }

  return applyUnlockRules(next, course);
}

export function applyUnlockRules(
  progress: EditorialProgress,
  course: EditorialCourse,
): EditorialProgress {
  const next = structuredClone(progress);

  for (const [chapterIndex, chapter] of course.chapters.entries()) {
    const chapterUnlocked = isChapterAvailable(course, chapterIndex);
    next.chapters[chapter.id] ??= { unlocked: chapterUnlocked, sections: {} };
    next.chapters[chapter.id].unlocked = chapterUnlocked;

    for (const section of chapter.sections) {
      next.chapters[chapter.id].sections[section.id] ??= createSectionProgress(chapterUnlocked);
      next.chapters[chapter.id].sections[section.id].unlocked = chapterUnlocked;
    }
  }

  return next;
}

export async function loadEditorialProgress(course: EditorialCourse) {
  const timeout = new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 3000));
  const saved = await Promise.race([get<EditorialProgress>(STORAGE_KEY), timeout]).catch(() => undefined);
  return ensureEditorialProgress(saved, course);
}

export async function persistEditorialProgress(progress: EditorialProgress) {
  try {
    await set(STORAGE_KEY, progress);
  } catch {
    // IndexedDB unavailable (e.g. cross-origin network access)
  }
}

export function markMaterialVisited(
  progress: EditorialProgress,
  chapterId: string,
  sectionId: string,
  materialId: EditorialMaterialId,
) {
  const next = structuredClone(progress);
  const sectionProgress = next.chapters[chapterId]?.sections[sectionId];
  if (!sectionProgress) {
    return next;
  }

  if (!sectionProgress.visitedMaterials.includes(materialId)) {
    sectionProgress.visitedMaterials.push(materialId);
  }

  return next;
}

export function setCurrentRoute(progress: EditorialProgress, route: string) {
  const next = structuredClone(progress);
  next.currentRoute = route;
  return next;
}

export function setFlashcardPosition(
  progress: EditorialProgress,
  chapterId: string,
  sectionId: string,
  position: number,
) {
  const next = structuredClone(progress);
  const sectionProgress = next.chapters[chapterId]?.sections[sectionId];
  if (!sectionProgress) {
    return next;
  }

  sectionProgress.flashcardPosition = position;
  return next;
}

export function toggleStarredFlashcard(
  progress: EditorialProgress,
  chapterId: string,
  sectionId: string,
  cardId: string,
) {
  const next = structuredClone(progress);
  const sectionProgress = next.chapters[chapterId]?.sections[sectionId];
  if (!sectionProgress) {
    return next;
  }

  sectionProgress.starredFlashcards = sectionProgress.starredFlashcards.includes(cardId)
    ? sectionProgress.starredFlashcards.filter((existingId) => existingId !== cardId)
    : [...sectionProgress.starredFlashcards, cardId];

  return next;
}

export function setQuizAnswer(
  progress: EditorialProgress,
  chapterId: string,
  sectionId: string,
  questionId: number,
  answerIndex: number,
  mode: "quiz" | "hard-test",
) {
  const next = structuredClone(progress);
  const sectionProgress = next.chapters[chapterId]?.sections[sectionId];
  if (!sectionProgress) {
    return next;
  }

  if (mode === "quiz") {
    sectionProgress.quizAnswers[questionId] = answerIndex;
  } else {
    sectionProgress.hardTestAnswers[questionId] = answerIndex;
  }

  return next;
}

export function submitAssessment(
  progress: EditorialProgress,
  course: EditorialCourse,
  chapterId: string,
  sectionId: string,
  mode: "quiz" | "hard-test",
  score: number,
) {
  const next = structuredClone(progress);
  const sectionProgress = next.chapters[chapterId]?.sections[sectionId];
  const section = course.chapters.find((chapter) => chapter.id === chapterId)?.sections.find((item) => item.id === sectionId);
  if (!sectionProgress) {
    return next;
  }

  if (mode === "quiz") {
    sectionProgress.quizSubmitted = true;
    sectionProgress.quizScore = score;
  } else {
    sectionProgress.hardTestSubmitted = true;
    sectionProgress.hardTestScore = score;
    sectionProgress.completed = Boolean(section && score >= section.hardTest.passThreshold);
  }

  return applyUnlockRules(next, course);
}

export function resetAssessment(
  progress: EditorialProgress,
  chapterId: string,
  sectionId: string,
  mode: "quiz" | "hard-test",
) {
  const next = structuredClone(progress);
  const sectionProgress = next.chapters[chapterId]?.sections[sectionId];
  if (!sectionProgress) {
    return next;
  }

  if (mode === "quiz") {
    sectionProgress.quizAnswers = {};
    sectionProgress.quizSubmitted = false;
    sectionProgress.quizScore = null;
  } else {
    sectionProgress.hardTestAnswers = {};
    sectionProgress.hardTestSubmitted = false;
    sectionProgress.hardTestScore = null;
    sectionProgress.completed = false;
  }

  return next;
}

export function getSectionProgress(
  progress: EditorialProgress,
  chapterId: string,
  sectionId: string,
) {
  return progress.chapters[chapterId]?.sections[sectionId] ?? null;
}

export function isHardTestUnlocked(sectionProgress: EditorialSectionProgress | null) {
  return Boolean(sectionProgress?.quizSubmitted);
}

export function getMaterialStatus(
  sectionProgress: EditorialSectionProgress | null,
  materialId: EditorialMaterialId,
): "not_started" | "in_progress" | "complete" | "locked" {
  if (!sectionProgress) {
    return "locked";
  }

  if (materialId === "hard-test" && !isHardTestUnlocked(sectionProgress)) {
    return "locked";
  }

  if (materialId === "quiz") {
    return sectionProgress.quizSubmitted ? "complete" : "not_started";
  }

  if (materialId === "results") {
    return sectionProgress.quizSubmitted ? "complete" : "locked";
  }

  if (materialId === "hard-test") {
    if (sectionProgress.hardTestSubmitted && sectionProgress.hardTestScore !== null) {
      return sectionProgress.hardTestScore >= 8 ? "complete" : "in_progress";
    }
    return "not_started";
  }

  if (sectionProgress.visitedMaterials.includes(materialId)) {
    return "complete";
  }

  return "not_started";
}
