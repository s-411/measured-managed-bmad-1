'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Temporarily disabled - needs migration to new storage system
// import { profileStorage, dataExport, compoundStorage, foodTemplateStorage, FoodTemplate, injectionTargetStorage, nirvanaSessionTypesStorage } from '@/lib/storage';
import { UserProfile, DailyTrackerSettings, InjectionTarget } from '@/types';
import { 
  UserIcon,
  BeakerIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  FireIcon,
  CalendarDaysIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function SettingsPageContent() {
  // Temporarily return placeholder while migrating to new storage system
  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-mm-white mb-4">Settings</h1>
        <p className="text-mm-gray">This page is being updated to work with the new database system.</p>
        <p className="text-mm-gray mt-2">Please check back soon!</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 flex items-center justify-center min-h-screen"><p className="text-mm-gray">Loading settings...</p></div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
