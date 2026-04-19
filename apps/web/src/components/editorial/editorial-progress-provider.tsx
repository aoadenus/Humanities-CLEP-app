"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ensureEditorialProgress,
  getMaterialStatus,
  getSectionProgress,
  isHardTestUnlocked,
  loadEditorialProgress,
  markMaterialVisited,
  persistEditorialProgress,
  resetAssessment,
  setCurrentRoute,
  setFlashcardPosition,
  setQuizAnswer,
  submitAssessment,
  toggleStarredFlashcard,
} from "@/lib/editorial-progress";
import type { EditorialCourse, EditorialMaterialId, EditorialProgress } from "@/lib/types";

interface EditorialProgressContextValue {
  progress: EditorialProgress | null;
  ready: boolean;
  touchRoute: (route: string) => void;
  visitMaterial: (chapterId: string, sectionId: string, materialId: EditorialMaterialId) => void;
  updateFlashcardPosition: (chapterId: string, sectionId: string, position: number) => void;
  toggleStar: (chapterId: string, sectionId: string, cardId: string) => void;
  answerQuestion: (
    chapterId: string,
    sectionId: string,
    questionId: number,
    answerIndex: number,
    mode: "quiz" | "hard-test",
  ) => void;
  finalizeAssessment: (
    chapterId: string,
    sectionId: string,
    score: number,
    mode: "quiz" | "hard-test",
  ) => void;
  clearAssessment: (
    chapterId: string,
    sectionId: string,
    mode: "quiz" | "hard-test",
  ) => void;
}

const EditorialProgressContext = createContext<EditorialProgressContextValue | null>(null);

export function EditorialProgressProvider({
  children,
  course,
}: {
  children: ReactNode;
  course: EditorialCourse;
}) {
  const [progress, setProgress] = useState<EditorialProgress | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    void (async () => {
      const loaded = await loadEditorialProgress(course);
      if (!active) {
        return;
      }

      setProgress(loaded);
      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, [course]);

  useEffect(() => {
    if (!ready || !progress) {
      return;
    }

    void persistEditorialProgress(progress);
  }, [progress, ready]);

  const value = useMemo<EditorialProgressContextValue>(() => {
    const safeProgress = ensureEditorialProgress(progress, course);

    return {
      progress: safeProgress,
      ready,
      touchRoute(route) {
        setProgress((current) => setCurrentRoute(ensureEditorialProgress(current, course), route));
      },
      visitMaterial(chapterId, sectionId, materialId) {
        setProgress((current) =>
          markMaterialVisited(ensureEditorialProgress(current, course), chapterId, sectionId, materialId),
        );
      },
      updateFlashcardPosition(chapterId, sectionId, position) {
        setProgress((current) =>
          setFlashcardPosition(ensureEditorialProgress(current, course), chapterId, sectionId, position),
        );
      },
      toggleStar(chapterId, sectionId, cardId) {
        setProgress((current) =>
          toggleStarredFlashcard(ensureEditorialProgress(current, course), chapterId, sectionId, cardId),
        );
      },
      answerQuestion(chapterId, sectionId, questionId, answerIndex, mode) {
        setProgress((current) =>
          setQuizAnswer(
            ensureEditorialProgress(current, course),
            chapterId,
            sectionId,
            questionId,
            answerIndex,
            mode,
          ),
        );
      },
      finalizeAssessment(chapterId, sectionId, score, mode) {
        setProgress((current) =>
          submitAssessment(
            ensureEditorialProgress(current, course),
            course,
            chapterId,
            sectionId,
            mode,
            score,
          ),
        );
      },
      clearAssessment(chapterId, sectionId, mode) {
        setProgress((current) =>
          resetAssessment(ensureEditorialProgress(current, course), chapterId, sectionId, mode),
        );
      },
    };
  }, [course, progress, ready]);

  return (
    <EditorialProgressContext.Provider value={value}>
      {children}
    </EditorialProgressContext.Provider>
  );
}

export function useEditorialProgress() {
  const context = useContext(EditorialProgressContext);

  if (!context) {
    throw new Error("useEditorialProgress must be used within EditorialProgressProvider.");
  }

  return context;
}

export { getMaterialStatus, getSectionProgress, isHardTestUnlocked };
