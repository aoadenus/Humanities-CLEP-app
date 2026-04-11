alter table public.modules
  add column if not exists shell_sections jsonb not null default '[]'::jsonb;

create unique index if not exists lesson_blocks_objective_id_idx
  on public.lesson_blocks (objective_id);

alter table public.user_attempts
  add column if not exists client_attempt_id text,
  add column if not exists assessment_mode text,
  add column if not exists scope_module_ids text[] not null default '{}';

alter table public.user_attempts
  alter column module_id drop not null;

update public.user_attempts
set
  client_attempt_id = coalesce(client_attempt_id, id::text),
  assessment_mode = coalesce(assessment_mode, 'review'),
  scope_module_ids = coalesce(scope_module_ids, case when module_id is null then '{}'::text[] else array[module_id] end);

alter table public.user_attempts
  alter column client_attempt_id set not null,
  alter column assessment_mode set not null;

create unique index if not exists user_attempts_user_id_client_attempt_id_idx
  on public.user_attempts (user_id, client_attempt_id);
