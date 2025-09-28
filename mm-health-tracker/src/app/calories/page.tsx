'use client'

import { useState } from 'react'
import { ProfileGuard } from '@/components/guards/ProfileGuard'
import { FoodEntryForm } from '@/components/food/FoodEntryForm'
import { FoodEntriesList } from '@/components/food/FoodEntriesList'
import { DailySummaryCard } from '@/components/dashboard/DailySummaryCard'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CaloriesTrackingPage() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddSuccess = () => {
    setShowAddForm(false)
    setRefreshKey(prev => prev + 1) // Trigger refresh of components
  }

  const handleListUpdate = () => {
    setRefreshKey(prev => prev + 1) // Trigger refresh when list is updated
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <ProfileGuard>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mm-white mb-2">Calorie Tracking</h1>
            <p className="text-gray-400">Track your daily food intake and macronutrients</p>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-mm-white">
              {formatDate(currentDate)}
            </div>
            <div className="text-sm text-gray-400">
              {currentDate === new Date().toISOString().split('T')[0] ? 'Today' : ''}
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-mm-white mb-4">Daily Summary</h2>
          <DailySummaryCard entry={null} key={`summary-${refreshKey}`} />
        </div>

        {/* Quick Add Buttons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-mm-white">Add Food</h2>
            {showAddForm && (
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-mm-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {!showAddForm && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { type: 'breakfast', label: 'Breakfast', color: 'bg-yellow-600 hover:bg-yellow-700' },
                { type: 'lunch', label: 'Lunch', color: 'bg-green-600 hover:bg-green-700' },
                { type: 'dinner', label: 'Dinner', color: 'bg-blue-600 hover:bg-blue-700' },
                { type: 'snack', label: 'Snack', color: 'bg-purple-600 hover:bg-purple-700' }
              ].map(({ type, label, color }) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedMealType(type as any)
                    setShowAddForm(true)
                  }}
                  className={`${color} text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                >
                  <PlusIcon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Food Form */}
        {showAddForm && (
          <div className="mb-8">
            <FoodEntryForm
              date={currentDate}
              initialMealType={selectedMealType}
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Food Entries List */}
        <div>
          <h2 className="text-xl font-semibold text-mm-white mb-4">Today's Meals</h2>
          <FoodEntriesList
            date={currentDate}
            onUpdate={handleListUpdate}
            key={`list-${refreshKey}`}
          />
        </div>
      </div>
    </ProfileGuard>
  )
}