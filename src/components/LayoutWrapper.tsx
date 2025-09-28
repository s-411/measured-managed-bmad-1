'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/Navigation';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Auth routes don't need protection or AppShell
  if (pathname.startsWith('/auth')) {
    return <>{children}</>;
  }

  // All other routes need authentication and AppShell
  return (
    <ProtectedRoute>
      <AppShell>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}