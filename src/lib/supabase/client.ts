import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Simple client-side Supabase client
export const createClientSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        // Only works in browser environment
        if (typeof document === 'undefined') return undefined

        // ONLY allow cookies for our specific Supabase project
        if (!name.includes('qbfoakwchpwgoiawjqxs')) {
          return undefined
        }

        return document.cookie
          .split('; ')
          .find(row => row.startsWith(`${name}=`))
          ?.split('=')[1]
      },
      set(name: string, value: string, options) {
        // Only works in browser environment
        if (typeof document === 'undefined') return

        // ONLY allow setting cookies for our specific Supabase project
        if (!name.includes('qbfoakwchpwgoiawjqxs')) {
          return
        }

        let cookie = `${name}=${value}`
        if (options?.expires) cookie += `; expires=${options.expires.toUTCString()}`
        if (options?.path) cookie += `; path=${options.path}`
        if (options?.domain) cookie += `; domain=${options.domain}`
        if (options?.sameSite) cookie += `; samesite=${options.sameSite}`
        if (options?.secure) cookie += `; secure`
        if (options?.httpOnly) cookie += `; httponly`
        document.cookie = cookie
      },
      remove(name: string, options) {
        // Only works in browser environment
        if (typeof document === 'undefined') return

        // ONLY allow removing cookies for our specific Supabase project
        if (!name.includes('qbfoakwchpwgoiawjqxs')) {
          return
        }

        let cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`
        if (options?.path) cookie += `; path=${options.path}`
        if (options?.domain) cookie += `; domain=${options.domain}`
        document.cookie = cookie
      }
    }
  })
}

// Browser client (singleton)
let supabaseClient: ReturnType<typeof createClientSupabase> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientSupabase()
  }
  return supabaseClient
}