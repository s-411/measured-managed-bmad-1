'use client'

import { useEffect, useState } from 'react'

interface AuthFormWrapperProps {
  children: React.ReactNode
}

export default function AuthFormWrapper({ children }: AuthFormWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mm-dark">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <div suppressHydrationWarning>{children}</div>
}