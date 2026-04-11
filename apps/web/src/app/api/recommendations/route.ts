import { NextResponse } from "next/server";

import { getModuleBundle } from "@/content/course";
import { getRecommendation } from "@/lib/progress-store";
import type { LocalProgressState } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    moduleId?: string;
    progress?: LocalProgressState;
  };

  if (!body.moduleId || !body.progress) {
    return NextResponse.json(
      { error: "moduleId and progress are required." },
      { status: 400 },
    );
  }

  const bundle = getModuleBundle(body.moduleId);

  if (!bundle) {
    return NextResponse.json({ error: "Module not found." }, { status: 404 });
  }

  return NextResponse.json({ recommendation: getRecommendation(bundle, body.progress) });
}
