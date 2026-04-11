import { NextResponse } from "next/server";

import { getModuleSummaries } from "@/content/course";

export async function GET() {
  return NextResponse.json({ modules: getModuleSummaries() });
}
