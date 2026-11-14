create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('landscape','program','news','team','library')),
  title_es text not null default '',
  title_en text not null default '',
  body_es text not null default '',
  body_en text not null default '',
  images text[] not null default '{}',
  landscape_ref text,
  youtube_url text,
  file_url text,
  file_name text,
  created_at timestamptz not null default now()
);
grant select on public.content_items to anon, authenticated;
grant insert, update, delete on public.content_items to authenticated;
grant all on public.content_items to service_role;
alter table public.content_items enable row level security;
create policy "Public can read content" on public.content_items for select to anon, authenticated using (true);
create policy "Admins insert content" on public.content_items for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update content" on public.content_items for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete content" on public.content_items for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Public read media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "Admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));