'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import { useProfile } from '@/lib/context/ProfileContext'
import { dailyEntryService } from '@/lib/services/daily'
import { ProfileGuard } from '@/components/guards/ProfileGuard'
import { DailySummaryCard } from '@/components/dashboard/DailySummaryCard'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { Database } from '@/lib/supabase/types'

type DailyEntry = Database['public']['Tables']['daily_entries']['Row']

export default function DailyDashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const { profile } = useProfile()

  // Weight tracking state
  const [showWeightForm, setShowWeightForm] = useState(false)
  const [weightInput, setWeightInput] = useState('')

  // MIT tasks state
  const [mitTaskInputs, setMitTaskInputs] = useState({
    task1: '',
    task2: '',
    task3: ''
  })

  useEffect(() => {
    if (user && profile) {
      loadDailyEntry(currentDate)
    }
  }, [user, profile, currentDate])

  const loadDailyEntry = async (date: string) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const entry = await dailyEntryService.getDailyEntry(user.id, date)
      setDailyEntry(entry)

      // Pre-populate weight input
      if (entry?.weight_kg) {
        setWeightInput(entry.weight_kg.toString())
      } else {
        setWeightInput('')
      }

      // Pre-populate MIT inputs
      if (entry) {
        setMitTaskInputs({
          task1: entry.mit_task_1 || '',
          task2: entry.mit_task_2 || '',
          task3: entry.mit_task_3 || ''
        })
      } else {
        setMitTaskInputs({ task1: '', task2: '', task3: '' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load daily entry')
    } finally {
      setLoading(false)
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
        const updatedEntry = await dailyEntryService.updateWeight(user.id, currentDate, weight)
        setDailyEntry(updatedEntry)
        setShowWeightForm(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update weight')
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

      const updatedEntry = await dailyEntryService.updateMITTasks(user.id, currentDate, mitData)
      setDailyEntry(updatedEntry)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update MIT task')
    }
  }

  const toggleDeepWork = async () => {
    if (!user) return

    try {
      const updatedEntry = await dailyEntryService.toggleDeepWork(user.id, currentDate)
      setDailyEntry(updatedEntry)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle deep work')
    }
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
        {/* Header with Date Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mm-white mb-2">Daily Dashboard</h1>
            <p className="text-gray-400">Track your daily health metrics and goals</p>
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

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Daily Summary Card */}
        <div className="mb-8">
          <DailySummaryCard entry={dailyEntry} />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Weight Tracking */}
          <div className="card-mm p-6">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Weight</h3>

            {dailyEntry?.weight_kg && (
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-mm-blue">{dailyEntry.weight_kg} kg</div>
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

          {/* Deep Work */}
          <div className="card-mm p-6">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Deep Work</h3>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-purple-400">
                {dailyEntry?.deep_work_completed ? '✓' : '○'}
              </div>
            </div>

            <button
              onClick={toggleDeepWork}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                dailyEntry?.deep_work_completed
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {dailyEntry?.deep_work_completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
          </div>

          {/* Calorie Tracking */}
          <div className="card-mm p-6">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Calories</h3>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-orange-400">
                {dailyEntry?.calories_consumed || 0}
              </div>
              <div className="text-sm text-gray-400">consumed</div>
            </div>

            <a
              href="/calories"
              className="btn-mm w-full py-2 text-center block"
            >
              Track Food
            </a>
          </div>

          {/* Exercise */}
          <div className="card-mm p-6">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Exercise</h3>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-400">
                {dailyEntry?.calories_burned_exercise || 0}
              </div>
              <div className="text-sm text-gray-400">burned</div>
            </div>

            <a
              href="/exercise"
              className="btn-mm w-full py-2 text-center block"
            >
              Log Exercise
            </a>
          </div>
        </div>

        {/* MIT Tasks */}
        <div className="card-mm p-6">
          <h2 className="text-xl font-semibold text-mm-white mb-6">Most Important Tasks (MITs)</h2>

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
                <div key={taskNum} className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-8 h-8 rounded-full bg-mm-blue/20 text-mm-blue text-sm flex items-center justify-center font-bold">
                      {taskNum}
                    </span>
                    <input
                      type="text"
                      value={mitTaskInputs[taskKey]}
                      onChange={(e) => setMitTaskInputs(prev => ({ ...prev, [taskKey]: e.target.value }))}
                      onBlur={() => {
                        if (mitTaskInputs[taskKey] !== task) {
                          updateMITTask(taskNum as 1 | 2 | 3, mitTaskInputs[taskKey], completed || false)
                        }
                      }}
                      className="input-mm flex-1"
                      placeholder={`Most Important Task ${taskNum}`}
                    />
                  </div>

                  {task && (
                    <button
                      onClick={() => updateMITTask(taskNum as 1 | 2 | 3, task, !completed)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-green-500 hover:bg-green-500/20'
                      }`}
                    >
                      {completed && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
            <p className="text-sm text-yellow-300">
              💡 <strong>Tip:</strong> Focus on 1-3 tasks that will have the biggest impact on your goals today.
            </p>
          </div>
        </div>
      </div>
    </ProfileGuard>
  )
}