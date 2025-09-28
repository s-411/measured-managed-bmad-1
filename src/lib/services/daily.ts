import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type DailyEntry = Database['public']['Tables']['daily_entries']['Row']
type DailyEntryInsert = Database['public']['Tables']['daily_entries']['Insert']
type DailyEntryUpdate = Database['public']['Tables']['daily_entries']['Update']

export class DailyEntryService {
  private supabase = getSupabaseClient()

  async getDailyEntry(userId: string, date: string): Promise<DailyEntry | null> {
    const { data, error } = await this.supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No entry found for this date
        return null
      }
      throw new Error(`Failed to fetch daily entry: ${error.message}`)
    }

    return data
  }

  async createDailyEntry(entryData: DailyEntryInsert): Promise<DailyEntry> {
    const { data, error } = await this.supabase
      .from('daily_entries')
      .insert(entryData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create daily entry: ${error.message}`)
    }

    return data
  }

  async updateDailyEntry(userId: string, date: string, updates: DailyEntryUpdate): Promise<DailyEntry> {
    const { data, error } = await this.supabase
      .from('daily_entries')
      .update(updates)
      .eq('user_id', userId)
      .eq('date', date)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update daily entry: ${error.message}`)
    }

    return data
  }

  async upsertDailyEntry(userId: string, date: string, entryData: Partial<DailyEntryInsert>): Promise<DailyEntry> {
    // Try to get existing entry
    const existing = await this.getDailyEntry(userId, date)

    if (existing) {
      // Update existing entry
      return this.updateDailyEntry(userId, date, entryData)
    } else {
      // Create new entry
      const newEntry: DailyEntryInsert = {
        user_id: userId,
        date,
        ...entryData
      }
      return this.createDailyEntry(newEntry)
    }
  }

  async getDailyEntries(userId: string, startDate?: string, endDate?: string): Promise<DailyEntry[]> {
    let query = this.supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch daily entries: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get daily entries for the last N days
   */
  async getRecentDailyEntries(userId: string, days: number = 7): Promise<DailyEntry[]> {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    return this.getDailyEntries(userId, startDate, endDate)
  }

  /**
   * Update weight and return the updated entry
   */
  async updateWeight(userId: string, date: string, weight: number): Promise<DailyEntry> {
    return this.upsertDailyEntry(userId, date, { weight_kg: weight })
  }

  /**
   * Update MIT tasks
   */
  async updateMITTasks(userId: string, date: string, mitData: {
    task1?: { description: string; completed: boolean }
    task2?: { description: string; completed: boolean }
    task3?: { description: string; completed: boolean }
  }): Promise<DailyEntry> {
    const updates: Partial<DailyEntryUpdate> = {}

    if (mitData.task1) {
      updates.mit_task_1 = mitData.task1.description
      updates.mit_task_1_completed = mitData.task1.completed
    }

    if (mitData.task2) {
      updates.mit_task_2 = mitData.task2.description
      updates.mit_task_2_completed = mitData.task2.completed
    }

    if (mitData.task3) {
      updates.mit_task_3 = mitData.task3.description
      updates.mit_task_3_completed = mitData.task3.completed
    }

    return this.upsertDailyEntry(userId, date, updates)
  }

  /**
   * Toggle deep work completion
   */
  async toggleDeepWork(userId: string, date: string): Promise<DailyEntry> {
    const existing = await this.getDailyEntry(userId, date)
    const newDeepWorkStatus = existing ? !existing.deep_work_completed : true

    return this.upsertDailyEntry(userId, date, { deep_work_completed: newDeepWorkStatus })
  }

  /**
   * Update notes
   */
  async updateNotes(userId: string, date: string, notes: string): Promise<DailyEntry> {
    return this.upsertDailyEntry(userId, date, { notes })
  }

  /**
   * Calculate daily summary metrics
   */
  calculateDailySummary(entry: DailyEntry, bmr: number) {
    const totalCaloriesConsumed = entry.calories_consumed || 0
    const totalCaloriesBurned = entry.calories_burned_exercise || 0
    const bmrCalories = entry.calories_burned_bmr || bmr

    // Calorie balance: positive means surplus, negative means deficit
    const calorieBalance = totalCaloriesConsumed - bmrCalories - totalCaloriesBurned

    return {
      totalCaloriesConsumed,
      totalCaloriesBurned,
      bmrCalories,
      calorieBalance,
      netCalories: totalCaloriesConsumed - totalCaloriesBurned,
      macros: {
        protein: entry.protein_consumed_g || 0,
        carbs: entry.carbs_consumed_g || 0,
        fats: entry.fats_consumed_g || 0
      },
      mitCompletion: [
        entry.mit_task_1_completed,
        entry.mit_task_2_completed,
        entry.mit_task_3_completed
      ].filter(Boolean).length,
      deepWorkCompleted: entry.deep_work_completed,
      hasWeight: entry.weight_kg !== null
    }
  }
}

export const dailyEntryService = new DailyEntryService()