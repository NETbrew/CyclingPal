-- Training Plans Table
CREATE TABLE IF NOT EXISTS training_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_json jsonb NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    goal text NOT NULL,
    days_per_week int NOT NULL,
    status text NOT NULL CHECK (status IN ('draft', 'active', 'paid', 'archived')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Only one active plan per user
CREATE UNIQUE INDEX IF NOT EXISTS one_active_plan_per_user ON training_plans(user_id) WHERE status = 'active';

-- Training Results Table
CREATE TABLE IF NOT EXISTS training_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid REFERENCES training_plans(id) ON DELETE CASCADE,
    workout_id text NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    date date NOT NULL,
    duration interval,
    distance float,
    avg_speed float,
    calories int,
    elevation_gain int,
    tss int,
    if float,
    normalized_power int,
    work float,
    hr_min int,
    hr_max int,
    power_min int,
    power_max int,
    created_at timestamptz DEFAULT now()
);

-- Ensure only one result per workout per user per date
CREATE UNIQUE INDEX IF NOT EXISTS one_result_per_workout_per_user_per_date ON training_results(user_id, plan_id, workout_id, date); 