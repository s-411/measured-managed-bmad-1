'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  BeakerIcon,
  PlusIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

type InjectionCompound = {
  id: string;
  name: string;
  concentration: number;
  ester_type: string;
  half_life_days: number;
  category: string;
  weekly_target_mg: number;
  notes?: string;
};

type InjectionEntry = {
  id: string;
  compound_id: string;
  dose_mg: number;
  volume_ml: number;
  injection_site: string;
  injection_date: string;
  notes?: string;
  created_at: string;
};

const INJECTION_SITES = [
  { value: 'left_delt', label: 'Left Deltoid' },
  { value: 'right_delt', label: 'Right Deltoid' },
  { value: 'left_glute', label: 'Left Glute' },
  { value: 'right_glute', label: 'Right Glute' },
  { value: 'left_quad', label: 'Left Quad' },
  { value: 'right_quad', label: 'Right Quad' },
  { value: 'subq_abdomen', label: 'SubQ Abdomen' },
  { value: 'subq_thigh', label: 'SubQ Thigh' }
];

const ESTER_TYPES = [
  { value: 'acetate', label: 'Acetate' },
  { value: 'propionate', label: 'Propionate' },
  { value: 'cypionate', label: 'Cypionate' },
  { value: 'enanthate', label: 'Enanthate' },
  { value: 'decanoate', label: 'Decanoate' },
  { value: 'undecanoate', label: 'Undecanoate' }
];

const CATEGORIES = [
  { value: 'trt', label: 'TRT (Testosterone Replacement)' },
  { value: 'hrt', label: 'HRT (Hormone Replacement)' },
  { value: 'peptide', label: 'Peptide' },
  { value: 'other', label: 'Other' }
];

export default function InjectionsPage() {
  const { user } = useAuth();
  const [compounds, setCompounds] = useState<InjectionCompound[]>([]);
  const [entries, setEntries] = useState<InjectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompoundForm, setShowCompoundForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Form states
  const [newEntry, setNewEntry] = useState({
    compound_id: '',
    dose_mg: '',
    volume_ml: '',
    injection_site: '',
    injection_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [newCompound, setNewCompound] = useState({
    name: '',
    concentration: '',
    ester_type: '',
    half_life_days: '',
    category: '',
    weekly_target_mg: '',
    notes: ''
  });

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load compounds
      const { data: compoundsData, error: compoundsError } = await supabase
        .from('injectable_compounds')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (compoundsError) throw compoundsError;

      // Load recent injection entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('injection_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('injection_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('injection_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (entriesError) throw entriesError;

      setCompounds(compoundsData || []);
      setEntries(entriesData || []);
    } catch (error) {
      console.error('Error loading injection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCompound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCompound.name || !newCompound.concentration || !newCompound.ester_type ||
        !newCompound.half_life_days || !newCompound.category || !newCompound.weekly_target_mg) return;

    try {
      const { data, error } = await supabase
        .from('injectable_compounds')
        .insert({
          user_id: user.id,
          name: newCompound.name,
          concentration: parseFloat(newCompound.concentration),
          ester_type: newCompound.ester_type,
          half_life_days: parseFloat(newCompound.half_life_days),
          category: newCompound.category,
          weekly_target_mg: parseFloat(newCompound.weekly_target_mg),
          notes: newCompound.notes
        })
        .select()
        .single();

      if (error) throw error;

      setCompounds([...compounds, data]);
      setNewCompound({
        name: '',
        concentration: '',
        ester_type: '',
        half_life_days: '',
        category: '',
        weekly_target_mg: '',
        notes: ''
      });
      setShowCompoundForm(false);
    } catch (error) {
      console.error('Error adding compound:', error);
    }
  };

  const addInjection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEntry.compound_id || !newEntry.dose_mg || !newEntry.volume_ml || !newEntry.injection_site) return;

    try {
      const { data, error } = await supabase
        .from('injection_entries')
        .insert({
          user_id: user.id,
          compound_id: newEntry.compound_id,
          dose_mg: parseFloat(newEntry.dose_mg),
          volume_ml: parseFloat(newEntry.volume_ml),
          injection_site: newEntry.injection_site,
          injection_date: newEntry.injection_date,
          notes: newEntry.notes
        })
        .select()
        .single();

      if (error) throw error;

      setEntries([data, ...entries]);
      setNewEntry({
        compound_id: '',
        dose_mg: '',
        volume_ml: '',
        injection_site: '',
        injection_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding injection:', error);
    }
  };

  const getCompoundName = (compoundId: string) => {
    const compound = compounds.find(c => c.id === compoundId);
    return compound?.name || 'Unknown';
  };

  const getWeeklyProgress = (compoundId: string) => {
    const compound = compounds.find(c => c.id === compoundId);
    if (!compound) return { injected: 0, target: 0, percentage: 0 };

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyEntries = entries.filter(entry =>
      entry.compound_id === compoundId &&
      new Date(entry.injection_date) >= weekStart
    );

    const injected = weeklyEntries.reduce((sum, entry) => sum + entry.dose_mg, 0);
    const target = compound.weekly_target_mg;
    const percentage = target > 0 ? Math.round((injected / target) * 100) : 0;

    return { injected, target, percentage };
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mm-white mb-4">Please log in</h1>
          <p className="text-mm-gray">You need to be logged in to track injections.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-blue mx-auto mb-4"></div>
          <p className="text-mm-white">Loading injections...</p>
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
            <h1 className="text-3xl font-bold text-mm-white mb-2">Injectable Compounds</h1>
            <p className="text-mm-gray">Track your injection schedule and weekly targets</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCompoundForm(true)}
              className="bg-mm-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Compound
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <BeakerIcon className="h-5 w-5" />
              Log Injection
            </button>
          </div>
        </div>

        {/* Weekly Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {compounds.map(compound => {
            const progress = getWeeklyProgress(compound.id);
            const isOnTarget = progress.percentage >= 90 && progress.percentage <= 110;
            const isLow = progress.percentage < 90;

            return (
              <div key={compound.id} className="bg-mm-card rounded-xl p-6 border border-mm-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-mm-white">{compound.name}</h3>
                  {isOnTarget && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                  {isLow && <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-mm-gray">Weekly Progress</span>
                    <span className={`font-medium ${
                      isOnTarget ? 'text-green-500' :
                      isLow ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {progress.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-mm-darker rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isOnTarget ? 'bg-green-500' :
                        isLow ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-mm-gray">
                    <span>{progress.injected}mg injected</span>
                    <span>{progress.target}mg target</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Injections */}
        <div className="bg-mm-card rounded-xl p-6 border border-mm-border">
          <h2 className="text-xl font-semibold text-mm-white mb-4">Recent Injections</h2>

          {entries.length === 0 ? (
            <div className="text-center py-8">
              <BeakerIcon className="h-12 w-12 text-mm-gray mx-auto mb-4" />
              <p className="text-mm-gray">No injections recorded yet</p>
              <p className="text-mm-gray text-sm">Click "Log Injection" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 10).map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-mm-darker rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-mm-blue/20 p-2 rounded-lg">
                      <BeakerIcon className="h-5 w-5 text-mm-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-mm-white">{getCompoundName(entry.compound_id)}</h4>
                      <p className="text-sm text-mm-gray">
                        {entry.dose_mg}mg • {entry.volume_ml}ml • {INJECTION_SITES.find(s => s.value === entry.injection_site)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-mm-white">{new Date(entry.injection_date).toLocaleDateString()}</p>
                    <p className="text-xs text-mm-gray">{new Date(entry.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Compound Modal */}
        {showCompoundForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-mm-card rounded-xl p-6 w-full max-w-md border border-mm-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-mm-white">Add New Compound</h3>
                <button
                  onClick={() => setShowCompoundForm(false)}
                  className="text-mm-gray hover:text-mm-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={addCompound} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Compound Name
                  </label>
                  <input
                    type="text"
                    value={newCompound.name}
                    onChange={(e) => setNewCompound({ ...newCompound, name: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    placeholder="e.g., Testosterone"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Concentration (mg/ml)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCompound.concentration}
                      onChange={(e) => setNewCompound({ ...newCompound, concentration: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      placeholder="200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Ester Type
                    </label>
                    <select
                      value={newCompound.ester_type}
                      onChange={(e) => setNewCompound({ ...newCompound, ester_type: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      required
                    >
                      <option value="">Select ester...</option>
                      {ESTER_TYPES.map(ester => (
                        <option key={ester.value} value={ester.value}>
                          {ester.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Half-life (days)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCompound.half_life_days}
                      onChange={(e) => setNewCompound({ ...newCompound, half_life_days: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      placeholder="8"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Category
                    </label>
                    <select
                      value={newCompound.category}
                      onChange={(e) => setNewCompound({ ...newCompound, category: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      required
                    >
                      <option value="">Select category...</option>
                      {CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Weekly Target (mg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCompound.weekly_target_mg}
                    onChange={(e) => setNewCompound({ ...newCompound, weekly_target_mg: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    placeholder="200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newCompound.notes}
                    onChange={(e) => setNewCompound({ ...newCompound, notes: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white h-20"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCompoundForm(false)}
                    className="flex-1 bg-mm-darker hover:bg-mm-darker/80 text-mm-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-mm-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Compound
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Injection Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-mm-card rounded-xl p-6 w-full max-w-md border border-mm-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-mm-white">Log Injection</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-mm-gray hover:text-mm-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={addInjection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Compound
                  </label>
                  <select
                    value={newEntry.compound_id}
                    onChange={(e) => setNewEntry({ ...newEntry, compound_id: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    required
                  >
                    <option value="">Select compound...</option>
                    {compounds.map(compound => (
                      <option key={compound.id} value={compound.id}>
                        {compound.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Dose (mg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.dose_mg}
                      onChange={(e) => setNewEntry({ ...newEntry, dose_mg: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      placeholder="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mm-white mb-2">
                      Volume (ml)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newEntry.volume_ml}
                      onChange={(e) => setNewEntry({ ...newEntry, volume_ml: e.target.value })}
                      className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                      placeholder="0.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Injection Site
                  </label>
                  <select
                    value={newEntry.injection_site}
                    onChange={(e) => setNewEntry({ ...newEntry, injection_site: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    required
                  >
                    <option value="">Select injection site...</option>
                    {INJECTION_SITES.map(site => (
                      <option key={site.value} value={site.value}>
                        {site.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEntry.injection_date}
                    onChange={(e) => setNewEntry({ ...newEntry, injection_date: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mm-white mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    className="w-full bg-mm-darker border border-mm-border rounded-lg px-3 py-2 text-mm-white h-20"
                    placeholder="Additional notes..."
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
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Log Injection
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
