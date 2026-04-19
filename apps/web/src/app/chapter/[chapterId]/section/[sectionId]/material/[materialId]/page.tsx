import { notFound } from "next/navigation";

import { EditorialShell } from "@/components/editorial/EditorialShell";
import { getEditorialCourse } from "@/content/editorial-course";
import { getSection } from "@/lib/editorial-navigation";
import type { EditorialMaterialId } from "@/lib/types";

export default async function MaterialPage({
  params,
}: {
  params: Promise<{
    chapterId: string;
    sectionId: string;
    materialId: EditorialMaterialId;
  }>;
}) {
  const { chapterId, sectionId, materialId } = await params;
  const course = getEditorialCourse();
  const section = getSection(course, chapterId, sectionId);

  if (!section || materialId === "hub" || !section.materials.some((material) => material.id === materialId)) {
    notFound();
  }

  return (
    <EditorialShell
      chapterId={chapterId}
      course={course}
      currentPath={`/chapter/${chapterId}/section/${sectionId}/material/${materialId}`}
      materialId={materialId}
      pageType="material"
      sectionId={sectionId}
    />
  );
}
