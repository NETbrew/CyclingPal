-- Create a table for training plans
create table if not exists public.training_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal_type text not null,
  goal_description text not null,
  finish_date date not null,
  training_days_per_week integer not null check (training_days_per_week between 1 and 7),
  package_type text not null check (package_type in ('basic', 'premium')),
  status text not null check (status in ('active', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.training_plans enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own training plans" on public.training_plans;
drop policy if exists "Users can insert their own training plans" on public.training_plans;
drop policy if exists "Users can update their own training plans" on public.training_plans;

-- Create policies
create policy "Users can view their own training plans"
  on public.training_plans for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own training plans"
  on public.training_plans for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own training plans"
  on public.training_plans for update
  using ( auth.uid() = user_id );

-- Create a trigger to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_updated_at on public.training_plans;
create trigger handle_updated_at
  before update on public.training_plans
  for each row
  execute function public.handle_updated_at(); 