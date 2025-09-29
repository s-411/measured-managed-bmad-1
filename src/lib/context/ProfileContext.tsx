'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

interface ProfileContextType {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  createProfile: (profileData: {
    name: string
    email?: string
    age: number
    gender: 'male' | 'female' | 'other'
    height_cm: number
    current_weight_kg: number
    activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
    calorie_target?: number
    units?: 'metric' | 'imperial'
  }) => Promise<void>
  updateProfile: (updates: UserProfileUpdate) => Promise<void>
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// Helper functions for calculations
function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female' | 'other'): number {
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

function calculateTDEE(bmr: number, activityLevel: string): number {
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

function calculateMacroTargets(calories: number): { protein: number; carbs: number; fats: number } {
  return {
    protein: Math.round((calories * 0.3) / 4), // 4 calories per gram of protein
    carbs: Math.round((calories * 0.4) / 4),   // 4 calories per gram of carbs
    fats: Math.round((calories * 0.3) / 9)     // 9 calories per gram of fat
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchProfile = async () => {
    console.log('ProfileContext.fetchProfile called', { hasUser: !!user, userId: user?.id })

    if (!user) {
      console.log('ProfileContext.fetchProfile: No user, setting profile to null')
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('ProfileContext.fetchProfile: Fetching profile for user:', user.id)

      // Use the same Supabase client instance
      const supabase = getSupabaseClient()

      // Check if Supabase client has the session
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('ProfileContext.fetchProfile: Current session:', {
        hasSession: !!sessionData.session,
        sessionUserId: sessionData.session?.user?.id,
        targetUserId: user.id,
        sessionMatches: sessionData.session?.user?.id === user.id
      })

      // Directly query the profile using the same client
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)

      console.log('ProfileContext.fetchProfile: Query result:', { data, error, dataLength: data?.length })

      if (error) {
        console.error('ProfileContext.fetchProfile: Query error:', error)
        throw new Error(`Failed to fetch profile: ${error.message}`)
      }

      const userProfile = data && data.length > 0 ? data[0] : null
      console.log('ProfileContext.fetchProfile: Profile found:', !!userProfile)
      setProfile(userProfile)
    } catch (err) {
      console.error('ProfileContext.fetchProfile: Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      // Don't throw - just set profile to null and let the app handle it
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const createProfile = async (profileData: {
    name: string
    email?: string
    age: number
    gender: 'male' | 'female' | 'other'
    height_cm: number
    current_weight_kg: number
    activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
    calorie_target?: number
    units?: 'metric' | 'imperial'
  }) => {
    if (!user) {
      throw new Error('User must be authenticated to create profile')
    }

    try {
      setLoading(true)
      setError(null)

      // Calculate BMR and other values
      const bmr = calculateBMR(
        profileData.current_weight_kg,
        profileData.height_cm,
        profileData.age,
        profileData.gender
      )

      const tdee = calculateTDEE(bmr, profileData.activity_level)
      const calorieTarget = profileData.calorie_target || tdee
      const macros = calculateMacroTargets(calorieTarget)

      const completeProfile = {
        user_id: user.id,
        name: profileData.name,
        email: profileData.email || user.email,
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

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(completeProfile)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create profile: ${error.message}`)
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: UserProfileUpdate) => {
    if (!user || !profile) {
      throw new Error('User and profile must exist to update')
    }

    try {
      setLoading(true)
      setError(null)

      // Check if we need to recalculate BMR/TDEE
      const needsRecalculation =
        updates.current_weight_kg !== undefined ||
        updates.height_cm !== undefined ||
        updates.age !== undefined ||
        updates.gender !== undefined ||
        updates.activity_level !== undefined

      let finalUpdates = { ...updates }

      if (needsRecalculation) {
        const weight = updates.current_weight_kg ?? profile.current_weight_kg
        const height = updates.height_cm ?? profile.height_cm
        const age = updates.age ?? profile.age
        const gender = updates.gender ?? profile.gender
        const activityLevel = updates.activity_level ?? profile.activity_level

        const newBMR = calculateBMR(Number(weight), height, age, gender)
        const newTDEE = calculateTDEE(newBMR, activityLevel)

        finalUpdates = {
          ...finalUpdates,
          bmr: newBMR,
          tdee: newTDEE
        }

        // Only recalculate calorie target if not explicitly provided
        if (updates.calorie_target === undefined) {
          finalUpdates.calorie_target = newTDEE
          const newMacros = calculateMacroTargets(newTDEE)
          finalUpdates.protein_target_g = newMacros.protein
          finalUpdates.carbs_target_g = newMacros.carbs
          finalUpdates.fats_target_g = newMacros.fats
        }
      }

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .update(finalUpdates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  const value = {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refreshProfile
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}