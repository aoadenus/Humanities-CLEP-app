import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(scriptDir, "..");

function loadEnvFile(filename: string) {
  const fullPath = resolve(appDir, filename);

  if (!existsSync(fullPath)) {
    return;
  }

  const content = readFileSync(fullPath, "utf-8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^"(.*)"$/, "$1");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const course = await import("../src/content/course.js");
  const { getModuleSummaries, getModuleBundle, getSourceRefsForObjective } = course;

  const summaries = getModuleSummaries();
  const bundles = summaries
    .map((summary: ReturnType<typeof getModuleSummaries>[number]) => getModuleBundle(summary.id))
    .filter((bundle: unknown): bundle is NonNullable<typeof bundle> => Boolean(bundle));

  const modules = bundles.map((bundle) => ({
    id: bundle.id,
    title: bundle.title,
    short_title: bundle.shortTitle,
    sort_order: bundle.order,
    state: bundle.state,
    description: bundle.description,
    official_buckets: bundle.officialBuckets,
    focus: bundle.focus,
    shell_sections: bundle.shellSections ?? [],
  }));
  const sections = bundles.flatMap((bundle) =>
    bundle.sections.map((section) => ({
      id: section.id,
      module_id: section.moduleId,
      title: section.title,
      description: section.description,
      estimated_minutes: section.estimatedMinutes,
    })),
  );
  const objectives = bundles.flatMap((bundle) =>
    bundle.objectives.map((objective) => ({
      id: objective.id,
      module_id: objective.moduleId,
      section_id: objective.sectionId,
      title: objective.title,
      official_period_bucket: objective.officialPeriodBucket,
      discipline: objective.discipline,
      subtype: objective.subtype,
      skill_type: objective.skillType,
      exam_task_type: objective.examTaskType,
      mastery_weight: objective.masteryWeight,
      tags: objective.tags,
    })),
  );
  const lessonBlocks = bundles.flatMap((bundle) =>
    bundle.objectives.map((objective) => ({
      objective_id: objective.id,
      concise_explanation: objective.learn.conciseExplanation,
      key_example: objective.learn.keyExample,
      exam_clue: objective.learn.examClue,
      compare_contrast: objective.learn.compareContrast,
    })),
  );
  const flashcards = bundles.flatMap((bundle) =>
    bundle.objectives.flatMap((objective) =>
      objective.flashcards.map((card) => ({
        id: card.id,
        objective_id: objective.id,
        front: card.front,
        back: card.back,
        direction: card.direction,
      })),
    ),
  );
  const videos = bundles.flatMap((bundle) =>
    bundle.objectives.flatMap((objective) =>
      objective.videos.map((video) => ({
        id: video.id,
        objective_id: objective.id,
        title: video.title,
        url: video.url,
        watch_for: video.watchFor,
        retrieval_prompt: video.retrievalPrompt,
      })),
    ),
  );
  const questionVariants = bundles.flatMap((bundle) =>
    bundle.objectives.flatMap((objective) =>
      [...objective.quizVariants, objective.testVariant].map((variant) => ({
        id: variant.id,
        objective_id: objective.id,
        mode: variant.mode,
        variant_type: variant.variantType,
        prompt: variant.prompt,
        choices: variant.choices,
        answer: variant.answer,
        explanation: variant.explanation,
      })),
    ),
  );

  const sourceRefMap = new Map<string, ReturnType<typeof getSourceRefsForObjective>[number]>();
  const objectiveSourceRefs = bundles.flatMap((bundle) =>
    bundle.objectives.flatMap((objective) =>
      getSourceRefsForObjective(objective).map((sourceRef) => {
        sourceRefMap.set(sourceRef.id, sourceRef);

        return {
          objective_id: objective.id,
          source_ref_id: sourceRef.id,
        };
      }),
    ),
  );
  const sourceRefs = [...sourceRefMap.values()].map((sourceRef) => ({
    id: sourceRef.id,
    label: sourceRef.label,
    kind: sourceRef.kind,
    citation: sourceRef.citation,
    local_path: sourceRef.localPath ?? null,
    notes: sourceRef.notes ?? null,
  }));

  // Must run in FK dependency order (modules → sections → objectives → children)
  const steps: Array<{ name: string; run: () => Promise<{ error: { message: string } | null }> }> = [
    { name: "modules", run: () => modules.length ? client.from("modules").upsert(modules, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "sections", run: () => sections.length ? client.from("sections").upsert(sections, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "objectives", run: () => objectives.length ? client.from("objectives").upsert(objectives, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "lesson_blocks", run: () => lessonBlocks.length ? client.from("lesson_blocks").upsert(lessonBlocks, { onConflict: "objective_id" }) : Promise.resolve({ error: null }) },
    { name: "flashcards", run: () => flashcards.length ? client.from("flashcards").upsert(flashcards, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "video_support", run: () => videos.length ? client.from("video_support").upsert(videos, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "question_variants", run: () => questionVariants.length ? client.from("question_variants").upsert(questionVariants, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "source_refs", run: () => sourceRefs.length ? client.from("source_refs").upsert(sourceRefs, { onConflict: "id" }) : Promise.resolve({ error: null }) },
    { name: "objective_source_refs", run: () => objectiveSourceRefs.length ? client.from("objective_source_refs").upsert(objectiveSourceRefs, { onConflict: "objective_id,source_ref_id" }) : Promise.resolve({ error: null }) },
  ];

  for (const step of steps) {
    const { error } = await step.run();

    if (error) {
      throw new Error(`${step.name}: ${error.message}`);
    }
  }

  console.log("Published course content to Supabase.");
  console.log(`Modules: ${modules.length}`);
  console.log(`Sections: ${sections.length}`);
  console.log(`Objectives: ${objectives.length}`);
  console.log(`Question variants: ${questionVariants.length}`);
  console.log(`Source refs: ${sourceRefs.length}`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
