'use client';

import React from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { AppShell } from '@/components/Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <AppShell>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}