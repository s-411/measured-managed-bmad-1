'use client'

import { useState, useEffect } from 'react'
import { foodService } from '@/lib/services/food'
import { useAuth } from '@/lib/context/AuthContext'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { Database } from '@/lib/supabase/types'

type FoodEntry = Database['public']['Tables']['food_entries']['Row']

interface FoodEntriesListProps {
  date: string
  onUpdate?: () => void
}

export function FoodEntriesList({ date, onUpdate }: FoodEntriesListProps) {
  const { user } = useAuth()
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadFoodEntries()
    }
  }, [user, date])

  const loadFoodEntries = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const entries = await foodService.getFoodEntriesForDay(user.id, date)
      setFoodEntries(entries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load food entries')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this food entry?')) return

    try {
      await foodService.deleteFoodEntry(entryId)
      await loadFoodEntries() // Reload the list
      onUpdate?.() // Trigger parent component update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete food entry')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const groupedEntries = foodEntries.reduce((groups, entry) => {
    const mealType = entry.meal_type
    if (!groups[mealType]) {
      groups[mealType] = []
    }
    groups[mealType].push(entry)
    return groups
  }, {} as Record<string, FoodEntry[]>)

  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks'
  }

  const mealTypeColors = {
    breakfast: 'border-yellow-500 bg-yellow-500/10',
    lunch: 'border-green-500 bg-green-500/10',
    dinner: 'border-blue-500 bg-blue-500/10',
    snack: 'border-purple-500 bg-purple-500/10'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mm-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (foodEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No food entries for this day yet.</p>
        <p className="text-sm text-gray-500 mt-1">Add your first meal to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(mealTypeLabels).map(([mealType, label]) => {
        const entries = groupedEntries[mealType] || []
        if (entries.length === 0) return null

        const mealTotalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
        const mealTotalProtein = entries.reduce((sum, entry) => sum + entry.protein_g, 0)
        const mealTotalCarbs = entries.reduce((sum, entry) => sum + entry.carbs_g, 0)
        const mealTotalFats = entries.reduce((sum, entry) => sum + entry.fats_g, 0)

        return (
          <div key={mealType} className={`border rounded-lg p-4 ${mealTypeColors[mealType as keyof typeof mealTypeColors]}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-mm-white">{label}</h3>
              <div className="text-sm text-gray-300">
                {mealTotalCalories} cal
              </div>
            </div>

            <div className="space-y-2 mb-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between bg-mm-dark2/50 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-mm-white">{entry.name}</span>
                      <span className="text-sm text-gray-400">{formatTime(entry.consumed_at)}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {entry.amount} {entry.unit} • {entry.calories} cal
                      {(entry.protein_g > 0 || entry.carbs_g > 0 || entry.fats_g > 0) && (
                        <span className="ml-2">
                          • P: {entry.protein_g}g C: {entry.carbs_g}g F: {entry.fats_g}g
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                      title="Delete entry"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Totals */}
            <div className="text-sm text-gray-400 border-t border-gray-600 pt-3">
              <div className="grid grid-cols-4 gap-4">
                <div>Total: <span className="text-mm-white font-medium">{mealTotalCalories} cal</span></div>
                <div>P: <span className="text-green-400 font-medium">{Math.round(mealTotalProtein)}g</span></div>
                <div>C: <span className="text-yellow-400 font-medium">{Math.round(mealTotalCarbs)}g</span></div>
                <div>F: <span className="text-purple-400 font-medium">{Math.round(mealTotalFats)}g</span></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}