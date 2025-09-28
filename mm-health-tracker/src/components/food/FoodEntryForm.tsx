'use client'

import { useState } from 'react'
import { foodService } from '@/lib/services/food'
import { useAuth } from '@/lib/context/AuthContext'

interface FoodEntryFormProps {
  date: string
  onSuccess?: () => void
  onCancel?: () => void
  initialMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export function FoodEntryForm({ date, onSuccess, onCancel, initialMealType = 'breakfast' }: FoodEntryFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fats_g: '',
    amount: '1',
    unit: 'serving',
    meal_type: initialMealType
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      await foodService.addFoodEntry({
        userId: user.id,
        date,
        name: formData.name,
        calories: parseInt(formData.calories),
        protein_g: formData.protein_g ? parseFloat(formData.protein_g) : 0,
        carbs_g: formData.carbs_g ? parseFloat(formData.carbs_g) : 0,
        fats_g: formData.fats_g ? parseFloat(formData.fats_g) : 0,
        amount: parseFloat(formData.amount),
        unit: formData.unit,
        meal_type: formData.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack'
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add food entry')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="card-mm p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-mm-white mb-4">Add Food Entry</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Food Name */}
        <div>
          <label className="block text-sm font-medium text-mm-white mb-2">
            Food Name
          </label>
          <input
            type="text"
            required
            className="input-mm w-full"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Grilled Chicken Breast"
          />
        </div>

        {/* Amount and Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Amount
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              className="input-mm w-full"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Unit
            </label>
            <select
              className="input-mm w-full"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
            >
              <option value="serving">serving</option>
              <option value="cup">cup</option>
              <option value="oz">oz</option>
              <option value="g">grams</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
              <option value="piece">piece</option>
              <option value="slice">slice</option>
            </select>
          </div>
        </div>

        {/* Meal Type */}
        <div>
          <label className="block text-sm font-medium text-mm-white mb-2">
            Meal Type
          </label>
          <select
            className="input-mm w-full"
            value={formData.meal_type}
            onChange={(e) => handleInputChange('meal_type', e.target.value)}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        {/* Calories */}
        <div>
          <label className="block text-sm font-medium text-mm-white mb-2">
            Calories
          </label>
          <input
            type="number"
            required
            min="0"
            className="input-mm w-full"
            value={formData.calories}
            onChange={(e) => handleInputChange('calories', e.target.value)}
            placeholder="e.g., 250"
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="input-mm w-full"
              value={formData.protein_g}
              onChange={(e) => handleInputChange('protein_g', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Carbs (g)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="input-mm w-full"
              value={formData.carbs_g}
              onChange={(e) => handleInputChange('carbs_g', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Fats (g)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="input-mm w-full"
              value={formData.fats_g}
              onChange={(e) => handleInputChange('fats_g', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-mm flex-1 py-3 text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Food Entry'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}