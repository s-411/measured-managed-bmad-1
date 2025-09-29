'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useProfile } from '@/lib/context/ProfileContext';
import { AnalyticsService, AnalyticsOverview, WeightData, CalorieData, MacroData, WorkoutData, InjectionData, ProductivityData } from '@/lib/analytics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ChartBarIcon,
  ScaleIcon,
  BriefcaseIcon,
  BeakerIcon,
  TrophyIcon,
  FireIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

interface OverviewCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}

function OverviewCard({ title, value, change, trend, icon: Icon, color }: OverviewCardProps) {
  const trendIcon = trend === 'up' ? ArrowTrendingUpIcon : trend === 'down' ? ArrowTrendingDownIcon : null;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-mm-gray';

  return (
    <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-mm-gray text-sm font-medium">{title}</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-mm-white">{value}</p>
            {change && trendIcon && (
              <div className={`ml-2 flex items-center ${trendColor}`}>
                <trendIcon className="h-4 w-4" />
                <span className="text-sm ml-1">{change}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [calorieData, setCalorieData] = useState<CalorieData[]>([]);
  const [macroData, setMacroData] = useState<MacroData[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [injectionData, setInjectionData] = useState<InjectionData[]>([]);
  const [productivityData, setProductivityData] = useState<ProductivityData[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id, timeRange]);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const analytics = new AnalyticsService();

      const [
        overviewData,
        weights,
        calories,
        macros,
        workouts,
        injections,
        productivity
      ] = await Promise.all([
        analytics.getOverview(user.id, timeRange),
        analytics.getWeightTrend(user.id, timeRange),
        analytics.getCalorieBalance(user.id, timeRange),
        analytics.getMacroTrend(user.id, timeRange),
        analytics.getWorkoutSummary(user.id, timeRange),
        analytics.getInjectionAdherence(user.id, timeRange),
        analytics.getMITCompletion(user.id, timeRange)
      ]);

      setOverview(overviewData);
      setWeightData(weights);
      setCalorieData(calories);
      setMacroData(macros);
      setWorkoutData(workouts);
      setInjectionData(injections);
      setProductivityData(productivity);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-primary mb-4 mx-auto"></div>
          <p className="text-mm-gray">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mm-white mb-4">Analytics Dashboard</h1>
          <p className="text-mm-gray">No data available yet. Start tracking to see your analytics!</p>
        </div>
      </div>
    );
  }

  const formatWeight = (weight: number | null) => weight ? `${weight.toFixed(1)} kg` : 'N/A';
  const formatChange = (change: number | null, unit: string = '') => {
    if (change === null) return null;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}${unit}`;
  };

  return (
    <div className="min-h-screen bg-mm-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-mm-white">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === days
                    ? 'bg-mm-primary text-white'
                    : 'bg-mm-card text-mm-gray hover:text-mm-white border border-mm-border'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="Current Weight"
            value={formatWeight(overview.currentWeight)}
            change={formatChange(overview.weightChange7Days, ' kg')}
            trend={overview.weightChange7Days && overview.weightChange7Days > 0 ? 'up' : overview.weightChange7Days && overview.weightChange7Days < 0 ? 'down' : 'neutral'}
            icon={ScaleIcon}
            color="bg-blue-500"
          />
          <OverviewCard
            title="Calorie Balance (7d)"
            value={overview.avgCalorieBalance7Days ? Math.round(overview.avgCalorieBalance7Days) : 'N/A'}
            change={formatChange(overview.avgCalorieBalance30Days ? overview.avgCalorieBalance7Days - overview.avgCalorieBalance30Days : null)}
            trend={overview.avgCalorieBalance7Days && overview.avgCalorieBalance7Days > 0 ? 'up' : 'down'}
            icon={FireIcon}
            color="bg-orange-500"
          />
          <OverviewCard
            title="MIT Completion (7d)"
            value={`${Math.round(overview.mitCompletionRate7Days)}%`}
            change={formatChange(overview.mitCompletionRate7Days - overview.mitCompletionRate30Days, '%')}
            trend={overview.mitCompletionRate7Days > overview.mitCompletionRate30Days ? 'up' : 'down'}
            icon={BriefcaseIcon}
            color="bg-green-500"
          />
          <OverviewCard
            title="Deep Work Streak"
            value={`${overview.deepWorkStreak} days`}
            icon={SparklesIcon}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Trend */}
          {weightData.length > 0 && (
            <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
              <h3 className="text-xl font-semibold text-mm-white mb-4 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2" />
                Weight Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Calorie Balance */}
          {calorieData.length > 0 && (
            <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
              <h3 className="text-xl font-semibold text-mm-white mb-4 flex items-center">
                <FireIcon className="h-5 w-5 mr-2" />
                Calorie Balance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={calorieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Macro Trends */}
          {macroData.length > 0 && (
            <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
              <h3 className="text-xl font-semibold text-mm-white mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Macro Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} name="Protein" />
                  <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} name="Carbs" />
                  <Line type="monotone" dataKey="fats" stroke="#f59e0b" strokeWidth={2} name="Fats" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Workout Summary */}
          {workoutData.length > 0 && (
            <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
              <h3 className="text-xl font-semibold text-mm-white mb-4 flex items-center">
                <TrophyIcon className="h-5 w-5 mr-2" />
                Workout Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Bar dataKey="totalCalories" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* MIT Completion */}
          {productivityData.length > 0 && (
            <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
              <h3 className="text-xl font-semibold text-mm-white mb-4 flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                MIT Completion Rate
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={productivityData.map(d => ({ ...d, completionRate: (d.mitCompleted / d.mitTotal) * 100 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Area type="monotone" dataKey="completionRate" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Injection Adherence */}
          {injectionData.length > 0 && (
            <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
              <h3 className="text-xl font-semibold text-mm-white mb-4 flex items-center">
                <BeakerIcon className="h-5 w-5 mr-2" />
                Injection Adherence
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={injectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Line type="monotone" dataKey="adherenceScore" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Training Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-mm-gray">Workouts (7d):</span>
                <span className="text-mm-white font-medium">{overview.totalWorkouts7Days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mm-gray">Workouts (30d):</span>
                <span className="text-mm-white font-medium">{overview.totalWorkouts30Days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mm-gray">Nirvana Sessions (7d):</span>
                <span className="text-mm-white font-medium">{overview.nirvanaSessions7Days}</span>
              </div>
            </div>
          </div>

          <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Health Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-mm-gray">Weight Change (30d):</span>
                <span className="text-mm-white font-medium">{formatChange(overview.weightChange30Days, ' kg') || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mm-gray">Injection Adherence:</span>
                <span className="text-mm-white font-medium">{Math.round(overview.injectionAdherence7Days)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-mm-card rounded-lg p-6 border border-mm-border">
            <h3 className="text-lg font-semibold text-mm-white mb-4">Goals</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-mm-gray">Active Milestones:</span>
                <span className="text-mm-white font-medium">{overview.activeMilestones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mm-gray">MIT Rate (30d):</span>
                <span className="text-mm-white font-medium">{Math.round(overview.mitCompletionRate30Days)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}