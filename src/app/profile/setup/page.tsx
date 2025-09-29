'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleSuccess = () => {
    router.push('/daily')
  }

  // Handle redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-blue mx-auto mb-4"></div>
          <p className="text-mm-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Return loading state if redirecting to login
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-blue mx-auto mb-4"></div>
          <p className="text-mm-white">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mm-dark py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mm-white mb-4">
            Welcome to MM Health Tracker!
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Let's set up your profile to calculate your personalized BMR and daily calorie targets.
            This helps us provide accurate tracking and insights for your health journey.
          </p>
        </div>

        <ProfileForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}