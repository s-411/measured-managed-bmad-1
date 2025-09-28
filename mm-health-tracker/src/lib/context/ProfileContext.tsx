'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { profileService } from '@/lib/services/profile'
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

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching profile for user:', user.id)
      const userProfile = await profileService.getProfile(user.id)
      console.log('Profile fetched:', userProfile)
      setProfile(userProfile)
    } catch (err) {
      console.error('Profile fetch error:', err)
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
      const newProfile = await profileService.createCompleteProfile({
        id: user.id,
        email: user.email,
        ...profileData
      })
      setProfile(newProfile)
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
      const updatedProfile = await profileService.updateProfileWithRecalculation(
        user.id,
        updates,
        profile
      )
      setProfile(updatedProfile)
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