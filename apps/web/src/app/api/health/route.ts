import { NextResponse } from "next/server";

import { getEditorialCourse } from "@/content/editorial-course";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const course = getEditorialCourse();

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    chapters: course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      locked: chapter.locked,
      sections: chapter.sections.length,
    })),
  });
}
