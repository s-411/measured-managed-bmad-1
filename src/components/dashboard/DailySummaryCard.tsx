'use client'

import { useProfile } from '@/lib/context/ProfileContext'

interface DailySummaryProps {
  entry: {
    calories_consumed: number
    calories_burned_exercise: number
    calories_burned_bmr: number
    protein_consumed_g: number
    carbs_consumed_g: number
    fats_consumed_g: number
    weight_kg: number | null
    mit_task_1_completed: boolean
    mit_task_2_completed: boolean
    mit_task_3_completed: boolean
    deep_work_completed: boolean
  } | null
}

export function DailySummaryCard({ entry }: DailySummaryProps) {
  const { profile } = useProfile()

  if (!profile) return null

  const bmr = profile.bmr
  const calorieTarget = profile.calorie_target
  const proteinTarget = profile.protein_target_g
  const carbsTarget = profile.carbs_target_g
  const fatsTarget = profile.fats_target_g

  const caloriesConsumed = entry?.calories_consumed || 0
  const caloriesBurned = entry?.calories_burned_exercise || 0
  const proteinConsumed = entry?.protein_consumed_g || 0
  const carbsConsumed = entry?.carbs_consumed_g || 0
  const fatsConsumed = entry?.fats_consumed_g || 0

  const calorieBalance = caloriesConsumed - bmr - caloriesBurned
  const netCalories = caloriesConsumed - caloriesBurned

  const mitCompleted = entry ? [
    entry.mit_task_1_completed,
    entry.mit_task_2_completed,
    entry.mit_task_3_completed
  ].filter(Boolean).length : 0

  const getCalorieStatus = () => {
    const percentOfTarget = (caloriesConsumed / calorieTarget) * 100
    if (percentOfTarget < 80) return { color: 'text-yellow-400', label: 'Under target' }
    if (percentOfTarget > 120) return { color: 'text-red-400', label: 'Over target' }
    return { color: 'text-green-400', label: 'On target' }
  }

  const calorieStatus = getCalorieStatus()

  return (
    <div className="card-mm p-6">
      <h2 className="text-xl font-bold text-mm-white mb-6">Daily Summary</h2>

      {/* Calorie Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-mm-blue">{caloriesConsumed}</div>
          <div className="text-sm text-gray-400">Consumed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{caloriesBurned}</div>
          <div className="text-sm text-gray-400">Burned</div>
        </div>
      </div>

      {/* Calorie Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Calorie Progress</span>
          <span className={calorieStatus.color}>{calorieStatus.label}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-mm-blue h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((caloriesConsumed / calorieTarget) * 100, 100)}%`
            }}
          ></div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {caloriesConsumed} / {calorieTarget} calories
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-400">{proteinConsumed}g</div>
          <div className="text-xs text-gray-400">Protein</div>
          <div className="text-xs text-gray-500">{proteinTarget}g target</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-yellow-400">{carbsConsumed}g</div>
          <div className="text-xs text-gray-400">Carbs</div>
          <div className="text-xs text-gray-500">{carbsTarget}g target</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">{fatsConsumed}g</div>
          <div className="text-xs text-gray-400">Fats</div>
          <div className="text-xs text-gray-500">{fatsTarget}g target</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Net Calories:</span>
          <span className="ml-2 text-mm-white font-semibold">{netCalories}</span>
        </div>
        <div>
          <span className="text-gray-400">Balance:</span>
          <span className={`ml-2 font-semibold ${calorieBalance > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {calorieBalance > 0 ? '+' : ''}{calorieBalance}
          </span>
        </div>
        <div>
          <span className="text-gray-400">MIT Tasks:</span>
          <span className="ml-2 text-mm-white font-semibold">{mitCompleted}/3</span>
        </div>
        <div>
          <span className="text-gray-400">Deep Work:</span>
          <span className={`ml-2 font-semibold ${entry?.deep_work_completed ? 'text-green-400' : 'text-gray-400'}`}>
            {entry?.deep_work_completed ? '✓' : '✗'}
          </span>
        </div>
      </div>

      {/* Weight */}
      {entry?.weight_kg && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <span className="text-gray-400">Today's Weight:</span>
            <span className="ml-2 text-lg font-semibold text-mm-white">
              {entry.weight_kg} kg
            </span>
          </div>
        </div>
      )}
    </div>
  )
}