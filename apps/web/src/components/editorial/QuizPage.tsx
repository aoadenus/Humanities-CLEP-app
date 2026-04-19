"use client";

import { AssessmentPage } from "@/components/editorial/AssessmentPage";
import type { EditorialSection } from "@/lib/types";

export function QuizPage({
  chapterId,
  section,
}: {
  chapterId: string;
  section: EditorialSection;
}) {
  return <AssessmentPage chapterId={chapterId} section={section} mode="quiz" title={`${section.title} Quiz`} />;
}
