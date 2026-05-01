-- Create posts table used by dashboard analytics and history.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text,
  platform text,
  style text,
  repo_name text,
  commit_count integer,
  created_at timestamptz not null default now()
);

create index if not exists posts_user_id_created_at_idx
  on public.posts (user_id, created_at desc);

alter table public.posts enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'posts'
      and policyname = 'Users can read own posts'
  ) then
    create policy "Users can read own posts"
      on public.posts
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'posts'
      and policyname = 'Users can insert own posts'
  ) then
    create policy "Users can insert own posts"
      on public.posts
      for insert
      with check (auth.uid() = user_id);
  end if;
end $$;
