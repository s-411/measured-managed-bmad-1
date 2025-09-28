'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDaysIcon,
  BeakerIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FireIcon,
  CalculatorIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  CalendarDaysIcon as CalendarDaysIconSolid,
  BeakerIcon as BeakerIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid,
  CalculatorIcon as CalculatorIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  {
    href: '/daily',
    label: 'Daily Tracker',
    icon: CalendarDaysIcon,
    iconSolid: CalendarDaysIconSolid
  },
  {
    href: '/calories',
    label: 'Calories',
    icon: FireIcon,
    iconSolid: FireIconSolid
  },
  {
    href: '/injections',
    label: 'Injections',
    icon: BeakerIcon,
    iconSolid: BeakerIconSolid
  },
  {
    href: '/nirvana',
    label: 'Nirvana',
    icon: SparklesIcon,
    iconSolid: SparklesIconSolid
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid
  },
  {
    href: '/calculator',
    label: 'Calculator',
    icon: CalculatorIcon,
    iconSolid: CalculatorIconSolid
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-mm-dark border-r border-mm-gray/20 min-h-screen">
      <div className="p-6">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="gradient-icon gradient-activities w-10 h-10">
            <HeartIconSolid className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-heading text-mm-blue">MM Health</h1>
            <p className="text-xs text-mm-gray">Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="mt-auto p-6 border-t border-mm-gray/20">
        <div className="text-center">
          <p className="text-xs text-mm-gray mb-2">Phase 0.2</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-mm-blue rounded-full"></div>
            <div className="w-2 h-2 bg-mm-gray/30 rounded-full"></div>
            <div className="w-2 h-2 bg-mm-gray/30 rounded-full"></div>
            <div className="w-2 h-2 bg-mm-gray/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-mm-dark2 border-t border-mm-gray/20 z-50">
      <div className="grid grid-cols-4 py-2">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-mm-dark">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}