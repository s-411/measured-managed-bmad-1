import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { dailyEntryService } from '@/lib/services/daily'
import type { Database } from '@/lib/supabase/types'

type DailyEntry = Database['public']['Tables']['daily_entries']['Row']

export function useDailyEntry(date: string, refreshKey?: number) {
  const { user } = useAuth()
  const [entry, setEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchEntry = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await dailyEntryService.getDailyEntry(user.id, date)
        setEntry(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch daily entry')
        setEntry(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [user?.id, date, refreshKey])

  return {
    entry,
    loading,
    error,
    refetch: () => {
      if (user?.id) {
        const fetchEntry = async () => {
          try {
            setLoading(true)
            setError(null)
            const data = await dailyEntryService.getDailyEntry(user.id, date)
            setEntry(data)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch daily entry')
            setEntry(null)
          } finally {
            setLoading(false)
          }
        }
        fetchEntry()
      }
    }
  }
}