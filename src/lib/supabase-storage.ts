// MM Health Tracker - Supabase Database Storage Layer
// New implementation using Supabase for all data persistence

import { createClientSupabase } from '@/lib/supabase/client'
import { createServerSupabase } from '@/lib/supabase/server'
import { UserProfile, DailyEntry, CalorieEntry, ExerciseEntry } from '@/types'
import type { Database } from '@/lib/supabase/types'

// Helper to get authenticated Supabase client
async function getSupabaseClient() {
  if (typeof window !== 'undefined') {
    return createClientSupabase()
  } else {
    return createServerSupabase()
  }
}

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  const supabase = await getSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

// Utility functions
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getWeekStartDate(date: string): string {
  const d = new Date(date + 'T12:00:00')
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().split('T')[0]
}

// Profile Storage
export const profileStorage = {
  async get(): Promise<UserProfile | null> {
    const userId = await getCurrentUserId()
    if (!userId) return null

    const supabase = await getSupabaseClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) return null

    return {
      id: data.user_id,
      name: data.name,
      email: data.email,
      age: data.age,
      gender: data.gender as 'male' | 'female' | 'other',
      height: data.height_cm,
      weight: data.current_weight_kg,
      activityLevel: data.activity_level as UserProfile['activityLevel'],
      bmr: data.bmr,
      tdee: data.tdee,
      calorieTarget: data.calorie_target,
      proteinTarget: data.protein_target_g,
      carbsTarget: data.carbs_target_g,
      fatsTarget: data.fats_target_g,
      units: data.units as 'metric' | 'imperial',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    }
  },

  async save(profile: UserProfile): Promise<void> {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('User not authenticated')

    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        name: profile.name,
        email: profile.email,
        age: profile.age,
        gender: profile.gender,
        height_cm: profile.height,
        current_weight_kg: profile.weight,
        activity_level: profile.activityLevel,
        bmr: profile.bmr,
        tdee: profile.tdee,
        calorie_target: profile.calorieTarget,
        protein_target_g: profile.proteinTarget,
        carbs_target_g: profile.carbsTarget,
        fats_target_g: profile.fatsTarget,
        units: profile.units,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
  },

  async update(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const existing = await this.get()
    if (!existing) return null

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    }

    await this.save(updated)
    return updated
  },

  async create(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('User not authenticated')

    const profile: UserProfile = {
      ...profileData,
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await this.save(profile)
    return profile
  },

  async isComplete(): Promise<boolean> {
    const profile = await this.get()
    if (!profile) return false

    return !!(
      profile.bmr && profile.bmr > 0 &&
      profile.height && profile.height > 0 &&
      profile.weight && profile.weight > 0 &&
      profile.gender
    )
  }
}

// Daily Entry Storage
export const dailyEntryStorage = {
  async getByDate(date: string): Promise<DailyEntry | null> {
    const userId = await getCurrentUserId()
    if (!userId) return null

    const supabase = await getSupabaseClient()

    // Get daily entry
    const { data: dailyData, error: dailyError } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (dailyError || !dailyData) return null

    // Get related food entries
    const { data: foodEntries } = await supabase
      .from('food_entries')
      .select('*')
      .eq('daily_entry_id', dailyData.id)
      .order('consumed_at', { ascending: true })

    // Get related exercise entries
    const { data: exerciseEntries } = await supabase
      .from('exercise_entries')
      .select('*')
      .eq('daily_entry_id', dailyData.id)
      .order('performed_at', { ascending: true })

    // Convert to DailyEntry format
    const calories: CalorieEntry[] = (foodEntries || []).map(food => ({
      id: food.id,
      food: food.name,
      calories: food.calories,
      protein: food.protein_g,
      carbs: food.carbs_g,
      fat: food.fats_g,
      timestamp: new Date(food.consumed_at)
    }))

    const exercises: ExerciseEntry[] = (exerciseEntries || []).map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      duration: exercise.duration_minutes,
      caloriesBurned: exercise.calories_burned,
      timestamp: new Date(exercise.performed_at)
    }))

    return {
      id: dailyData.id,
      date: dailyData.date,
      weight: dailyData.weight_kg,
      calories,
      exercises,
      deepWorkCompleted: dailyData.deep_work_completed,
      injections: [], // Will implement separately
      mits: dailyData.mit_task_1 ? [
        { id: '1', task: dailyData.mit_task_1, completed: dailyData.mit_task_1_completed },
        ...(dailyData.mit_task_2 ? [{ id: '2', task: dailyData.mit_task_2, completed: dailyData.mit_task_2_completed }] : []),
        ...(dailyData.mit_task_3 ? [{ id: '3', task: dailyData.mit_task_3, completed: dailyData.mit_task_3_completed }] : [])
      ] : [],
      createdAt: new Date(dailyData.created_at),
      updatedAt: new Date(dailyData.updated_at)
    }
  },

  async createOrUpdate(date: string, updates: Partial<DailyEntry>): Promise<DailyEntry> {
    const existing = await this.getByDate(date)
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('User not authenticated')

    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date()
      }
      await this.save(updated)
      return updated
    } else {
      const newEntry: DailyEntry = {
        id: crypto.randomUUID(),
        date,
        calories: [],
        exercises: [],
        weight: undefined,
        deepWorkCompleted: false,
        injections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updates
      }
      await this.save(newEntry)
      return newEntry
    }
  },

  async save(entry: DailyEntry): Promise<void> {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('User not authenticated')

    const supabase = await getSupabaseClient()

    // Calculate totals from arrays
    const totalCalories = entry.calories.reduce((sum, cal) => sum + cal.calories, 0)
    const totalProtein = entry.calories.reduce((sum, cal) => sum + cal.protein, 0)
    const totalCarbs = entry.calories.reduce((sum, cal) => sum + cal.carbs, 0)
    const totalFats = entry.calories.reduce((sum, cal) => sum + cal.fat, 0)
    const totalExerciseCalories = entry.exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0)

    // Upsert daily entry
    const { data: dailyData, error: dailyError } = await supabase
      .from('daily_entries')
      .upsert({
        id: entry.id,
        user_id: userId,
        date: entry.date,
        weight_kg: entry.weight,
        calories_consumed: totalCalories,
        calories_burned_exercise: totalExerciseCalories,
        calories_burned_bmr: 0, // Will calculate from profile
        protein_consumed_g: Math.round(totalProtein),
        carbs_consumed_g: Math.round(totalCarbs),
        fats_consumed_g: Math.round(totalFats),
        mit_task_1: entry.mits?.[0]?.task || null,
        mit_task_1_completed: entry.mits?.[0]?.completed || false,
        mit_task_2: entry.mits?.[1]?.task || null,
        mit_task_2_completed: entry.mits?.[1]?.completed || false,
        mit_task_3: entry.mits?.[2]?.task || null,
        mit_task_3_completed: entry.mits?.[2]?.completed || false,
        deep_work_completed: entry.deepWorkCompleted,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dailyError) throw dailyError

    // Clear existing food entries and insert new ones
    await supabase.from('food_entries').delete().eq('daily_entry_id', dailyData.id)

    if (entry.calories.length > 0) {
      const foodInserts = entry.calories.map(cal => ({
        user_id: userId,
        daily_entry_id: dailyData.id,
        name: cal.food,
        calories: cal.calories,
        protein_g: cal.protein,
        carbs_g: cal.carbs,
        fats_g: cal.fat,
        amount: 1,
        unit: 'serving',
        meal_type: 'snack' as const,
        consumed_at: cal.timestamp.toISOString()
      }))

      const { error: foodError } = await supabase.from('food_entries').insert(foodInserts)
      if (foodError) throw foodError
    }

    // Clear existing exercise entries and insert new ones
    await supabase.from('exercise_entries').delete().eq('daily_entry_id', dailyData.id)

    if (entry.exercises.length > 0) {
      const exerciseInserts = entry.exercises.map(ex => ({
        user_id: userId,
        daily_entry_id: dailyData.id,
        name: ex.name,
        category: 'cardio' as const,
        met_value: 5, // Default MET value
        duration_minutes: ex.duration,
        calories_burned: ex.caloriesBurned,
        intensity: 'moderate' as const,
        performed_at: ex.timestamp.toISOString()
      }))

      const { error: exerciseError } = await supabase.from('exercise_entries').insert(exerciseInserts)
      if (exerciseError) throw exerciseError
    }
  },

  async addCalorieEntry(date: string, calorieData: Omit<CalorieEntry, 'id' | 'timestamp'>): Promise<DailyEntry> {
    const entry = await this.getByDate(date) || await this.createOrUpdate(date, {})

    const newCalorieEntry: CalorieEntry = {
      ...calorieData,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }

    const updatedCalories = [...entry.calories, newCalorieEntry]
    return this.createOrUpdate(date, { calories: updatedCalories })
  },

  async addExerciseEntry(date: string, exerciseData: Omit<ExerciseEntry, 'id' | 'timestamp'>): Promise<DailyEntry> {
    const entry = await this.getByDate(date) || await this.createOrUpdate(date, {})

    const newExerciseEntry: ExerciseEntry = {
      ...exerciseData,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }

    const updatedExercises = [...entry.exercises, newExerciseEntry]
    return this.createOrUpdate(date, { exercises: updatedExercises })
  },

  async updateWeight(date: string, weight: number): Promise<DailyEntry> {
    return this.createOrUpdate(date, { weight })
  },

  async toggleDeepWork(date: string): Promise<DailyEntry> {
    const entry = await this.getByDate(date) || await this.createOrUpdate(date, {})
    return this.createOrUpdate(date, { deepWorkCompleted: !entry.deepWorkCompleted })
  }
}

// Data calculations
export const calculations = {
  async calculateDailyMetrics(date: string, bmr: number) {
    const entry = await dailyEntryStorage.getByDate(date)
    if (!entry) {
      return {
        totalCaloriesConsumed: 0,
        totalCaloriesBurned: 0,
        calorieBalance: bmr,
        macros: { carbs: 0, protein: 0, fat: 0 },
        completionStatus: {
          calories: false,
          exercise: false,
          weight: false,
          deepWork: false,
          mits: false
        }
      }
    }

    const totalCaloriesConsumed = entry.calories.reduce((sum, cal) => sum + cal.calories, 0)
    const totalCaloriesBurned = entry.exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0)
    const calorieBalance = bmr - totalCaloriesConsumed + totalCaloriesBurned

    const macros = entry.calories.reduce(
      (totals, cal) => ({
        carbs: totals.carbs + cal.carbs,
        protein: totals.protein + cal.protein,
        fat: totals.fat + cal.fat
      }),
      { carbs: 0, protein: 0, fat: 0 }
    )

    // Check tomorrow's MIT planning
    const tomorrow = new Date(date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDateString = tomorrow.toISOString().split('T')[0]
    const tomorrowEntry = await dailyEntryStorage.getByDate(tomorrowDateString)

    const completionStatus = {
      calories: entry.calories.length > 0,
      exercise: entry.exercises.length > 0,
      weight: entry.weight !== undefined,
      deepWork: entry.deepWorkCompleted,
      mits: tomorrowEntry?.mits !== undefined && tomorrowEntry.mits.length > 0
    }

    return {
      totalCaloriesConsumed,
      totalCaloriesBurned,
      calorieBalance,
      macros,
      completionStatus
    }
  }
}

// Export utilities for backward compatibility
export { getSupabaseClient, getCurrentUserId }