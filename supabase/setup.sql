-- Dedicated vocabulary project. No secret/service-role key is used by the website.
create extension if not exists pgcrypto with schema extensions;
create table if not exists public.vocab_sync_profiles (
 key_hash text primary key check (key_hash ~ '^[a-f0-9]{64}$'),
 reset_at timestamptz not null default '1970-01-01T00:00:00Z'
);
create table if not exists public.vocab_sync_records (
 key_hash text not null references public.vocab_sync_profiles(key_hash),
 id text not null, happened_at timestamptz not null, payload jsonb not null,
 primary key(key_hash,id)
);
create table if not exists public.vocab_sync_answers (
 key_hash text not null references public.vocab_sync_profiles(key_hash),
 id text not null, happened_at timestamptz not null, payload jsonb not null,
 primary key(key_hash,id)
);
alter table public.vocab_sync_profiles enable row level security;
alter table public.vocab_sync_records enable row level security;
alter table public.vocab_sync_answers enable row level security;
revoke all on public.vocab_sync_profiles,public.vocab_sync_records,public.vocab_sync_answers from anon,authenticated;
grant usage on schema extensions to anon;
grant execute on function extensions.digest(text,text) to anon;
grant select,insert,update on public.vocab_sync_profiles to anon;
grant select,insert,delete on public.vocab_sync_records,public.vocab_sync_answers to anon;
create policy vocab_profile_access on public.vocab_sync_profiles for all to anon
using (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex') and (current_setting('request.headers',true)::json->>'x-vocab-key') ~ '^[a-f0-9]{64}$')
with check (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex') and (current_setting('request.headers',true)::json->>'x-vocab-key') ~ '^[a-f0-9]{64}$');
create policy vocab_record_read on public.vocab_sync_records for select to anon
using (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex'));
create policy vocab_record_insert on public.vocab_sync_records for insert to anon
with check (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex') and happened_at >= (select reset_at from public.vocab_sync_profiles p where p.key_hash=vocab_sync_records.key_hash));
create policy vocab_record_delete on public.vocab_sync_records for delete to anon
using (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex'));
create policy vocab_answer_read on public.vocab_sync_answers for select to anon
using (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex'));
create policy vocab_answer_insert on public.vocab_sync_answers for insert to anon
with check (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex') and happened_at >= (select reset_at from public.vocab_sync_profiles p where p.key_hash=vocab_sync_answers.key_hash));
create policy vocab_answer_delete on public.vocab_sync_answers for delete to anon
using (key_hash=encode(extensions.digest((current_setting('request.headers',true)::json->>'x-vocab-key'),'sha256'),'hex'));
notify pgrst,'reload schema';
