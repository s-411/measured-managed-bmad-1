-- MM Health Tracker - Complete Database Schema
-- Clean deployment for fresh Supabase project

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    age INTEGER NOT NULL CHECK (age >= 13 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    height_cm INTEGER NOT NULL CHECK (height_cm >= 100 AND height_cm <= 250),
    current_weight_kg DECIMAL(5,2) NOT NULL CHECK (current_weight_kg > 0),
    activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
    bmr INTEGER NOT NULL CHECK (bmr > 0),
    tdee INTEGER NOT NULL CHECK (tdee > 0),
    calorie_target INTEGER NOT NULL CHECK (calorie_target > 0),
    protein_target_g INTEGER NOT NULL CHECK (protein_target_g >= 0),
    carbs_target_g INTEGER NOT NULL CHECK (carbs_target_g >= 0),
    fats_target_g INTEGER NOT NULL CHECK (fats_target_g >= 0),
    units TEXT NOT NULL DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- DAILY ENTRIES TABLE
-- =====================================================
CREATE TABLE daily_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
    calories_consumed INTEGER NOT NULL DEFAULT 0 CHECK (calories_consumed >= 0),
    calories_burned_exercise INTEGER NOT NULL DEFAULT 0 CHECK (calories_burned_exercise >= 0),
    calories_burned_bmr INTEGER NOT NULL DEFAULT 0 CHECK (calories_burned_bmr >= 0),
    calorie_balance INTEGER GENERATED ALWAYS AS (calories_consumed - calories_burned_bmr - calories_burned_exercise) STORED,
    protein_consumed_g INTEGER NOT NULL DEFAULT 0 CHECK (protein_consumed_g >= 0),
    carbs_consumed_g INTEGER NOT NULL DEFAULT 0 CHECK (carbs_consumed_g >= 0),
    fats_consumed_g INTEGER NOT NULL DEFAULT 0 CHECK (fats_consumed_g >= 0),
    mit_task_1 TEXT,
    mit_task_1_completed BOOLEAN NOT NULL DEFAULT FALSE,
    mit_task_2 TEXT,
    mit_task_2_completed BOOLEAN NOT NULL DEFAULT FALSE,
    mit_task_3 TEXT,
    mit_task_3_completed BOOLEAN NOT NULL DEFAULT FALSE,
    deep_work_completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- =====================================================
-- FOOD ENTRIES TABLE
-- =====================================================
CREATE TABLE food_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein_g DECIMAL(6,2) NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
    carbs_g DECIMAL(6,2) NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
    fats_g DECIMAL(6,2) NOT NULL DEFAULT 0 CHECK (fats_g >= 0),
    amount DECIMAL(8,2) NOT NULL CHECK (amount > 0),
    unit TEXT NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- EXERCISE ENTRIES TABLE
-- =====================================================
CREATE TABLE exercise_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cardio', 'strength', 'sports', 'daily_activities')),
    met_value DECIMAL(4,2) NOT NULL CHECK (met_value > 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    calories_burned INTEGER NOT NULL CHECK (calories_burned >= 0),
    intensity TEXT NOT NULL CHECK (intensity IN ('low', 'moderate', 'high')),
    notes TEXT,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INJECTABLE COMPOUNDS TABLE
-- =====================================================
CREATE TABLE injectable_compounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    concentration DECIMAL(8,2) NOT NULL CHECK (concentration > 0),
    ester_type TEXT NOT NULL CHECK (ester_type IN ('acetate', 'propionate', 'cypionate', 'enanthate', 'decanoate', 'undecanoate')),
    half_life_days DECIMAL(4,1) NOT NULL CHECK (half_life_days > 0),
    category TEXT NOT NULL CHECK (category IN ('trt', 'hrt', 'peptide', 'other')),
    weekly_target_mg DECIMAL(8,2) NOT NULL CHECK (weekly_target_mg > 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INJECTION ENTRIES TABLE
-- =====================================================
CREATE TABLE injection_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    compound_id UUID NOT NULL REFERENCES injectable_compounds(id) ON DELETE CASCADE,
    dose_mg DECIMAL(8,2) NOT NULL CHECK (dose_mg > 0),
    volume_ml DECIMAL(6,3) NOT NULL CHECK (volume_ml > 0),
    injection_site TEXT NOT NULL CHECK (injection_site IN ('left_delt', 'right_delt', 'left_glute', 'right_glute', 'left_quad', 'right_quad', 'subq_abdomen', 'subq_thigh')),
    injection_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- NIRVANA SESSIONS TABLE
-- =====================================================
CREATE TABLE nirvana_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    quality_rating INTEGER NOT NULL CHECK (quality_rating >= 1 AND quality_rating <= 5),
    exercises TEXT[],
    body_parts TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PROGRESS MILESTONES TABLE
-- =====================================================
CREATE TABLE progress_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('strength', 'skill', 'flexibility', 'endurance')),
    description TEXT NOT NULL,
    target_date DATE,
    completed_date DATE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- WEEKLY ENTRIES TABLE
-- =====================================================
CREATE TABLE weekly_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    objective_1 TEXT,
    objective_1_completed BOOLEAN NOT NULL DEFAULT FALSE,
    objective_2 TEXT,
    objective_2_completed BOOLEAN NOT NULL DEFAULT FALSE,
    objective_3 TEXT,
    objective_3_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completion_rate DECIMAL(5,2) CHECK (completion_rate >= 0 AND completion_rate <= 100),
    insights TEXT,
    next_week_focus TEXT,
    review_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, week_start_date)
);

-- =====================================================
-- FOOD TEMPLATES TABLE
-- =====================================================
CREATE TABLE food_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein_g DECIMAL(6,2) NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
    carbs_g DECIMAL(6,2) NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
    fats_g DECIMAL(6,2) NOT NULL DEFAULT 0 CHECK (fats_g >= 0),
    default_amount DECIMAL(8,2) NOT NULL CHECK (default_amount > 0),
    default_unit TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('meal', 'snack', 'drink')),
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE injectable_compounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE injection_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE nirvana_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_templates ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Daily Entries Policies
CREATE POLICY "Users can manage own daily entries" ON daily_entries FOR ALL USING (auth.uid() = user_id);

-- Food Entries Policies
CREATE POLICY "Users can manage own food entries" ON food_entries FOR ALL USING (auth.uid() = user_id);

-- Exercise Entries Policies
CREATE POLICY "Users can manage own exercise entries" ON exercise_entries FOR ALL USING (auth.uid() = user_id);

-- Injectable Compounds Policies
CREATE POLICY "Users can manage own compounds" ON injectable_compounds FOR ALL USING (auth.uid() = user_id);

-- Injection Entries Policies
CREATE POLICY "Users can manage own injections" ON injection_entries FOR ALL USING (auth.uid() = user_id);

-- Nirvana Sessions Policies
CREATE POLICY "Users can manage own nirvana sessions" ON nirvana_sessions FOR ALL USING (auth.uid() = user_id);

-- Progress Milestones Policies
CREATE POLICY "Users can manage own milestones" ON progress_milestones FOR ALL USING (auth.uid() = user_id);

-- Weekly Entries Policies
CREATE POLICY "Users can manage own weekly entries" ON weekly_entries FOR ALL USING (auth.uid() = user_id);

-- Food Templates Policies
CREATE POLICY "Users can manage own food templates" ON food_templates FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Daily entries indexes
CREATE INDEX idx_daily_entries_user_date ON daily_entries(user_id, date DESC);

-- Food entries indexes
CREATE INDEX idx_food_entries_user ON food_entries(user_id);
CREATE INDEX idx_food_entries_daily ON food_entries(daily_entry_id);

-- Exercise entries indexes
CREATE INDEX idx_exercise_entries_user ON exercise_entries(user_id);
CREATE INDEX idx_exercise_entries_daily ON exercise_entries(daily_entry_id);

-- Injectable compounds indexes
CREATE INDEX idx_injectable_compounds_user ON injectable_compounds(user_id);

-- Injection entries indexes
CREATE INDEX idx_injection_entries_user ON injection_entries(user_id);
CREATE INDEX idx_injection_entries_compound ON injection_entries(compound_id);
CREATE INDEX idx_injection_entries_date ON injection_entries(injection_date DESC);

-- Nirvana sessions indexes
CREATE INDEX idx_nirvana_sessions_user ON nirvana_sessions(user_id);
CREATE INDEX idx_nirvana_sessions_date ON nirvana_sessions(session_date DESC);

-- Progress milestones indexes
CREATE INDEX idx_progress_milestones_user ON progress_milestones(user_id);
CREATE INDEX idx_progress_milestones_category ON progress_milestones(category);

-- Weekly entries indexes
CREATE INDEX idx_weekly_entries_user ON weekly_entries(user_id);
CREATE INDEX idx_weekly_entries_week ON weekly_entries(week_start_date DESC);

-- Food templates indexes
CREATE INDEX idx_food_templates_user ON food_templates(user_id);
CREATE INDEX idx_food_templates_usage ON food_templates(usage_count DESC, last_used DESC);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON daily_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_injectable_compounds_updated_at BEFORE UPDATE ON injectable_compounds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_milestones_updated_at BEFORE UPDATE ON progress_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_entries_updated_at BEFORE UPDATE ON weekly_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();