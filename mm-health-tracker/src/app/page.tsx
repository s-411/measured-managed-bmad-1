'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileStorage } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const [redirectMessage, setRedirectMessage] = useState('Checking profile...');

  useEffect(() => {
    // Check if profile is complete
    const isProfileComplete = profileStorage.isComplete();
    
    if (isProfileComplete) {
      setRedirectMessage('Redirecting to Daily Tracker...');
      router.replace('/daily');
    } else {
      setRedirectMessage('Setting up your profile...');
      // Add first-time user flag to URL so settings page can show welcome message
      router.replace('/settings?firstTime=true');
    }
  }, [router]);

  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-mm-gray">{redirectMessage}</p>
      </div>
    </div>
  );
}