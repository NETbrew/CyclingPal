// Training Plan Types
export type TrainingPlanStatus = 'draft' | 'active' | 'paid' | 'archived';

export interface TrainingSplit {
    zone: string;
    time: string; // Format: HH:MM:SS
}

export interface TrainingWorkout {
    workout_id: string;
    title: string;
    description: string;
    date: string; // ISO date string, editable by user
    splits: TrainingSplit[];
}

export interface TrainingPlan {
    id: string;
    user_id: string;
    plan_json: TrainingWorkout[];
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    goal: string;
    days_per_week: number;
    status: TrainingPlanStatus;
    created_at: string;
    updated_at: string;
}

export interface TrainingResult {
    id: string;
    plan_id: string;
    workout_id: string;
    user_id: string;
    date: string; // ISO date string
    duration: string; // Format: HH:MM:SS
    distance: number; // km
    avg_speed: number; // km/u
    calories: number; // kcal
    elevation_gain: number; // m
    tss: number; // TSS
    if: number; // IF
    normalized_power: number; // Watt
    work: number; // kilojoels
    hr_min: number; // bpm
    hr_max: number; // bpm
    power_min: number; // Watt
    power_max: number; // Watt
    created_at: string;
} 