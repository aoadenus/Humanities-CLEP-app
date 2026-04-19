import { notFound } from "next/navigation";

import { EditorialShell } from "@/components/editorial/EditorialShell";
import { getEditorialCourse } from "@/content/editorial-course";
import { getSection } from "@/lib/editorial-navigation";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ chapterId: string; sectionId: string }>;
}) {
  const { chapterId, sectionId } = await params;
  const course = getEditorialCourse();
  const section = getSection(course, chapterId, sectionId);

  if (!section) {
    notFound();
  }

  return (
    <EditorialShell
      chapterId={chapterId}
      course={course}
      currentPath={`/chapter/${chapterId}/section/${sectionId}`}
      pageType="section"
      sectionId={sectionId}
    />
  );
}
