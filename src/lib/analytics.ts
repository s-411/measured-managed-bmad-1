import { createClientSupabase } from './supabase/client'
import type { Database } from './supabase/types'

type SupabaseClient = ReturnType<typeof createClientSupabase>

export interface AnalyticsOverview {
  currentWeight: number | null
  weightChange7Days: number | null
  weightChange30Days: number | null
  avgCalorieBalance7Days: number | null
  avgCalorieBalance30Days: number | null
  mitCompletionRate7Days: number
  mitCompletionRate30Days: number
  deepWorkStreak: number
  totalWorkouts7Days: number
  totalWorkouts30Days: number
  injectionAdherence7Days: number
  nirvanaSessions7Days: number
  activeMilestones: number
}

export interface WeightData {
  date: string
  weight: number
}

export interface CalorieData {
  date: string
  consumed: number
  burned: number
  balance: number
  bmr: number
}

export interface MacroData {
  date: string
  protein: number
  carbs: number
  fats: number
  proteinTarget: number
  carbsTarget: number
  fatsTarget: number
}

export interface WorkoutData {
  date: string
  totalCalories: number
  duration: number
  exerciseCount: number
  categories: string[]
}

export interface InjectionData {
  date: string
  totalDose: number
  compounds: string[]
  adherenceScore: number
}

export interface ProductivityData {
  date: string
  mitCompleted: number
  mitTotal: number
  deepWorkCompleted: boolean
}

export class AnalyticsService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClientSupabase()
  }

  async getOverview(userId: string, days: number = 30): Promise<AnalyticsOverview> {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))
    const startDate7 = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000))

    const [
      weightData,
      calorieData,
      mitData,
      workoutData,
      injectionData,
      nirvanaData,
      milestoneData
    ] = await Promise.all([
      this.getWeightTrend(userId, days + 30),
      this.getCalorieBalance(userId, days),
      this.getMITCompletion(userId, days),
      this.getWorkoutSummary(userId, days),
      this.getInjectionAdherence(userId, days),
      this.getNirvanaSessions(userId, days),
      this.getActiveMilestones(userId)
    ])

    const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : null
    const weight7DaysAgo = weightData.find(w => new Date(w.date) <= startDate7)?.weight
    const weight30DaysAgo = weightData.find(w => new Date(w.date) <= startDate)?.weight

    const recent7Days = calorieData.filter(d => new Date(d.date) >= startDate7)
    const avgCalorieBalance7Days = recent7Days.length > 0
      ? recent7Days.reduce((sum, d) => sum + d.balance, 0) / recent7Days.length
      : null

    const avgCalorieBalance30Days = calorieData.length > 0
      ? calorieData.reduce((sum, d) => sum + d.balance, 0) / calorieData.length
      : null

    const mitData7Days = mitData.filter(d => new Date(d.date) >= startDate7)
    const mitCompletionRate7Days = mitData7Days.length > 0
      ? mitData7Days.reduce((sum, d) => sum + (d.mitCompleted / d.mitTotal), 0) / mitData7Days.length * 100
      : 0

    const mitCompletionRate30Days = mitData.length > 0
      ? mitData.reduce((sum, d) => sum + (d.mitCompleted / d.mitTotal), 0) / mitData.length * 100
      : 0

    const deepWorkStreak = this.calculateDeepWorkStreak(mitData)

    const workoutData7Days = workoutData.filter(d => new Date(d.date) >= startDate7)
    const totalWorkouts7Days = workoutData7Days.reduce((sum, d) => sum + d.exerciseCount, 0)
    const totalWorkouts30Days = workoutData.reduce((sum, d) => sum + d.exerciseCount, 0)

    const injectionData7Days = injectionData.filter(d => new Date(d.date) >= startDate7)
    const injectionAdherence7Days = injectionData7Days.length > 0
      ? injectionData7Days.reduce((sum, d) => sum + d.adherenceScore, 0) / injectionData7Days.length
      : 0

    const nirvanaData7Days = nirvanaData.filter(d => new Date(d.date) >= startDate7)
    const nirvanaSessions7Days = nirvanaData7Days.length

    return {
      currentWeight,
      weightChange7Days: currentWeight && weight7DaysAgo ? currentWeight - weight7DaysAgo : null,
      weightChange30Days: currentWeight && weight30DaysAgo ? currentWeight - weight30DaysAgo : null,
      avgCalorieBalance7Days,
      avgCalorieBalance30Days,
      mitCompletionRate7Days,
      mitCompletionRate30Days,
      deepWorkStreak,
      totalWorkouts7Days,
      totalWorkouts30Days,
      injectionAdherence7Days,
      nirvanaSessions7Days,
      activeMilestones: milestoneData.filter(m => !m.is_completed).length
    }
  }

  async getWeightTrend(userId: string, days: number = 30): Promise<WeightData[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('daily_entries')
      .select('date, weight_kg')
      .eq('user_id', userId)
      .gte('date', startDate)
      .not('weight_kg', 'is', null)
      .order('date', { ascending: true })

    if (error) throw error

    return data.map(item => ({
      date: item.date,
      weight: item.weight_kg!
    }))
  }

  async getCalorieBalance(userId: string, days: number = 30): Promise<CalorieData[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('daily_entries')
      .select('date, calories_consumed, calories_burned_exercise, calories_burned_bmr, calorie_balance')
      .eq('user_id', userId)
      .gte('date', startDate)
      .order('date', { ascending: true })

    if (error) throw error

    return data.map(item => ({
      date: item.date,
      consumed: item.calories_consumed,
      burned: item.calories_burned_exercise,
      balance: item.calorie_balance || 0,
      bmr: item.calories_burned_bmr
    }))
  }

  async getMacroTrend(userId: string, days: number = 30): Promise<MacroData[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const [dailyData, profileData] = await Promise.all([
      this.supabase
        .from('daily_entries')
        .select('date, protein_consumed_g, carbs_consumed_g, fats_consumed_g')
        .eq('user_id', userId)
        .gte('date', startDate)
        .order('date', { ascending: true }),

      this.supabase
        .from('user_profiles')
        .select('protein_target_g, carbs_target_g, fats_target_g')
        .eq('user_id', userId)
        .single()
    ])

    if (dailyData.error) throw dailyData.error
    if (profileData.error) throw profileData.error

    const targets = profileData.data
    return dailyData.data.map(item => ({
      date: item.date,
      protein: item.protein_consumed_g,
      carbs: item.carbs_consumed_g,
      fats: item.fats_consumed_g,
      proteinTarget: targets.protein_target_g,
      carbsTarget: targets.carbs_target_g,
      fatsTarget: targets.fats_target_g
    }))
  }

  async getWorkoutSummary(userId: string, days: number = 30): Promise<WorkoutData[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('exercise_entries')
      .select('performed_at, calories_burned, duration_minutes, category, name')
      .eq('user_id', userId)
      .gte('performed_at', startDate)
      .order('performed_at', { ascending: true })

    if (error) throw error

    const dailyWorkouts = data.reduce((acc, exercise) => {
      const date = exercise.performed_at.split('T')[0]
      if (!acc[date]) {
        acc[date] = {
          date,
          totalCalories: 0,
          duration: 0,
          exerciseCount: 0,
          categories: new Set<string>()
        }
      }
      acc[date].totalCalories += exercise.calories_burned
      acc[date].duration += exercise.duration_minutes
      acc[date].exerciseCount += 1
      acc[date].categories.add(exercise.category)
      return acc
    }, {} as Record<string, any>)

    return Object.values(dailyWorkouts).map(day => ({
      ...day,
      categories: Array.from(day.categories)
    }))
  }

  async getInjectionAdherence(userId: string, days: number = 30): Promise<InjectionData[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const [injectionData, compoundData] = await Promise.all([
      this.supabase
        .from('injection_entries')
        .select('injection_date, dose_mg, compound_id, injectable_compounds(name, weekly_target_mg)')
        .eq('user_id', userId)
        .gte('injection_date', startDate)
        .order('injection_date', { ascending: true }),

      this.supabase
        .from('injectable_compounds')
        .select('id, name, weekly_target_mg')
        .eq('user_id', userId)
    ])

    if (injectionData.error) throw injectionData.error
    if (compoundData.error) throw compoundData.error

    const dailyInjections = injectionData.data.reduce((acc, injection) => {
      const date = injection.injection_date
      if (!acc[date]) {
        acc[date] = {
          date,
          totalDose: 0,
          compounds: new Set<string>(),
          doses: []
        }
      }
      acc[date].totalDose += injection.dose_mg
      acc[date].compounds.add((injection.injectable_compounds as any).name)
      acc[date].doses.push({
        compoundId: injection.compound_id,
        dose: injection.dose_mg,
        target: (injection.injectable_compounds as any).weekly_target_mg
      })
      return acc
    }, {} as Record<string, any>)

    return Object.values(dailyInjections).map(day => {
      const adherenceScore = day.doses.reduce((sum: number, dose: any) => {
        const dailyTarget = dose.target / 7 // Convert weekly to daily
        return sum + Math.min(dose.dose / dailyTarget, 1)
      }, 0) / day.doses.length

      return {
        date: day.date,
        totalDose: day.totalDose,
        compounds: Array.from(day.compounds),
        adherenceScore: adherenceScore * 100
      }
    })
  }

  async getNirvanaSessions(userId: string, days: number = 30): Promise<{ date: string; duration: number; difficulty: string; quality: number }[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('nirvana_sessions')
      .select('session_date, duration_minutes, difficulty, quality_rating')
      .eq('user_id', userId)
      .gte('session_date', startDate)
      .order('session_date', { ascending: true })

    if (error) throw error

    return data.map(session => ({
      date: session.session_date,
      duration: session.duration_minutes,
      difficulty: session.difficulty,
      quality: session.quality_rating
    }))
  }

  async getMITCompletion(userId: string, days: number = 30): Promise<ProductivityData[]> {
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('daily_entries')
      .select('date, mit_task_1_completed, mit_task_2_completed, mit_task_3_completed, deep_work_completed')
      .eq('user_id', userId)
      .gte('date', startDate)
      .order('date', { ascending: true })

    if (error) throw error

    return data.map(entry => {
      const mitCompleted = [
        entry.mit_task_1_completed,
        entry.mit_task_2_completed,
        entry.mit_task_3_completed
      ].filter(Boolean).length

      return {
        date: entry.date,
        mitCompleted,
        mitTotal: 3,
        deepWorkCompleted: entry.deep_work_completed
      }
    })
  }

  async getActiveMilestones(userId: string) {
    const { data, error } = await this.supabase
      .from('progress_milestones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  private calculateDeepWorkStreak(mitData: ProductivityData[]): number {
    let streak = 0
    for (let i = mitData.length - 1; i >= 0; i--) {
      if (mitData[i].deepWorkCompleted) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  async getWeeklyObjectives(userId: string, weeks: number = 8) {
    const startDate = new Date(Date.now() - (weeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('weekly_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('week_start_date', startDate)
      .order('week_start_date', { ascending: true })

    if (error) throw error
    return data
  }
}