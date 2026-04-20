import { getEditorialCourse } from "@/content/editorial-course";

export function getChapterStaticParams() {
  return getEditorialCourse().chapters.map((chapter) => ({
    chapterId: chapter.id,
  }));
}

export function getSectionStaticParams() {
  return getEditorialCourse().chapters.flatMap((chapter) =>
    chapter.sections.map((section) => ({
      chapterId: chapter.id,
      sectionId: section.id,
    })),
  );
}

export function getMaterialStaticParams() {
  return getEditorialCourse().chapters.flatMap((chapter) =>
    chapter.sections.flatMap((section) =>
      section.materials
        .filter((material) => material.id !== "hub")
        .map((material) => ({
          chapterId: chapter.id,
          sectionId: section.id,
          materialId: material.id,
        })),
    ),
  );
}
