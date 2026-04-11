create schema if not exists app_private;

create extension if not exists pgcrypto;

create table if not exists public.modules (
  id text primary key,
  title text not null,
  short_title text not null,
  sort_order integer not null,
  state text not null check (state in ('ready', 'shell')),
  description text not null,
  official_buckets text[] not null default '{}',
  focus text not null,
  shell_sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sections (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  description text not null,
  estimated_minutes integer not null default 0
);

create table if not exists public.objectives (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  section_id text not null references public.sections(id) on delete cascade,
  title text not null,
  official_period_bucket text not null,
  discipline text not null,
  subtype text not null,
  skill_type text not null,
  exam_task_type text not null,
  mastery_weight numeric not null default 1,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  objective_id text not null references public.objectives(id) on delete cascade,
  concise_explanation text not null,
  key_example text not null,
  exam_clue text not null,
  compare_contrast text not null
);

create unique index if not exists lesson_blocks_objective_id_idx
on public.lesson_blocks (objective_id);

create table if not exists public.flashcards (
  id text primary key,
  objective_id text not null references public.objectives(id) on delete cascade,
  front text not null,
  back text not null,
  direction text not null
);

create table if not exists public.video_support (
  id text primary key,
  objective_id text not null references public.objectives(id) on delete cascade,
  title text not null,
  url text not null,
  watch_for text not null,
  retrieval_prompt text not null
);

create table if not exists public.question_variants (
  id text primary key,
  objective_id text not null references public.objectives(id) on delete cascade,
  mode text not null,
  variant_type text not null,
  prompt text not null,
  choices jsonb not null,
  answer text not null,
  explanation text not null
);

create table if not exists public.source_refs (
  id text primary key,
  label text not null,
  kind text not null,
  citation text not null,
  local_path text,
  notes text
);

create table if not exists public.objective_source_refs (
  objective_id text not null references public.objectives(id) on delete cascade,
  source_ref_id text not null references public.source_refs(id) on delete cascade,
  primary key (objective_id, source_ref_id)
);

create table if not exists public.user_objective_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  objective_id text not null references public.objectives(id) on delete cascade,
  learned boolean not null default false,
  flashcards_reviewed boolean not null default false,
  average_score numeric not null default 0,
  attempts integer not null default 0,
  weakness_weight numeric not null default 0,
  last_score numeric,
  updated_at timestamptz not null default now(),
  primary key (user_id, objective_id)
);

create table if not exists public.user_section_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  section_id text not null references public.sections(id) on delete cascade,
  score numeric,
  passed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, section_id)
);

create table if not exists public.user_module_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  quiz_score numeric,
  test_score numeric,
  status text not null default 'not_started',
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

create table if not exists public.user_attempts (
  id uuid primary key default gen_random_uuid(),
  client_attempt_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text references public.modules(id) on delete cascade,
  assessment_id text not null,
  assessment_mode text not null,
  scope_module_ids text[] not null default '{}',
  score numeric not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, client_attempt_id)
);

alter table public.modules enable row level security;
alter table public.sections enable row level security;
alter table public.objectives enable row level security;
alter table public.lesson_blocks enable row level security;
alter table public.flashcards enable row level security;
alter table public.video_support enable row level security;
alter table public.question_variants enable row level security;
alter table public.source_refs enable row level security;
alter table public.objective_source_refs enable row level security;
alter table public.user_objective_progress enable row level security;
alter table public.user_section_progress enable row level security;
alter table public.user_module_progress enable row level security;
alter table public.user_attempts enable row level security;

create policy "read published modules"
on public.modules for select
using (true);

create policy "read published sections"
on public.sections for select
using (true);

create policy "read published objectives"
on public.objectives for select
using (true);

create policy "read lesson blocks"
on public.lesson_blocks for select
using (true);

create policy "read flashcards"
on public.flashcards for select
using (true);

create policy "read video support"
on public.video_support for select
using (true);

create policy "read question variants"
on public.question_variants for select
using (true);

create policy "read source refs"
on public.source_refs for select
using (true);

create policy "read objective source refs"
on public.objective_source_refs for select
using (true);

create policy "read own objective progress"
on public.user_objective_progress for select
using (auth.uid() = user_id);

create policy "write own objective progress"
on public.user_objective_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "read own section progress"
on public.user_section_progress for select
using (auth.uid() = user_id);

create policy "write own section progress"
on public.user_section_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "read own module progress"
on public.user_module_progress for select
using (auth.uid() = user_id);

create policy "write own module progress"
on public.user_module_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "read own attempts"
on public.user_attempts for select
using (auth.uid() = user_id);

create policy "write own attempts"
on public.user_attempts for insert
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values
  ('lesson-media', 'lesson-media', false),
  ('source-library', 'source-library', false),
  ('generated-assets', 'generated-assets', false)
on conflict (id) do nothing;

create policy "lesson-media authenticated read"
on storage.objects for select
using (bucket_id = 'lesson-media' and auth.role() = 'authenticated');

create policy "lesson-media authenticated write"
on storage.objects for insert
with check (bucket_id = 'lesson-media' and auth.role() = 'authenticated');

create policy "generated-assets authenticated read"
on storage.objects for select
using (bucket_id = 'generated-assets' and auth.role() = 'authenticated');

create policy "generated-assets authenticated write"
on storage.objects for insert
with check (bucket_id = 'generated-assets' and auth.role() = 'authenticated');

create policy "source-library private read"
on storage.objects for select
using (bucket_id = 'source-library' and auth.role() = 'authenticated');

create policy "source-library private write"
on storage.objects for insert
with check (bucket_id = 'source-library' and auth.role() = 'authenticated');
