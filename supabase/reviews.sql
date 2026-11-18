create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text default 'Nigeria',
  quote text not null,
  rating integer default 5 check (rating between 1 and 5),
  approved boolean default true,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can read approved reviews"
on public.reviews for select
using (approved = true);

create policy "Anyone can insert reviews"
on public.reviews for insert
with check (true);
