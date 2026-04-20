import { notFound } from "next/navigation";

import { EditorialShell } from "@/components/editorial/EditorialShell";
import { getEditorialCourse } from "@/content/editorial-course";
import { getChapter } from "@/lib/editorial-navigation";
import { getChapterStaticParams } from "@/lib/editorial-static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return getChapterStaticParams();
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const course = getEditorialCourse();
  const chapter = getChapter(course, chapterId);

  if (!chapter) {
    notFound();
  }

  return (
    <EditorialShell
      chapterId={chapterId}
      course={course}
      currentPath={`/chapter/${chapterId}`}
      pageType="chapter"
    />
  );
}
