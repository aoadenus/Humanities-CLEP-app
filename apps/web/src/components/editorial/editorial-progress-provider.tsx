"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const courseRef = useRef(course);

  useEffect(() => {
    courseRef.current = course;
  }, [course]);

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

  const touchRoute = useCallback(
    (route: string) => {
      setProgress((current) =>
        setCurrentRoute(ensureEditorialProgress(current, courseRef.current), route),
      );
    },
    [],
  );

  const visitMaterial = useCallback(
    (chapterId: string, sectionId: string, materialId: EditorialMaterialId) => {
      setProgress((current) =>
        markMaterialVisited(
          ensureEditorialProgress(current, courseRef.current),
          chapterId,
          sectionId,
          materialId,
        ),
      );
    },
    [],
  );

  const updateFlashcardPosition = useCallback(
    (chapterId: string, sectionId: string, position: number) => {
      setProgress((current) =>
        setFlashcardPosition(
          ensureEditorialProgress(current, courseRef.current),
          chapterId,
          sectionId,
          position,
        ),
      );
    },
    [],
  );

  const toggleStar = useCallback(
    (chapterId: string, sectionId: string, cardId: string) => {
      setProgress((current) =>
        toggleStarredFlashcard(
          ensureEditorialProgress(current, courseRef.current),
          chapterId,
          sectionId,
          cardId,
        ),
      );
    },
    [],
  );

  const answerQuestion = useCallback(
    (
      chapterId: string,
      sectionId: string,
      questionId: number,
      answerIndex: number,
      mode: "quiz" | "hard-test",
    ) => {
      setProgress((current) =>
        setQuizAnswer(
          ensureEditorialProgress(current, courseRef.current),
          chapterId,
          sectionId,
          questionId,
          answerIndex,
          mode,
        ),
      );
    },
    [],
  );

  const finalizeAssessment = useCallback(
    (chapterId: string, sectionId: string, score: number, mode: "quiz" | "hard-test") => {
      setProgress((current) =>
        submitAssessment(
          ensureEditorialProgress(current, courseRef.current),
          courseRef.current,
          chapterId,
          sectionId,
          mode,
          score,
        ),
      );
    },
    [],
  );

  const clearAssessment = useCallback(
    (chapterId: string, sectionId: string, mode: "quiz" | "hard-test") => {
      setProgress((current) =>
        resetAssessment(ensureEditorialProgress(current, courseRef.current), chapterId, sectionId, mode),
      );
    },
    [],
  );

  const value = useMemo<EditorialProgressContextValue>(() => {
    const safeProgress = ensureEditorialProgress(progress, course);

    return {
      progress: safeProgress,
      ready,
      touchRoute,
      visitMaterial,
      updateFlashcardPosition,
      toggleStar,
      answerQuestion,
      finalizeAssessment,
      clearAssessment,
    };
  }, [
    answerQuestion,
    clearAssessment,
    course,
    finalizeAssessment,
    progress,
    ready,
    toggleStar,
    touchRoute,
    updateFlashcardPosition,
    visitMaterial,
  ]);

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
