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
    next.chapters[chapter.id] ??= {
      unlocked: chapterIndex === 0,
      sections: {},
    };

    if (chapterIndex === 0) {
      next.chapters[chapter.id].unlocked = true;
    }

    for (const [sectionIndex, section] of chapter.sections.entries()) {
      next.chapters[chapter.id].sections[section.id] ??= createSectionProgress(
        chapterIndex === 0 && sectionIndex === 0,
      );
    }
  }

  return applyUnlockRules(next, course);
}

export function applyUnlockRules(
  progress: EditorialProgress,
  course: EditorialCourse,
): EditorialProgress {
  const next = structuredClone(progress);
  const chapter1 = course.chapters[0];

  if (!chapter1) {
    return next;
  }

  next.chapters[chapter1.id] ??= {
    unlocked: true,
    sections: {},
  };
  next.chapters[chapter1.id].unlocked = true;

  for (const [index, section] of chapter1.sections.entries()) {
    next.chapters[chapter1.id].sections[section.id] ??= createSectionProgress(index === 0);
    const current = next.chapters[chapter1.id].sections[section.id];

    if (index === 0) {
      current.unlocked = true;
      continue;
    }

    const previousSection = chapter1.sections[index - 1];
    const previousProgress = next.chapters[chapter1.id].sections[previousSection.id];
    current.unlocked = Boolean(previousProgress?.hardTestScore !== null && previousProgress.hardTestScore >= 8);
  }

  const chapter1Complete = chapter1.sections.every((section) => {
    const sectionProgress = next.chapters[chapter1.id].sections[section.id];
    return Boolean(sectionProgress?.hardTestScore !== null && sectionProgress.hardTestScore >= 8);
  });

  const chapter2 = course.chapters[1];
  if (chapter2) {
    next.chapters[chapter2.id] ??= {
      unlocked: false,
      sections: {},
    };
    next.chapters[chapter2.id].unlocked = chapter1Complete;
  }

  return next;
}

export async function loadEditorialProgress(course: EditorialCourse) {
  const saved = await get<EditorialProgress>(STORAGE_KEY);
  return ensureEditorialProgress(saved, course);
}

export async function persistEditorialProgress(progress: EditorialProgress) {
  await set(STORAGE_KEY, progress);
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
  if (!sectionProgress) {
    return next;
  }

  if (mode === "quiz") {
    sectionProgress.quizSubmitted = true;
    sectionProgress.quizScore = score;
  } else {
    sectionProgress.hardTestSubmitted = true;
    sectionProgress.hardTestScore = score;
    sectionProgress.completed = score >= 8;
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
  return Boolean(sectionProgress && sectionProgress.quizScore !== null && sectionProgress.quizScore >= 8);
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
