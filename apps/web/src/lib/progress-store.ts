import { del, get, set } from "idb-keyval";

import type {
  AssessmentBundle,
  AssessmentProgress,
  LocalProgressState,
  ModuleBundle,
  ModuleProgress,
  ObjectiveProgress,
  PendingAttempt,
  Recommendation,
} from "@/lib/types";

const STORAGE_KEY = "clep-humanities-progress-v1";

const emptyObjectiveProgress = (): ObjectiveProgress => ({
  learned: false,
  flashcardsReviewed: false,
  averageScore: 0,
  attempts: 0,
  weaknessWeight: 0,
});

const emptyAssessmentProgress = (): AssessmentProgress => ({
  passed: false,
  attempts: 0,
});

const emptyModuleProgress = (): ModuleProgress => ({
  status: "not_started",
});

function createEmptyState(): LocalProgressState {
  return {
    objectiveProgress: {},
    sectionProgress: {},
    moduleProgress: {},
    assessmentProgress: {},
    pendingAttempts: [],
    updatedAt: new Date().toISOString(),
  };
}

export async function loadProgressState(): Promise<LocalProgressState> {
  return (await get<LocalProgressState>(STORAGE_KEY)) ?? createEmptyState();
}

export async function clearProgressState() {
  await del(STORAGE_KEY);
}

async function saveProgressState(state: LocalProgressState) {
  state.updatedAt = new Date().toISOString();
  await set(STORAGE_KEY, state);
}

const moduleStatusRank: Record<ModuleProgress["status"], number> = {
  not_started: 0,
  learning: 1,
  needs_review: 2,
  passed: 3,
  mastered: 4,
};

function mergeObjectiveProgress(
  local: ObjectiveProgress | undefined,
  remote: ObjectiveProgress | undefined,
): ObjectiveProgress | undefined {
  if (!local) {
    return remote;
  }

  if (!remote) {
    return local;
  }

  const source = remote.attempts > local.attempts ? remote : local;

  return {
    learned: local.learned || remote.learned,
    flashcardsReviewed: local.flashcardsReviewed || remote.flashcardsReviewed,
    averageScore: source.averageScore,
    attempts: Math.max(local.attempts, remote.attempts),
    weaknessWeight: Math.max(local.weaknessWeight, remote.weaknessWeight),
    lastScore: source.lastScore,
  };
}

function mergeSectionProgress(
  local: LocalProgressState["sectionProgress"][string] | undefined,
  remote: LocalProgressState["sectionProgress"][string] | undefined,
) {
  if (!local) {
    return remote;
  }

  if (!remote) {
    return local;
  }

  return {
    score: Math.max(local.score ?? 0, remote.score ?? 0) || undefined,
    passed: local.passed || remote.passed,
  };
}

function mergeModuleProgress(
  local: ModuleProgress | undefined,
  remote: ModuleProgress | undefined,
): ModuleProgress | undefined {
  if (!local) {
    return remote;
  }

  if (!remote) {
    return local;
  }

  return {
    quizScore: Math.max(local.quizScore ?? 0, remote.quizScore ?? 0) || undefined,
    testScore: Math.max(local.testScore ?? 0, remote.testScore ?? 0) || undefined,
    status:
      moduleStatusRank[local.status] >= moduleStatusRank[remote.status]
        ? local.status
        : remote.status,
  };
}

function mergeAssessmentProgress(
  local: AssessmentProgress | undefined,
  remote: AssessmentProgress | undefined,
): AssessmentProgress | undefined {
  if (!local) {
    return remote;
  }

  if (!remote) {
    return local;
  }

  const source = (remote.attempts ?? 0) > (local.attempts ?? 0) ? remote : local;

  return {
    score: source.score,
    passed: local.passed || remote.passed,
    attempts: Math.max(local.attempts, remote.attempts),
    lastAttemptAt: source.lastAttemptAt,
  };
}

export function mergeProgressStates(
  local: LocalProgressState,
  remote: LocalProgressState,
): LocalProgressState {
  const next = createEmptyState();

  for (const objectiveId of new Set([
    ...Object.keys(local.objectiveProgress),
    ...Object.keys(remote.objectiveProgress),
  ])) {
    const merged = mergeObjectiveProgress(
      local.objectiveProgress[objectiveId],
      remote.objectiveProgress[objectiveId],
    );

    if (merged) {
      next.objectiveProgress[objectiveId] = merged;
    }
  }

  for (const sectionId of new Set([
    ...Object.keys(local.sectionProgress),
    ...Object.keys(remote.sectionProgress),
  ])) {
    const merged = mergeSectionProgress(
      local.sectionProgress[sectionId],
      remote.sectionProgress[sectionId],
    );

    if (merged) {
      next.sectionProgress[sectionId] = merged;
    }
  }

  for (const moduleId of new Set([
    ...Object.keys(local.moduleProgress),
    ...Object.keys(remote.moduleProgress),
  ])) {
    const merged = mergeModuleProgress(
      local.moduleProgress[moduleId],
      remote.moduleProgress[moduleId],
    );

    if (merged) {
      next.moduleProgress[moduleId] = merged;
    }
  }

  for (const assessmentId of new Set([
    ...Object.keys(local.assessmentProgress),
    ...Object.keys(remote.assessmentProgress),
  ])) {
    const merged = mergeAssessmentProgress(
      local.assessmentProgress[assessmentId],
      remote.assessmentProgress[assessmentId],
    );

    if (merged) {
      next.assessmentProgress[assessmentId] = merged;
    }
  }

  const pendingAttemptIds = new Set<string>();
  next.pendingAttempts = [...local.pendingAttempts, ...remote.pendingAttempts].filter((attempt) => {
    if (pendingAttemptIds.has(attempt.id)) {
      return false;
    }

    pendingAttemptIds.add(attempt.id);
    return true;
  });
  next.updatedAt =
    new Date(local.updatedAt).getTime() >= new Date(remote.updatedAt).getTime()
      ? local.updatedAt
      : remote.updatedAt;

  return next;
}

export async function mergeRemoteProgressState(remote: LocalProgressState) {
  const local = await loadProgressState();
  const merged = mergeProgressStates(local, remote);
  await saveProgressState(merged);
  return merged;
}

export async function markObjectiveLearned(objectiveId: string) {
  const state = await loadProgressState();
  state.objectiveProgress[objectiveId] = {
    ...(state.objectiveProgress[objectiveId] ?? emptyObjectiveProgress()),
    learned: true,
  };
  await saveProgressState(state);
  return state;
}

export async function markFlashcardsReviewed(objectiveId: string) {
  const state = await loadProgressState();
  state.objectiveProgress[objectiveId] = {
    ...(state.objectiveProgress[objectiveId] ?? emptyObjectiveProgress()),
    flashcardsReviewed: true,
  };
  await saveProgressState(state);
  return state;
}

export async function recordAssessmentResult(
  module: ModuleBundle,
  assessment: AssessmentBundle,
  answers: Record<string, string>,
) {
  const state = await loadProgressState();
  const total = assessment.questions.length;
  const correct = assessment.questions.filter(
    (question) => answers[question.id] === question.answer,
  ).length;
  const score = Math.round((correct / total) * 100);

  for (const question of assessment.questions) {
    const current = state.objectiveProgress[question.objectiveId] ?? emptyObjectiveProgress();
    const wasCorrect = answers[question.id] === question.answer;
    const nextAttempts = current.attempts + 1;
    const contribution = wasCorrect ? 100 : 0;
    const averageScore =
      Math.round((current.averageScore * current.attempts + contribution) / nextAttempts);

    state.objectiveProgress[question.objectiveId] = {
      ...current,
      averageScore,
      attempts: nextAttempts,
      lastScore: contribution,
      weaknessWeight: Math.max(0, current.weaknessWeight + (wasCorrect ? -0.5 : 1.5)),
    };
  }

  if (assessment.mode === "checkpoint") {
    const sectionId = assessment.id.replace("checkpoint-", "");
    state.sectionProgress[sectionId] = {
      score,
      passed: score >= assessment.passingScore,
    };
  }

  const existingModuleProgress = state.moduleProgress[module.id] ?? emptyModuleProgress();

  if (assessment.mode === "module_quiz") {
    existingModuleProgress.quizScore = score;
  }

  if (assessment.mode === "module_test") {
    existingModuleProgress.testScore = score;
  }

  existingModuleProgress.status = getModuleStatus(module, state, existingModuleProgress);
  state.moduleProgress[module.id] = existingModuleProgress;

  if (assessment.mode === "review") {
    const currentAssessment = state.assessmentProgress[assessment.id] ?? emptyAssessmentProgress();
    state.assessmentProgress[assessment.id] = {
      score,
      passed: score >= assessment.passingScore,
      attempts: currentAssessment.attempts + 1,
      lastAttemptAt: new Date().toISOString(),
    };
  }

  const attempt: PendingAttempt = {
    id: `${assessment.id}-${Date.now()}`,
    assessmentId: assessment.id,
    assessmentMode: assessment.mode,
    moduleId: assessment.scopeModuleIds.length === 1 ? assessment.scopeModuleIds[0] : null,
    scopeModuleIds: assessment.scopeModuleIds,
    score,
    answers,
    createdAt: new Date().toISOString(),
  };

  state.pendingAttempts.push(attempt);
  await saveProgressState(state);

  return { score, total, correct, state, attempt };
}

export async function markPendingAttemptsSynced(attemptIds: string[]) {
  const state = await loadProgressState();
  state.pendingAttempts = state.pendingAttempts.filter(
    (attempt) => !attemptIds.includes(attempt.id),
  );
  await saveProgressState(state);
  return state;
}

function getModuleStatus(
  module: ModuleBundle,
  state: LocalProgressState,
  moduleProgress: ModuleProgress,
): ModuleProgress["status"] {
  const allLearned = module.objectives.every(
    (objective) => state.objectiveProgress[objective.id]?.learned,
  );
  const allCards = module.objectives.every(
    (objective) => state.objectiveProgress[objective.id]?.flashcardsReviewed,
  );
  const allSectionsPassed = module.checkpoints.every(
    (checkpoint) =>
      state.sectionProgress[checkpoint.id.replace("checkpoint-", "")]?.passed,
  );

  if (moduleProgress.testScore !== undefined) {
    if (moduleProgress.testScore >= 85) {
      return "mastered";
    }

    if (moduleProgress.testScore >= 75) {
      return "passed";
    }
  }

  if (allSectionsPassed && moduleProgress.quizScore !== undefined && moduleProgress.quizScore < 75) {
    return "needs_review";
  }

  if (allLearned || allCards || allSectionsPassed) {
    return "learning";
  }

  return "not_started";
}

export function isAssessmentUnlocked(
  assessment: AssessmentBundle,
  state: LocalProgressState,
): boolean {
  if (!assessment.unlockRule) {
    return true;
  }

  if (assessment.unlockRule.type === "modules_passed") {
    const passedCount = assessment.unlockRule.moduleIds.filter((moduleId) => {
      const status = state.moduleProgress[moduleId]?.status;
      return status === "passed" || status === "mastered";
    }).length;

    return passedCount >= assessment.unlockRule.minimumPassed;
  }

  return true;
}

export function getRecommendation(
  module: ModuleBundle,
  state: LocalProgressState,
): Recommendation {
  const weakestObjective = [...module.objectives]
    .map((objective) => ({
      objective,
      weaknessWeight: state.objectiveProgress[objective.id]?.weaknessWeight ?? 0,
    }))
    .sort((left, right) => right.weaknessWeight - left.weaknessWeight)[0];

  if (weakestObjective && weakestObjective.weaknessWeight >= 1.5) {
    return {
      title: "Weakness review is your fastest win",
      detail: `Return to ${weakestObjective.objective.title} before taking another full assessment.`,
      actionLabel: "Review objective",
      targetId: weakestObjective.objective.id,
      targetType: "objective",
    };
  }

  const nextObjective = module.objectives.find(
    (objective) => !state.objectiveProgress[objective.id]?.learned,
  );

  if (nextObjective) {
    return {
      title: "Stay in learn mode",
      detail: `Start with ${nextObjective.title} so the later cards and questions stay aligned.`,
      actionLabel: "Open objective",
      targetId: nextObjective.id,
      targetType: "objective",
    };
  }

  const nextCards = module.objectives.find(
    (objective) => !state.objectiveProgress[objective.id]?.flashcardsReviewed,
  );

  if (nextCards) {
    return {
      title: "Lock the facts before quizzing",
      detail: `Flip through the cards for ${nextCards.title} before you move to assessment mode.`,
      actionLabel: "Review cards",
      targetId: nextCards.id,
      targetType: "objective",
    };
  }

  const pendingCheckpoint = module.checkpoints.find(
    (checkpoint) =>
      !state.sectionProgress[checkpoint.id.replace("checkpoint-", "")]?.passed,
  );

  if (pendingCheckpoint) {
    return {
      title: "Checkpoint is next",
      detail: `${pendingCheckpoint.title} is the next gate toward the module quiz.`,
      actionLabel: "Start checkpoint",
      targetId: pendingCheckpoint.id,
      targetType: "checkpoint",
    };
  }

  const moduleProgress = state.moduleProgress[module.id] ?? emptyModuleProgress();

  if (!moduleProgress.quizScore || moduleProgress.quizScore < 75) {
    return {
      title: "Module quiz is unlocked",
      detail: "Take the 12-question module quiz with immediate feedback before the formal test.",
      actionLabel: "Start module quiz",
      targetId: module.moduleQuiz?.id ?? "",
      targetType: "module_quiz",
    };
  }

  if (!moduleProgress.testScore || moduleProgress.testScore < 75) {
    return {
      title: "Module test is your current gate",
      detail: "You need at least 75% on the delayed-feedback module test to unlock the next module.",
      actionLabel: "Start module test",
      targetId: module.moduleTest?.id ?? "",
      targetType: "module_test",
    };
  }

  const cumulativeTarget = module.cumulativeAssessments.find(
    (assessment) =>
      isAssessmentUnlocked(assessment, state) &&
      !state.assessmentProgress[assessment.id]?.passed,
  );

  if (cumulativeTarget) {
    return {
      title: "A cumulative milestone is open",
      detail: `${cumulativeTarget.title} is now available and should be the next readiness check.`,
      actionLabel: "Start review",
      targetId: cumulativeTarget.id,
      targetType: "review",
    };
  }

  return {
    title: "Module complete",
    detail: "You have cleared the current module loop. The next module can now open in the hosted build.",
    actionLabel: "Review strongest misses",
    targetId: module.id,
    targetType: "module_test",
  };
}
