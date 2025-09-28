'use client'

import { useState } from 'react'
import { useProfile } from '@/lib/context/ProfileContext'

interface ProfileFormData {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height_cm: number
  current_weight_kg: number
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  calorie_target?: number
  units: 'metric' | 'imperial'
}

interface ProfileFormProps {
  isEdit?: boolean
  initialData?: Partial<ProfileFormData>
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProfileForm({ isEdit = false, initialData, onSuccess, onCancel }: ProfileFormProps) {
  const { createProfile, updateProfile, loading } = useProfile()
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || '',
    age: initialData?.age || 25,
    gender: initialData?.gender || 'male',
    height_cm: initialData?.height_cm || 175,
    current_weight_kg: initialData?.current_weight_kg || 70,
    activity_level: initialData?.activity_level || 'moderately_active',
    calorie_target: initialData?.calorie_target,
    units: initialData?.units || 'metric'
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (isEdit) {
        await updateProfile(formData)
      } else {
        await createProfile(formData)
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    }
  }

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (office job, no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (light exercise 1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (hard exercise 6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (very hard exercise, physical job)' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-mm p-6">
        <h2 className="text-2xl font-bold text-mm-white mb-6">
          {isEdit ? 'Update Profile' : 'Complete Your Profile'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mm-white mb-2">
                Name
              </label>
              <input
                type="text"
                required
                className="input-mm w-full"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mm-white mb-2">
                Age
              </label>
              <input
                type="number"
                required
                min="13"
                max="120"
                className="input-mm w-full"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Gender and Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mm-white mb-2">
                Gender
              </label>
              <select
                className="input-mm w-full"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-mm-white mb-2">
                Units
              </label>
              <select
                className="input-mm w-full"
                value={formData.units}
                onChange={(e) => handleInputChange('units', e.target.value)}
              >
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lbs, ft/in)</option>
              </select>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mm-white mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                required
                min="100"
                max="250"
                className="input-mm w-full"
                value={formData.height_cm}
                onChange={(e) => handleInputChange('height_cm', parseInt(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mm-white mb-2">
                Current Weight (kg)
              </label>
              <input
                type="number"
                required
                min="30"
                max="300"
                step="0.1"
                className="input-mm w-full"
                value={formData.current_weight_kg}
                onChange={(e) => handleInputChange('current_weight_kg', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Activity Level
            </label>
            <select
              className="input-mm w-full"
              value={formData.activity_level}
              onChange={(e) => handleInputChange('activity_level', e.target.value)}
            >
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Calorie Target */}
          <div>
            <label className="block text-sm font-medium text-mm-white mb-2">
              Custom Calorie Target (optional)
            </label>
            <input
              type="number"
              min="1000"
              max="5000"
              className="input-mm w-full"
              value={formData.calorie_target || ''}
              onChange={(e) => handleInputChange('calorie_target', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Leave blank to use calculated value"
            />
            <p className="text-sm text-gray-400 mt-1">
              If not provided, we'll calculate your daily calorie needs based on your BMR and activity level
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-mm flex-1 py-3 text-white font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Profile' : 'Create Profile')}
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
    </div>
  )
}