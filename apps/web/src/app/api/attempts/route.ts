import { NextResponse } from "next/server";

import { findAssessmentById } from "@/content/course";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { PendingAttempt } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PendingAttempt>;

  if (!body.id || !body.assessmentId || !body.answers || !body.createdAt) {
    return NextResponse.json(
      { error: "id, assessmentId, answers, and createdAt are required." },
      { status: 400 },
    );
  }

  const assessment = findAssessmentById(body.assessmentId);

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({
      status: "queued",
      message:
        "Attempt received locally. Add Supabase environment variables to persist it remotely.",
    });
  }

  const client = await createSupabaseServerClient();

  if (!client) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: existingAttempt, error: selectError } = await client
    .from("user_attempts")
    .select("id")
    .eq("user_id", user.id)
    .eq("client_attempt_id", body.id)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  if (existingAttempt) {
    return NextResponse.json({ status: "already_synced" });
  }

  const moduleId =
    assessment.scopeModuleIds.length === 1 ? assessment.scopeModuleIds[0] : null;
  const { error: insertError } = await client.from("user_attempts").insert({
    user_id: user.id,
    client_attempt_id: body.id,
    module_id: moduleId,
    assessment_id: assessment.id,
    assessment_mode: assessment.mode,
    scope_module_ids: assessment.scopeModuleIds,
    score: body.score ?? 0,
    answers: body.answers,
    created_at: body.createdAt,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ status: "synced" });
}
