'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { useProfile } from '@/lib/context/ProfileContext'

interface ProfileGuardProps {
  children: React.ReactNode
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const router = useRouter()

  useEffect(() => {
    console.log('ProfileGuard: State check', {
      authLoading,
      profileLoading,
      user: !!user,
      profile: !!profile,
      userId: user?.id
    })

    if (!authLoading && !profileLoading && user && !profile) {
      console.log('ProfileGuard: Redirecting to profile setup')
      // User is authenticated but has no profile, redirect to setup
      router.push('/profile/setup')
    }
  }, [user, profile, authLoading, profileLoading, router])

  // Show loading while checking authentication and profile
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-blue mx-auto mb-4"></div>
          <p className="text-mm-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user needs to set up profile
  if (user && !profile) {
    return null
  }

  return <>{children}</>
}