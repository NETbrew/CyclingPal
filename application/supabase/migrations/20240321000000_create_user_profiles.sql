-- Create a table for user profiles
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  date_of_birth date,
  weight decimal,
  ftp integer,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.user_profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.user_profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check ( auth.uid() = id );

-- Create a trigger to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.handle_updated_at(); 