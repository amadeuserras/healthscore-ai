-- HealthScore AI Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create biomarker_history table
create table biomarker_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  health_score integer not null,
  biomarker_data jsonb not null,
  analysis_results jsonb not null
);

-- Set up Row Level Security (RLS)
alter table biomarker_history enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view their own biomarker history"
  on biomarker_history for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own data
create policy "Users can insert their own biomarker history"
  on biomarker_history for insert
  with check (auth.uid() = user_id);

-- Create index for better query performance
create index biomarker_history_user_id_idx on biomarker_history(user_id);
create index biomarker_history_created_at_idx on biomarker_history(created_at desc);
