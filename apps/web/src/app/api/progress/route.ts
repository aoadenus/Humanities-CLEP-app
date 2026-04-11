import { NextResponse } from "next/server";

import { readServerProgressState, persistProgressSnapshot } from "@/lib/server-progress";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { LocalProgressState } from "@/lib/types";

async function getAuthenticatedClient() {
  if (!hasSupabaseEnv()) {
    return { client: null, userId: null, error: "Supabase is not configured." };
  }

  const client = await createSupabaseServerClient();

  if (!client) {
    return { client: null, userId: null, error: "Supabase is not configured." };
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    return { client: null, userId: null, error: "Authentication required." };
  }

  return { client, userId: user.id, error: null };
}

export async function GET() {
  const { client, userId, error } = await getAuthenticatedClient();

  if (!client || !userId) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const progress = await readServerProgressState(client, userId);
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const { client, userId, error } = await getAuthenticatedClient();

  if (!client || !userId) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const body = (await request.json()) as { progress?: LocalProgressState };

  if (!body.progress) {
    return NextResponse.json({ error: "progress is required." }, { status: 400 });
  }

  await persistProgressSnapshot(client, userId, body.progress);
  const progress = await readServerProgressState(client, userId);

  return NextResponse.json({
    status: "synced",
    progress,
  });
}
