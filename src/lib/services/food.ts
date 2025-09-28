import { getSupabaseClient } from '@/lib/supabase/client'
import { dailyEntryService } from './daily'
import type { Database } from '@/lib/supabase/types'

type FoodEntry = Database['public']['Tables']['food_entries']['Row']
type FoodEntryInsert = Database['public']['Tables']['food_entries']['Insert']
type FoodTemplate = Database['public']['Tables']['food_templates']['Row']
type FoodTemplateInsert = Database['public']['Tables']['food_templates']['Insert']

export class FoodService {
  private supabase = getSupabaseClient()

  async addFoodEntry(foodData: {
    userId: string
    date: string
    name: string
    calories: number
    protein_g?: number
    carbs_g?: number
    fats_g?: number
    amount: number
    unit: string
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  }): Promise<FoodEntry> {
    // First, ensure daily entry exists
    let dailyEntry = await dailyEntryService.getDailyEntry(foodData.userId, foodData.date)

    if (!dailyEntry) {
      dailyEntry = await dailyEntryService.upsertDailyEntry(foodData.userId, foodData.date, {})
    }

    // Create food entry
    const foodEntry: FoodEntryInsert = {
      user_id: foodData.userId,
      daily_entry_id: dailyEntry.id,
      name: foodData.name,
      calories: foodData.calories,
      protein_g: foodData.protein_g || 0,
      carbs_g: foodData.carbs_g || 0,
      fats_g: foodData.fats_g || 0,
      amount: foodData.amount,
      unit: foodData.unit,
      meal_type: foodData.meal_type
    }

    const { data, error } = await this.supabase
      .from('food_entries')
      .insert(foodEntry)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add food entry: ${error.message}`)
    }

    // Update daily entry totals
    await this.updateDailyTotals(foodData.userId, foodData.date)

    return data
  }

  async getFoodEntriesForDay(userId: string, date: string): Promise<FoodEntry[]> {
    const dailyEntry = await dailyEntryService.getDailyEntry(userId, date)

    if (!dailyEntry) {
      return []
    }

    const { data, error } = await this.supabase
      .from('food_entries')
      .select('*')
      .eq('daily_entry_id', dailyEntry.id)
      .order('consumed_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch food entries: ${error.message}`)
    }

    return data || []
  }

  async updateFoodEntry(foodEntryId: string, updates: Partial<FoodEntry>): Promise<FoodEntry> {
    const { data, error } = await this.supabase
      .from('food_entries')
      .update(updates)
      .eq('id', foodEntryId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update food entry: ${error.message}`)
    }

    // Update daily totals
    await this.updateDailyTotals(data.user_id, new Date(data.consumed_at).toISOString().split('T')[0])

    return data
  }

  async deleteFoodEntry(foodEntryId: string): Promise<void> {
    // Get the food entry first to know which day to update
    const { data: foodEntry, error: fetchError } = await this.supabase
      .from('food_entries')
      .select('user_id, consumed_at')
      .eq('id', foodEntryId)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch food entry: ${fetchError.message}`)
    }

    const { error } = await this.supabase
      .from('food_entries')
      .delete()
      .eq('id', foodEntryId)

    if (error) {
      throw new Error(`Failed to delete food entry: ${error.message}`)
    }

    // Update daily totals
    await this.updateDailyTotals(foodEntry.user_id, new Date(foodEntry.consumed_at).toISOString().split('T')[0])
  }

  private async updateDailyTotals(userId: string, date: string): Promise<void> {
    const foodEntries = await this.getFoodEntriesForDay(userId, date)

    const totals = foodEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein_g,
        carbs: acc.carbs + entry.carbs_g,
        fats: acc.fats + entry.fats_g
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    await dailyEntryService.upsertDailyEntry(userId, date, {
      calories_consumed: totals.calories,
      protein_consumed_g: totals.protein,
      carbs_consumed_g: totals.carbs,
      fats_consumed_g: totals.fats
    })
  }

  // Food Templates
  async createFoodTemplate(templateData: {
    userId: string
    name: string
    calories: number
    protein_g?: number
    carbs_g?: number
    fats_g?: number
    default_amount: number
    default_unit: string
    category: 'meal' | 'snack' | 'drink'
  }): Promise<FoodTemplate> {
    const template: FoodTemplateInsert = {
      user_id: templateData.userId,
      name: templateData.name,
      calories: templateData.calories,
      protein_g: templateData.protein_g || 0,
      carbs_g: templateData.carbs_g || 0,
      fats_g: templateData.fats_g || 0,
      default_amount: templateData.default_amount,
      default_unit: templateData.default_unit,
      category: templateData.category
    }

    const { data, error } = await this.supabase
      .from('food_templates')
      .insert(template)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create food template: ${error.message}`)
    }

    return data
  }

  async getFoodTemplates(userId: string): Promise<FoodTemplate[]> {
    const { data, error } = await this.supabase
      .from('food_templates')
      .select('*')
      .eq('user_id', userId)
      .order('usage_count', { ascending: false })
      .order('last_used', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch food templates: ${error.message}`)
    }

    return data || []
  }

  async updateTemplateUsage(templateId: string): Promise<void> {
    const { error } = await this.supabase
      .from('food_templates')
      .update({
        usage_count: this.supabase.rpc('increment_usage_count'),
        last_used: new Date().toISOString()
      })
      .eq('id', templateId)

    if (error) {
      throw new Error(`Failed to update template usage: ${error.message}`)
    }
  }

  async deleteFoodTemplate(templateId: string): Promise<void> {
    const { error } = await this.supabase
      .from('food_templates')
      .delete()
      .eq('id', templateId)

    if (error) {
      throw new Error(`Failed to delete food template: ${error.message}`)
    }
  }
}

export const foodService = new FoodService()