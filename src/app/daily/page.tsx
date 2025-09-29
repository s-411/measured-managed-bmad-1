'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { useProfile } from '@/lib/context/ProfileContext'
import { dailyEntryService } from '@/lib/services/daily'
import { foodService } from '@/lib/services/food'
import { ProfileGuard } from '@/components/guards/ProfileGuard'
import { DailySummaryCard } from '@/components/dashboard/DailySummaryCard'
import { useDailyEntry } from '@/lib/hooks/useDailyEntry'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  ScaleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import type { Database } from '@/lib/supabase/types'

type DailyEntry = Database['public']['Tables']['daily_entries']['Row']
type FoodEntry = Database['public']['Tables']['food_entries']['Row']

export default function DailyDashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [refreshKey, setRefreshKey] = useState(0)

  const { user } = useAuth()
  const { profile } = useProfile()

  // Use the hook for consistent data fetching with real-time updates
  const { entry: dailyEntry, loading, error } = useDailyEntry(currentDate, refreshKey)

  // Additional state for enhanced features
  const [recentEntries, setRecentEntries] = useState<DailyEntry[]>([])
  const [recentFoodEntries, setRecentFoodEntries] = useState<FoodEntry[]>([])
  const [previousWeight, setPreviousWeight] = useState<number | null>(null)
  const [loadingRecent, setLoadingRecent] = useState(false)

  // Weight tracking state
  const [showWeightForm, setShowWeightForm] = useState(false)
  const [weightInput, setWeightInput] = useState('')

  // MIT tasks state
  const [mitTaskInputs, setMitTaskInputs] = useState({
    task1: '',
    task2: '',
    task3: ''
  })
  const [editingTask, setEditingTask] = useState<number | null>(null)

  useEffect(() => {
    if (user && profile) {
      loadRecentData()
    }
  }, [user, profile, currentDate, refreshKey])

  useEffect(() => {
    // Update form inputs when daily entry changes
    if (dailyEntry) {
      setWeightInput(dailyEntry.weight_kg?.toString() || '')
      setMitTaskInputs({
        task1: dailyEntry.mit_task_1 || '',
        task2: dailyEntry.mit_task_2 || '',
        task3: dailyEntry.mit_task_3 || ''
      })
    } else {
      setWeightInput('')
      setMitTaskInputs({ task1: '', task2: '', task3: '' })
    }
  }, [dailyEntry])

  const loadRecentData = async () => {
    if (!user) return

    try {
      setLoadingRecent(true)

      // Load recent daily entries for trends
      const recentDays = await dailyEntryService.getRecentDailyEntries(user.id, 7)
      setRecentEntries(recentDays)

      // Find previous weight for comparison
      const entriesWithWeight = recentDays
        .filter(entry => entry.weight_kg && entry.date !== currentDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (entriesWithWeight.length > 0) {
        setPreviousWeight(entriesWithWeight[0].weight_kg)
      }

      // Load recent food entries for activity feed
      const foodEntries = await foodService.getFoodEntriesForDay(user.id, currentDate)
      setRecentFoodEntries(foodEntries.slice(-5)) // Last 5 entries

    } catch (err) {
      console.error('Failed to load recent data:', err)
    } finally {
      setLoadingRecent(false)
    }
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate)
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1)
    } else {
      date.setDate(date.getDate() + 1)
    }
    setCurrentDate(date.toISOString().split('T')[0])
  }

  const updateWeight = async () => {
    if (!user) return

    const weight = parseFloat(weightInput)
    if (!isNaN(weight) && weight > 0) {
      try {
        await dailyEntryService.updateWeight(user.id, currentDate, weight)
        setShowWeightForm(false)
        setRefreshKey(prev => prev + 1) // Trigger refresh
      } catch (err) {
        console.error('Failed to update weight:', err)
      }
    }
  }

  const updateMITTask = async (taskNumber: 1 | 2 | 3, description: string, completed: boolean) => {
    if (!user) return

    try {
      const mitData: any = {}

      if (taskNumber === 1) {
        mitData.task1 = { description, completed }
      } else if (taskNumber === 2) {
        mitData.task2 = { description, completed }
      } else {
        mitData.task3 = { description, completed }
      }

      await dailyEntryService.updateMITTasks(user.id, currentDate, mitData)
      setEditingTask(null)
      setRefreshKey(prev => prev + 1) // Trigger refresh
    } catch (err) {
      console.error('Failed to update MIT task:', err)
    }
  }

  const toggleDeepWork = async () => {
    if (!user) return

    try {
      await dailyEntryService.toggleDeepWork(user.id, currentDate)
      setRefreshKey(prev => prev + 1) // Trigger refresh
    } catch (err) {
      console.error('Failed to toggle deep work:', err)
    }
  }

  // Calculate quick stats for header
  const getQuickStats = () => {
    if (!dailyEntry || !profile) return null

    const caloriesConsumed = dailyEntry.calories_consumed || 0
    const caloriesBurned = dailyEntry.calories_burned_exercise || 0
    const calorieTarget = profile.calorie_target || 2000
    const weightChange = dailyEntry.weight_kg && previousWeight ? dailyEntry.weight_kg - previousWeight : null
    const mitCompleted = [dailyEntry.mit_task_1_completed, dailyEntry.mit_task_2_completed, dailyEntry.mit_task_3_completed].filter(Boolean).length

    return {
      caloriesConsumed,
      caloriesBurned,
      calorieTarget,
      calorieProgress: Math.round((caloriesConsumed / calorieTarget) * 100),
      weightChange,
      mitCompleted,
      deepWorkCompleted: dailyEntry.deep_work_completed
    }
  }

  const quickStats = getQuickStats()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isToday = currentDate === new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-blue"></div>
      </div>
    )
  }

  return (
    <ProfileGuard>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Enhanced Header with Quick Stats */}
        <div className="mb-8">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-mm-white mb-2">Daily Dashboard</h1>
              <p className="text-gray-400">Your complete health and productivity tracker</p>
            </div>

            <div className="flex items-center gap-6 card-mm px-6 py-4">
              <button
                onClick={() => navigateDay('prev')}
                className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
                title="Previous day"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-400" />
              </button>

              <div className="text-center min-w-[200px]">
                <div className="text-xl font-bold text-mm-white">
                  {formatDate(currentDate)}
                </div>
                {isToday && (
                  <div className="text-sm text-mm-blue mt-1">Today</div>
                )}
              </div>

              <button
                onClick={() => navigateDay('next')}
                className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
                title="Next day"
                disabled={isToday}
              >
                <ChevronRightIcon className={`w-6 h-6 ${isToday ? 'text-gray-600' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

          {/* Quick Stats Summary */}
          {quickStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="card-mm p-4 text-center">
                <div className="text-2xl font-bold text-mm-blue">{quickStats.caloriesConsumed}</div>
                <div className="text-xs text-gray-400">Calories In</div>
                <div className="text-xs text-gray-500">{quickStats.calorieProgress}% of target</div>
              </div>

              <div className="card-mm p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{quickStats.caloriesBurned}</div>
                <div className="text-xs text-gray-400">Calories Out</div>
                <div className="text-xs text-gray-500">Exercise</div>
              </div>

              <div className="card-mm p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  {dailyEntry?.weight_kg ? (
                    <>
                      <span className="text-mm-white">{dailyEntry.weight_kg}</span>
                      <span className="text-sm text-gray-400">kg</span>
                    </>
                  ) : (
                    <span className="text-gray-500">--</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">Weight</div>
                {quickStats.weightChange !== null && (
                  <div className={`text-xs flex items-center justify-center gap-1 ${
                    quickStats.weightChange > 0 ? 'text-red-400' : quickStats.weightChange < 0 ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {quickStats.weightChange > 0 ? (
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                    ) : quickStats.weightChange < 0 ? (
                      <ArrowTrendingDownIcon className="w-3 h-3" />
                    ) : null}
                    {quickStats.weightChange > 0 ? '+' : ''}{quickStats.weightChange?.toFixed(1)}kg
                  </div>
                )}
              </div>

              <div className="card-mm p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{quickStats.mitCompleted}/3</div>
                <div className="text-xs text-gray-400">MIT Tasks</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>

              <div className="card-mm p-4 text-center">
                <div className={`text-2xl font-bold ${
                  quickStats.deepWorkCompleted ? 'text-purple-400' : 'text-gray-500'
                }`}>
                  {quickStats.deepWorkCompleted ? '✓' : '○'}
                </div>
                <div className="text-xs text-gray-400">Deep Work</div>
                <div className="text-xs text-gray-500">{quickStats.deepWorkCompleted ? 'Complete' : 'Pending'}</div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Daily Summary Card */}
        <div className="mb-8">
          <DailySummaryCard entry={dailyEntry} />
        </div>

        {/* Enhanced Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Enhanced Weight Tracking */}
          <div className="card-mm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-mm-white flex items-center gap-2">
                <ScaleIcon className="w-5 h-5 text-mm-blue" />
                Weight
              </h3>
            </div>

            {dailyEntry?.weight_kg && (
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-mm-blue">{dailyEntry.weight_kg} kg</div>
                {previousWeight && (
                  <div className="flex items-center justify-center gap-1 text-sm mt-2">
                    {dailyEntry.weight_kg > previousWeight ? (
                      <>
                        <ArrowTrendingUpIcon className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">+{(dailyEntry.weight_kg - previousWeight).toFixed(1)}kg</span>
                      </>
                    ) : dailyEntry.weight_kg < previousWeight ? (
                      <>
                        <ArrowTrendingDownIcon className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">{(dailyEntry.weight_kg - previousWeight).toFixed(1)}kg</span>
                      </>
                    ) : (
                      <span className="text-gray-400">No change</span>
                    )}
                  </div>
                )}
                {previousWeight && (
                  <div className="text-xs text-gray-500 mt-1">
                    Previous: {previousWeight} kg
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowWeightForm(!showWeightForm)}
              className="btn-mm w-full py-2 mb-3"
            >
              {dailyEntry?.weight_kg ? 'Update Weight' : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Weight
                </>
              )}
            </button>

            {showWeightForm && (
              <div className="space-y-3">
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="input-mm w-full"
                  placeholder="Weight in kg"
                  step="0.1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={updateWeight}
                    className="btn-mm flex-1 py-2 text-sm"
                    disabled={!weightInput || isNaN(parseFloat(weightInput))}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowWeightForm(false)}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Deep Work */}
          <div className="card-mm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-mm-white flex items-center gap-2">
                <EyeIcon className="w-5 h-5 text-purple-400" />
                Deep Work
              </h3>
            </div>

            <div className="text-center mb-4">
              <div className={`text-4xl font-bold transition-colors ${
                dailyEntry?.deep_work_completed ? 'text-green-400' : 'text-purple-400'
              }`}>
                {dailyEntry?.deep_work_completed ? '✓' : '○'}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {dailyEntry?.deep_work_completed ? 'Session Complete' : 'Pending'}
              </div>
            </div>

            <button
              onClick={toggleDeepWork}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all transform active:scale-95 ${
                dailyEntry?.deep_work_completed
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {dailyEntry?.deep_work_completed ? 'Mark Incomplete' : 'Start Deep Work'}
            </button>
          </div>

          {/* Enhanced Calorie Tracking */}
          <div className="card-mm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-mm-white flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-400" />
                Calories
              </h3>
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-orange-400">
                {dailyEntry?.calories_consumed || 0}
              </div>
              <div className="text-sm text-gray-400 mb-2">consumed</div>
              {profile?.calorie_target && (
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-orange-400 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min(((dailyEntry?.calories_consumed || 0) / profile.calorie_target) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              )}
              {profile?.calorie_target && (
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(((dailyEntry?.calories_consumed || 0) / profile.calorie_target) * 100)}% of target
                </div>
              )}
            </div>

            <a
              href="/calories"
              className="btn-mm w-full py-2 text-center block flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Food
            </a>
          </div>

          {/* Enhanced Exercise */}
          <div className="card-mm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-mm-white flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-green-400" />
                Exercise
              </h3>
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-400">
                {dailyEntry?.calories_burned_exercise || 0}
              </div>
              <div className="text-sm text-gray-400 mb-2">calories burned</div>
              <div className="text-xs text-gray-500">
                BMR: {dailyEntry?.calories_burned_bmr || profile?.bmr || 0} cal/day
              </div>
            </div>

            <button
              className="btn-mm w-full py-2 text-center flex items-center justify-center gap-2"
              onClick={() => {
                // For now, just show a placeholder - could integrate with exercise tracking
                alert('Exercise tracking coming soon!')
              }}
            >
              <PlusIcon className="w-4 h-4" />
              Add Exercise
            </button>
          </div>
        </div>

        {/* Enhanced MIT Tasks and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced MIT Tasks */}
          <div className="lg:col-span-2 card-mm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-mm-white flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                Most Important Tasks (MITs)
              </h2>
              <div className="text-sm text-gray-400">
                {[dailyEntry?.mit_task_1_completed, dailyEntry?.mit_task_2_completed, dailyEntry?.mit_task_3_completed]
                  .filter(Boolean).length}/3 completed
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((taskNum) => {
                const taskKey = `task${taskNum}` as keyof typeof mitTaskInputs
                const task = taskNum === 1 ? dailyEntry?.mit_task_1 :
                            taskNum === 2 ? dailyEntry?.mit_task_2 :
                            dailyEntry?.mit_task_3
                const completed = taskNum === 1 ? dailyEntry?.mit_task_1_completed :
                                 taskNum === 2 ? dailyEntry?.mit_task_2_completed :
                                 dailyEntry?.mit_task_3_completed

                return (
                  <div key={taskNum} className={`p-4 rounded-lg border-2 transition-all ${
                    completed ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-600'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <span className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-bold transition-colors ${
                          completed ? 'bg-green-500 text-white' : 'bg-mm-blue/20 text-mm-blue'
                        }`}>
                          {completed ? '✓' : taskNum}
                        </span>
                        {editingTask === taskNum ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={mitTaskInputs[taskKey]}
                              onChange={(e) => setMitTaskInputs(prev => ({ ...prev, [taskKey]: e.target.value }))}
                              className="input-mm flex-1"
                              placeholder={`Most Important Task ${taskNum}`}
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                updateMITTask(taskNum as 1 | 2 | 3, mitTaskInputs[taskKey], completed || false)
                              }}
                              className="btn-mm px-3 py-2 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="px-3 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`flex-1 cursor-pointer ${
                              completed ? 'line-through text-gray-400' : 'text-mm-white'
                            }`}
                            onClick={() => setEditingTask(taskNum)}
                          >
                            {task || `Click to add Most Important Task ${taskNum}`}
                          </div>
                        )}
                      </div>

                      {task && editingTask !== taskNum && (
                        <button
                          onClick={() => updateMITTask(taskNum as 1 | 2 | 3, task, !completed)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all transform hover:scale-110 ${
                            completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-green-500 hover:bg-green-500/20 text-green-500'
                          }`}
                        >
                          {completed && (
                            <CheckCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">💡</span>
                <span className="text-sm font-semibold text-yellow-300">Pro Tip</span>
              </div>
              <p className="text-sm text-gray-300">
                Focus on 1-3 tasks that will have the biggest impact on your goals today.
                Click on any task to edit it, and check them off as you complete them.
              </p>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="card-mm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-mm-white flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-mm-blue" />
                Today's Activity
              </h2>
            </div>

            <div className="space-y-4">
              {/* Weight Entry */}
              {dailyEntry?.weight_kg && (
                <div className="flex items-center gap-3 p-3 bg-mm-blue/10 rounded-lg border border-mm-blue/20">
                  <div className="w-2 h-2 bg-mm-blue rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-mm-white">Weight Updated</div>
                    <div className="text-xs text-gray-400">{dailyEntry.weight_kg} kg logged</div>
                  </div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
              )}

              {/* Deep Work Session */}
              {dailyEntry?.deep_work_completed && (
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-mm-white">Deep Work Complete</div>
                    <div className="text-xs text-gray-400">Focus session finished</div>
                  </div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
              )}

              {/* MIT Completions */}
              {[dailyEntry?.mit_task_1_completed && dailyEntry?.mit_task_1,
                dailyEntry?.mit_task_2_completed && dailyEntry?.mit_task_2,
                dailyEntry?.mit_task_3_completed && dailyEntry?.mit_task_3
              ].filter(Boolean).map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-mm-white">Task Completed</div>
                    <div className="text-xs text-gray-400 truncate">{task}</div>
                  </div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
              ))}

              {/* Recent Food Entries */}
              {recentFoodEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-mm-white truncate">{entry.name}</div>
                    <div className="text-xs text-gray-400">
                      {entry.calories} cal • {entry.meal_type}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(entry.consumed_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!dailyEntry?.weight_kg && !dailyEntry?.deep_work_completed &&
               ![dailyEntry?.mit_task_1_completed, dailyEntry?.mit_task_2_completed, dailyEntry?.mit_task_3_completed].some(Boolean) &&
               recentFoodEntries.length === 0 && (
                <div className="text-center py-8">
                  <ClockIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No activity yet today</p>
                  <p className="text-gray-500 text-xs mt-1">Start tracking to see your progress here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProfileGuard>
  )
}