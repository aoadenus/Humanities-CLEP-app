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
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const appBaseUrl = requireEnv("APP_BASE_URL");

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const tableChecks = [
    "modules",
    "sections",
    "objectives",
    "lesson_blocks",
    "flashcards",
    "video_support",
    "question_variants",
    "source_refs",
    "objective_source_refs",
    "user_objective_progress",
    "user_section_progress",
    "user_module_progress",
    "user_attempts",
  ];

  console.log("Checking Supabase tables with service-role access...");

  for (const table of tableChecks) {
    const { count, error } = await serviceClient
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`${table}: ${error.message}`);
    }

    console.log(`- ${table}: ok (${count ?? 0} rows)`);
  }

  console.log("Checking public content readability with anon access...");

  for (const table of [
    "modules",
    "sections",
    "objectives",
    "lesson_blocks",
    "flashcards",
    "video_support",
    "question_variants",
    "source_refs",
    "objective_source_refs",
  ]) {
    const { error } = await anonClient.from(table).select("*", { head: true }).limit(1);

    if (error) {
      throw new Error(`${table} anon read failed: ${error.message}`);
    }

    console.log(`- ${table}: anon read ok`);
  }

  const { data: buckets, error: bucketError } = await serviceClient.storage.listBuckets();

  if (bucketError) {
    throw new Error(`storage buckets: ${bucketError.message}`);
  }

  const bucketIds = new Set((buckets ?? []).map((bucket) => bucket.id));
  const requiredBuckets = ["lesson-media", "source-library", "generated-assets"];

  for (const bucket of requiredBuckets) {
    if (!bucketIds.has(bucket)) {
      throw new Error(`Missing storage bucket: ${bucket}`);
    }

    console.log(`- storage bucket: ${bucket} ok`);
  }

  const { count: moduleCount, error: moduleCountError } = await serviceClient
    .from("modules")
    .select("*", { count: "exact", head: true });
  const { count: objectiveCount, error: objectiveCountError } = await serviceClient
    .from("objectives")
    .select("*", { count: "exact", head: true });

  if (moduleCountError) {
    throw new Error(`modules count failed: ${moduleCountError.message}`);
  }

  if (objectiveCountError) {
    throw new Error(`objectives count failed: ${objectiveCountError.message}`);
  }

  console.log("");
  console.log("Hosted setup check passed.");
  console.log(`- App base URL: ${appBaseUrl}`);
  console.log("- Add these auth redirect URLs in Supabase:");
  console.log(`  - ${appBaseUrl}`);
  console.log("  - http://localhost:3000");
  console.log(`- Published module rows: ${moduleCount ?? 0}`);
  console.log(`- Published objective rows: ${objectiveCount ?? 0}`);
  console.log("- If objective rows are 0, run `npm run publish:content`.");
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
