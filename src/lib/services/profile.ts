import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export class ProfileService {
  private supabase = getSupabaseClient()

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    // Return null if no profile found, or the first profile if found
    return data && data.length > 0 ? data[0] : null
  }

  async createProfile(profileData: UserProfileInsert): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`)
    }

    return data
  }

  async updateProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return data
  }

  async deleteProfile(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`)
    }
  }

  /**
   * Calculate BMR using Mifflin-St Jeor formula
   * Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
   * Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
   */
  calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female' | 'other'): number {
    const base = 10 * weight + 6.25 * height - 5 * age

    switch (gender) {
      case 'male':
        return Math.round(base + 5)
      case 'female':
        return Math.round(base - 161)
      case 'other':
        // Use average of male and female formulas
        return Math.round(base - 78)
      default:
        return Math.round(base - 78)
    }
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   * Activity level multipliers:
   * - sedentary: 1.2
   * - lightly_active: 1.375
   * - moderately_active: 1.55
   * - very_active: 1.725
   * - extremely_active: 1.9
   */
  calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }

    const multiplier = multipliers[activityLevel as keyof typeof multipliers] || 1.2
    return Math.round(bmr * multiplier)
  }

  /**
   * Calculate recommended macro targets based on TDEE
   * Default ratios: 30% protein, 40% carbs, 30% fats
   */
  calculateMacroTargets(calories: number): { protein: number; carbs: number; fats: number } {
    return {
      protein: Math.round((calories * 0.3) / 4), // 4 calories per gram of protein
      carbs: Math.round((calories * 0.4) / 4),   // 4 calories per gram of carbs
      fats: Math.round((calories * 0.3) / 9)     // 9 calories per gram of fat
    }
  }

  /**
   * Create complete profile with calculated values
   */
  async createCompleteProfile(profileData: {
    id: string
    name: string
    email?: string
    age: number
    gender: 'male' | 'female' | 'other'
    height_cm: number
    current_weight_kg: number
    activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
    calorie_target?: number
    units?: 'metric' | 'imperial'
  }): Promise<UserProfile> {
    const bmr = this.calculateBMR(
      profileData.current_weight_kg,
      profileData.height_cm,
      profileData.age,
      profileData.gender
    )

    const tdee = this.calculateTDEE(bmr, profileData.activity_level)
    const calorieTarget = profileData.calorie_target || tdee
    const macros = this.calculateMacroTargets(calorieTarget)

    const completeProfile: UserProfileInsert = {
      user_id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      age: profileData.age,
      gender: profileData.gender,
      height_cm: profileData.height_cm,
      current_weight_kg: profileData.current_weight_kg,
      activity_level: profileData.activity_level,
      bmr,
      tdee,
      calorie_target: calorieTarget,
      protein_target_g: macros.protein,
      carbs_target_g: macros.carbs,
      fats_target_g: macros.fats,
      units: profileData.units || 'metric'
    }

    return this.createProfile(completeProfile)
  }

  /**
   * Update profile and recalculate BMR/TDEE if weight, height, age, or activity changed
   */
  async updateProfileWithRecalculation(
    userId: string,
    updates: UserProfileUpdate,
    currentProfile: UserProfile
  ): Promise<UserProfile> {
    const needsRecalculation =
      updates.current_weight_kg !== undefined ||
      updates.height_cm !== undefined ||
      updates.age !== undefined ||
      updates.gender !== undefined ||
      updates.activity_level !== undefined

    let finalUpdates = { ...updates }

    if (needsRecalculation) {
      const weight = updates.current_weight_kg ?? currentProfile.current_weight_kg
      const height = updates.height_cm ?? currentProfile.height_cm
      const age = updates.age ?? currentProfile.age
      const gender = updates.gender ?? currentProfile.gender
      const activityLevel = updates.activity_level ?? currentProfile.activity_level

      const newBMR = this.calculateBMR(weight, height, age, gender)
      const newTDEE = this.calculateTDEE(newBMR, activityLevel)

      finalUpdates = {
        ...finalUpdates,
        bmr: newBMR,
        tdee: newTDEE
      }

      // Only recalculate calorie target if not explicitly provided
      if (updates.calorie_target === undefined) {
        finalUpdates.calorie_target = newTDEE
        const newMacros = this.calculateMacroTargets(newTDEE)
        finalUpdates.protein_target_g = newMacros.protein
        finalUpdates.carbs_target_g = newMacros.carbs
        finalUpdates.fats_target_g = newMacros.fats
      }
    }

    return this.updateProfile(userId, finalUpdates)
  }
}

export const profileService = new ProfileService()