import { NextResponse } from "next/server";

import { getModuleBundle } from "@/content/course";

export async function GET(
  _request: Request,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) {
  const params = await context.params;
  const moduleId = typeof params.moduleId === "string" ? params.moduleId : undefined;

  if (!moduleId) {
    return NextResponse.json({ error: "Module id is required." }, { status: 400 });
  }

  const bundle = getModuleBundle(moduleId);

  if (!bundle) {
    return NextResponse.json({ error: "Module not found." }, { status: 404 });
  }

  return NextResponse.json({ module: bundle });
}
