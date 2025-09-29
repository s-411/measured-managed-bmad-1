'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  XMarkIcon,
  ClockIcon,
  CalendarDaysIcon,
  PlusIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

type NirvanaSession = {
  id: string;
  session_date: string;
  session_type: string;
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  quality_rating: number; // 1-5
  exercises: string[];
  body_parts: string[];
  notes?: string;
  created_at: string;
};

const SESSION_TYPES = [
  'Handstands',
  'Press Handstand',
  'Mobility: Spine',
  'Mobility: Shoulders',
  'Mobility: Hips',
  'Mobility: Legs',
  'Strength: Core',
  'Strength: Arms',
  'Strength: Legs',
  'Flexibility',
  'Balance Training',
  'Flow Sequences',
  'Conditioning',
  'Recovery/Stretching',
  'Skill Practice'
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-500' }
];

const BODY_PARTS = [
  'Core', 'Shoulders', 'Arms', 'Wrists', 'Spine', 'Hips', 'Legs', 'Full Body'
];

export default function NirvanaPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<NirvanaSession[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState({
    session_type: '',
    duration_minutes: '',
    difficulty: '',
    quality_rating: '',
    exercises: [] as string[],
    body_parts: [] as string[],
    notes: ''
  });

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user, selectedDate]);

  const loadSessions = async () => {
    try {
      setLoading(true);

      // Get the week around the selected date
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - 3);
      const weekEnd = new Date(selectedDate);
      weekEnd.setDate(selectedDate.getDate() + 3);

      const { data, error } = await supabase
        .from('nirvana_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('session_date', weekStart.toISOString().split('T')[0])
        .lte('session_date', weekEnd.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Error loading Nirvana sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSession.session_type || !newSession.duration_minutes ||
        !newSession.difficulty || !newSession.quality_rating) return;

    try {
      const { data, error } = await supabase
        .from('nirvana_sessions')
        .insert({
          user_id: user.id,
          session_date: selectedDate.toISOString().split('T')[0],
          session_type: newSession.session_type,
          duration_minutes: parseInt(newSession.duration_minutes),
          difficulty: newSession.difficulty,
          quality_rating: parseInt(newSession.quality_rating),
          exercises: newSession.exercises,
          body_parts: newSession.body_parts,
          notes: newSession.notes
        })
        .select()
        .single();

      if (error) throw error;

      setSessions([data, ...sessions]);
      setNewSession({
        session_type: '',
        duration_minutes: '',
        difficulty: '',
        quality_rating: '',
        exercises: [],
        body_parts: [],
        notes: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const quickAddSession = async (sessionType: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('nirvana_sessions')
        .insert({
          user_id: user.id,
          session_date: selectedDate.toISOString().split('T')[0],
          session_type: sessionType,
          duration_minutes: 30, // Default duration
          difficulty: 'intermediate', // Default difficulty
          quality_rating: 4, // Default rating
          exercises: [],
          body_parts: [],
          notes: ''
        })
        .select()
        .single();

      if (error) throw error;

      setSessions([data, ...sessions]);
    } catch (error) {
      console.error('Error quick-adding session:', error);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const getWeekDays = () => {
    const week = [];
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => session.session_date === dateStr);
  };

  const getTodaysSessions = () => {
    return getSessionsForDate(selectedDate);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mm-white mb-4">Please log in</h1>
          <p className="text-mm-gray">You need to be logged in to track Nirvana sessions.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-mm-white">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mm-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mm-white mb-2 flex items-center gap-3">
              <SparklesIcon className="h-8 w-8 text-purple-500" />
              Nirvana Training
            </h1>
            <p className="text-mm-gray">Track your gymnastics, mobility, and handstand practice</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Session
          </button>
        </div>

        {/* Date Navigation */}
        <div className="bg-mm-card rounded-xl p-6 mb-8 border border-mm-border">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-mm-darker rounded-lg text-mm-gray hover:text-mm-white"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold text-mm-white">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>

            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-mm-darker rounded-lg text-mm-gray hover:text-mm-white"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {getWeekDays().map((day, index) => {
              const daySessions = getSessionsForDate(day);
              const isToday = day.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isToday
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-mm-border hover:border-purple-500/50'
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-center">
                    <div className="text-sm text-mm-gray">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-semibold text-mm-white">
                      {day.getDate()}
                    </div>
                    {daySessions.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                          {daySessions.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Add Session Types */}
        <div className="bg-mm-card rounded-xl p-6 mb-8 border border-mm-border">
          <h3 className="text-lg font-semibold text-mm-white mb-4">Quick Add Session</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {SESSION_TYPES.slice(0, 10).map(sessionType => (
              <button
                key={sessionType}
                onClick={() => quickAddSession(sessionType)}
                className="p-3 bg-mm-darker hover:bg-purple-600/20 border border-mm-border hover:border-purple-500 rounded-lg text-sm text-mm-white transition-colors"
              >
                {sessionType}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="bg-mm-card rounded-xl p-6 border border-mm-border">
          <h3 className="text-lg font-semibold text-mm-white mb-4">
            Sessions for {selectedDate.toLocaleDateString()}
          </h3>

          {getTodaysSessions().length === 0 ? (
            <div className="text-center py-8">
              <SparklesIcon className="h-12 w-12 text-mm-gray mx-auto mb-4" />
              <p className="text-mm-gray">No training sessions recorded for this day</p>
              <p className="text-mm-gray text-sm">Use Quick Add or Add Session to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getTodaysSessions().map(session => (
                <div key={session.id} className="bg-mm-darker rounded-lg p-4 border border-mm-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <SparklesIcon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-mm-white">{session.session_type}</h4>
                        <p className="text-sm text-mm-gray">
                          {session.duration_minutes} min • {session.difficulty} •
                          {Array.from({length: session.quality_rating}, (_, i) => (
                            <StarIconSolid key={i} className="inline h-4 w-4 text-yellow-500 ml-1" />
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-mm-gray">
                        {new Date(session.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {session.body_parts.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm text-mm-gray">Body parts: </span>
                      <span className="text-sm text-mm-white">
                        {session.body_parts.join(', ')}
                      </span>
                    </div>
                  )}

                  {session.exercises.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm text-mm-gray">Exercises: </span>
                      <span className="text-sm text-mm-white">
                        {session.exercises.join(', ')}
                      </span>
                    </div>
                  )}

                  {session.notes && (
                    <div className="mt-2 p-2 bg-mm-card rounded text-sm text-mm-gray">
                      {session.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Session Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-mm-card rounded-xl p-6 w-full max-w-2xl border border-mm-border max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-mm-white">Add Training Session</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-mm-gray hover:text-mm-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={addSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Session Type
                  </label>
                  <select
                    value={newSession.session_type}
                    onChange={(e) => setNewSession({ ...newSession, session_type: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    required
                  >
                    <option value="">Select session type...</option>
                    {SESSION_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newSession.duration_minutes}
                      onChange={(e) => setNewSession({ ...newSession, duration_minutes: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      placeholder="30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newSession.difficulty}
                      onChange={(e) => setNewSession({ ...newSession, difficulty: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      required
                    >
                      <option value="">Select...</option>
                      {DIFFICULTY_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Quality (1-5)
                    </label>
                    <select
                      value={newSession.quality_rating}
                      onChange={(e) => setNewSession({ ...newSession, quality_rating: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      required
                    >
                      <option value="">Rate...</option>
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Body Parts Worked (optional)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {BODY_PARTS.map(part => (
                      <button
                        key={part}
                        type="button"
                        onClick={() => toggleArrayItem(
                          newSession.body_parts,
                          part,
                          (newArray) => setNewSession({ ...newSession, body_parts: newArray })
                        )}
                        className={`p-2 text-xs rounded border transition-colors ${
                          newSession.body_parts.includes(part)
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'bg-mm-darker border-mm-border text-mm-gray hover:border-purple-500'
                        }`}
                      >
                        {part}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Exercises (comma-separated, optional)
                  </label>
                  <input
                    type="text"
                    value={newSession.exercises.join(', ')}
                    onChange={(e) => setNewSession({
                      ...newSession,
                      exercises: e.target.value.split(',').map(ex => ex.trim()).filter(ex => ex)
                    })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    placeholder="Handstand hold, L-sits, Press practice..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newSession.notes}
                    onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white h-20"
                    placeholder="How did the session feel? Any breakthroughs or challenges?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-mm-darker hover:bg-mm-darker/80 text-mm-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
