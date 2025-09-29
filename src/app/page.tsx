'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useProfile } from '@/lib/context/ProfileContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [redirectMessage, setRedirectMessage] = useState('Loading...');

  useEffect(() => {
    if (authLoading || profileLoading) {
      setRedirectMessage('Checking your account...');
      return;
    }

    if (!user) {
      setRedirectMessage('Redirecting to login...');
      router.replace('/auth/login');
      return;
    }

    if (!profile) {
      setRedirectMessage('Setting up your profile...');
      router.replace('/profile/setup');
    } else {
      setRedirectMessage('Redirecting to Daily Tracker...');
      router.replace('/daily');
    }
  }, [router, user, profile, authLoading, profileLoading]);

  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-mm-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mm-blue mx-auto mb-4"></div>
        <p className="text-mm-white">{redirectMessage}</p>
      </div>
    </div>
  );
}