import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Simple client-side Supabase client
export const createClientSupabase = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Browser client (singleton)
let supabaseClient: ReturnType<typeof createClientSupabase> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientSupabase()
  }
  return supabaseClient
}