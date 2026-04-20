import type {
  EditorialChapter,
  EditorialCourse,
  EditorialMaterialId,
  EditorialProgress,
  EditorialSection,
  EditorialSectionProgress,
} from "@/lib/types";

function getSectionMaterialOrder(section: EditorialSection) {
  return section.materials
    .filter((material) => material.id !== "hub")
    .map((material) => material.id);
}

export function buildChapterHref(chapterId: string) {
  return `/chapter/${chapterId}`;
}

export function buildSectionHref(chapterId: string, sectionId: string) {
  return `/chapter/${chapterId}/section/${sectionId}`;
}

export function buildMaterialHref(
  chapterId: string,
  sectionId: string,
  materialId: EditorialMaterialId,
) {
  if (materialId === "hub") {
    return buildSectionHref(chapterId, sectionId);
  }

  return `/chapter/${chapterId}/section/${sectionId}/material/${materialId}`;
}

export function getChapter(course: EditorialCourse, chapterId: string) {
  return course.chapters.find((chapter) => chapter.id === chapterId) ?? null;
}

export function getSection(
  course: EditorialCourse,
  chapterId: string,
  sectionId: string,
) {
  return getChapter(course, chapterId)?.sections.find((section) => section.id === sectionId) ?? null;
}

export function getMaterial(section: EditorialSection, materialId: EditorialMaterialId) {
  return section.materials.find((material) => material.id === materialId) ?? null;
}

export function getSectionProgressRatio(
  section: EditorialSection,
  sectionProgress: EditorialSectionProgress | null,
) {
  if (!section.materials.length || !sectionProgress) {
    return 0;
  }

  let completed = 0;
  for (const material of section.materials) {
    if (material.id === "hard-test") {
      if (sectionProgress.hardTestScore !== null && sectionProgress.hardTestScore >= section.hardTest.passThreshold) {
        completed += 1;
      }
      continue;
    }

    if (material.id === "results") {
      if (sectionProgress.quizSubmitted) {
        completed += 1;
      }
      continue;
    }

    if (material.id === "quiz") {
      if (sectionProgress.quizSubmitted) {
        completed += 1;
      }
      continue;
    }

    if (sectionProgress.visitedMaterials.includes(material.id)) {
      completed += 1;
    }
  }

  return completed / section.materials.length;
}

export function getChapterProgressRatio(
  chapter: EditorialChapter,
  progress: EditorialProgress | null,
) {
  if (!chapter.sections.length || !progress) {
    return 0;
  }

  const chapterProgress = progress.chapters[chapter.id];
  if (!chapterProgress) {
    return 0;
  }

  const completedSections = chapter.sections.filter(
    (section) => chapterProgress.sections[section.id]?.completed,
  ).length;

  return completedSections / chapter.sections.length;
}

export function getPreviousMaterialId(section: EditorialSection, materialId: EditorialMaterialId) {
  const materialOrder = getSectionMaterialOrder(section);
  const currentIndex = materialOrder.indexOf(materialId);
  if (currentIndex <= 0) {
    return null;
  }

  return materialOrder[currentIndex - 1] ?? null;
}

export function getNextMaterialId(section: EditorialSection, materialId: EditorialMaterialId) {
  const materialOrder = getSectionMaterialOrder(section);
  const currentIndex = materialOrder.indexOf(materialId);
  if (currentIndex < 0 || currentIndex === materialOrder.length - 1) {
    return null;
  }

  return materialOrder[currentIndex + 1] ?? null;
}

export function getMaterialTitle(
  section: EditorialSection,
  materialId: EditorialMaterialId,
) {
  if (materialId.startsWith("learn-")) {
    return section.learnPages.find((page) => page.id === materialId)?.title ?? materialId;
  }

  return getMaterial(section, materialId)?.title ?? materialId;
}
