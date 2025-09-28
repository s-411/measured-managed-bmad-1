'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import AuthFormWrapper from '@/components/auth/AuthFormWrapper'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('Attempting sign in for:', email)
    const { error } = await signIn(email, password)

    if (error) {
      console.error('Sign in error:', error)
      setError(error.message)
      setLoading(false)
    } else {
      console.log('Sign in successful, redirecting to /profile/setup')
      // Force a hard refresh to ensure middleware picks up the new session
      window.location.href = '/profile/setup'
    }
  }

  return (
    <AuthFormWrapper>
      <div className="min-h-screen flex items-center justify-center bg-mm-dark">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-mm-white">
              Sign in to MM Health Tracker
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Or{' '}
              <Link
                href="/auth/register"
                className="font-medium text-mm-blue hover:text-blue-400"
              >
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-mm-white">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-mm mt-1 block w-full"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-mm-white">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input-mm mt-1 block w-full"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-mm w-full flex justify-center py-3 text-white font-medium disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthFormWrapper>
  )
}