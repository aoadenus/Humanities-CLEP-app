import type { SupabaseClient } from "@supabase/supabase-js";

import { findAssessmentById } from "@/content/course";
import type { LocalProgressState } from "@/lib/types";

function createEmptyProgressState(): LocalProgressState {
  return {
    objectiveProgress: {},
    sectionProgress: {},
    moduleProgress: {},
    assessmentProgress: {},
    pendingAttempts: [],
    updatedAt: new Date(0).toISOString(),
  };
}

function latestTimestamp(current: string, candidate?: string | null) {
  if (!candidate) {
    return current;
  }

  return new Date(candidate).getTime() > new Date(current).getTime() ? candidate : current;
}

export async function readServerProgressState(
  client: SupabaseClient,
  userId: string,
): Promise<LocalProgressState> {
  const [objectiveResponse, sectionResponse, moduleResponse, attemptResponse] =
    await Promise.all([
      client
        .from("user_objective_progress")
        .select(
          "objective_id, learned, flashcards_reviewed, average_score, attempts, weakness_weight, last_score, updated_at",
        )
        .eq("user_id", userId),
      client
        .from("user_section_progress")
        .select("section_id, score, passed, updated_at")
        .eq("user_id", userId),
      client
        .from("user_module_progress")
        .select("module_id, quiz_score, test_score, status, updated_at")
        .eq("user_id", userId),
      client
        .from("user_attempts")
        .select("assessment_id, assessment_mode, score, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    ]);

  if (objectiveResponse.error) {
    throw objectiveResponse.error;
  }

  if (sectionResponse.error) {
    throw sectionResponse.error;
  }

  if (moduleResponse.error) {
    throw moduleResponse.error;
  }

  if (attemptResponse.error) {
    throw attemptResponse.error;
  }

  const state = createEmptyProgressState();

  for (const row of objectiveResponse.data ?? []) {
    state.objectiveProgress[row.objective_id] = {
      learned: Boolean(row.learned),
      flashcardsReviewed: Boolean(row.flashcards_reviewed),
      averageScore: Number(row.average_score ?? 0),
      attempts: Number(row.attempts ?? 0),
      weaknessWeight: Number(row.weakness_weight ?? 0),
      lastScore: row.last_score === null ? undefined : Number(row.last_score),
    };
    state.updatedAt = latestTimestamp(state.updatedAt, row.updated_at);
  }

  for (const row of sectionResponse.data ?? []) {
    state.sectionProgress[row.section_id] = {
      score: row.score === null ? undefined : Number(row.score),
      passed: Boolean(row.passed),
    };
    state.updatedAt = latestTimestamp(state.updatedAt, row.updated_at);
  }

  for (const row of moduleResponse.data ?? []) {
    state.moduleProgress[row.module_id] = {
      quizScore: row.quiz_score === null ? undefined : Number(row.quiz_score),
      testScore: row.test_score === null ? undefined : Number(row.test_score),
      status: row.status,
    };
    state.updatedAt = latestTimestamp(state.updatedAt, row.updated_at);
  }

  for (const row of attemptResponse.data ?? []) {
    const assessment = findAssessmentById(row.assessment_id);
    const current = state.assessmentProgress[row.assessment_id] ?? {
      passed: false,
      attempts: 0,
    };

    state.assessmentProgress[row.assessment_id] = {
      score: Number(row.score ?? 0),
      passed: current.passed || Number(row.score ?? 0) >= (assessment?.passingScore ?? 75),
      attempts: current.attempts + 1,
      lastAttemptAt: row.created_at ?? undefined,
    };
    state.updatedAt = latestTimestamp(state.updatedAt, row.created_at);
  }

  if (state.updatedAt === new Date(0).toISOString()) {
    state.updatedAt = new Date().toISOString();
  }

  return state;
}

export async function persistProgressSnapshot(
  client: SupabaseClient,
  userId: string,
  progress: LocalProgressState,
) {
  const updatedAt = new Date().toISOString();
  const objectiveRows = Object.entries(progress.objectiveProgress).map(([objectiveId, value]) => ({
    user_id: userId,
    objective_id: objectiveId,
    learned: value.learned,
    flashcards_reviewed: value.flashcardsReviewed,
    average_score: value.averageScore,
    attempts: value.attempts,
    weakness_weight: value.weaknessWeight,
    last_score: value.lastScore ?? null,
    updated_at: updatedAt,
  }));
  const sectionRows = Object.entries(progress.sectionProgress).map(([sectionId, value]) => ({
    user_id: userId,
    section_id: sectionId,
    score: value.score ?? null,
    passed: value.passed,
    updated_at: updatedAt,
  }));
  const moduleRows = Object.entries(progress.moduleProgress).map(([moduleId, value]) => ({
    user_id: userId,
    module_id: moduleId,
    quiz_score: value.quizScore ?? null,
    test_score: value.testScore ?? null,
    status: value.status,
    updated_at: updatedAt,
  }));

  if (objectiveRows.length) {
    const { error } = await client
      .from("user_objective_progress")
      .upsert(objectiveRows, { onConflict: "user_id,objective_id" });

    if (error) {
      throw error;
    }
  }

  if (sectionRows.length) {
    const { error } = await client
      .from("user_section_progress")
      .upsert(sectionRows, { onConflict: "user_id,section_id" });

    if (error) {
      throw error;
    }
  }

  if (moduleRows.length) {
    const { error } = await client
      .from("user_module_progress")
      .upsert(moduleRows, { onConflict: "user_id,module_id" });

    if (error) {
      throw error;
    }
  }
}
