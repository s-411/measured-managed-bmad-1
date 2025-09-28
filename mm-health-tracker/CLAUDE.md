# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MM Health Tracker is a comprehensive health and fitness tracking application built with Next.js 15.5.3, React 19, and TypeScript. The application focuses on detailed health metrics including calorie tracking, exercise logging, injection management, and specialized Nirvana Life training (gymnastics/mobility) tracking with advanced analytics.

## Common Commands

### Development
```bash
npm run dev          # Start development server (default port 3000)
npm run dev -- -p 3001  # Start development server on specific port (commonly used)
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Dependencies
- **Node.js**: >=18.0.0 required
- **Core**: Next.js 15.5.3, React 19.1.0, TypeScript 5, Tailwind CSS 4
- **UI**: Heroicons, Recharts for data visualization
- **No test framework**: Currently no testing setup configured

## Architecture Overview

### Data Storage Strategy
The application uses **localStorage-based persistence** with a sophisticated storage layer (`src/lib/storage.ts`) containing 11 specialized storage modules:

- `profileStorage` - User profile and BMR calculations
- `dailyEntryStorage` - Daily health metrics (calories, exercise, weight)
- `nirvanaSessionStorage` - Nirvana Life training sessions (per-date)
- `nirvanaProgressStorage` - Progress milestones and personal records
- `bodyPartMappingStorage` - Session-to-body-part correlations
- `sessionCorrelationStorage` - AI-powered training pattern analysis
- `injectionTargetStorage` - Injectable compound management
- `weeklyEntryStorage` - Weekly objectives and reviews
- Plus food templates, compounds, and custom metrics storage

**Critical Pattern**: All storage modules handle date serialization/deserialization and provide SSR-safe fallbacks with `typeof window === 'undefined'` checks.

**Calculation Engine**: Embedded `calculations` module within storage.ts provides BMR-based daily metrics with calorie balance computation (`bmr - consumed + burned`).

### Application Structure

**Layout Architecture**:
- `AppProvider` (Context) → `AppShell` (Navigation) → Page Content
- `AppShell` provides responsive sidebar (desktop) + bottom navigation (mobile)
- All pages use consistent card-based layouts with `card-mm` class

**Page Hierarchy**:
- `/daily` - Primary dashboard for daily health tracking
- `/nirvana` - Specialized gymnastics/mobility session tracking with progress milestones
- `/analytics` - Comprehensive data visualization with 6 distinct analysis types
- `/calculator` - BMR and peptide calculators
- `/calories` - Calorie and macro tracking
- `/injections` - Injectable compound logging
- `/settings` - Configuration management

### Type System Architecture

**Core Data Models** (`src/types/index.ts`):
- `DailyEntry` - Central daily health record with date-keyed structure
- `NirvanaEntry` - Specialized training session data with body part correlations
- `UserProfile` - BMR-centric user configuration
- `CorrelationAnalysis` - AI-generated training insights and recommendations

**Key Pattern**: All data interfaces include `createdAt`/`updatedAt` timestamps and use string date keys (`YYYY-MM-DD` format) for consistent indexing.

### Styling System

**Tailwind CSS 4.0 Theme** (`src/app/globals.css`):
- **Brand Colors**: `--color-mm-blue: #00A1FE` (primary), dark theme variants
- **Typography**: National2Condensed (headings), ESKlarheit (body)
- **Component Classes**: `.btn-mm`, `.card-mm`, `.input-mm` for consistency
- **Border Radius**: `--radius-mm: 100px` for signature button styling

**Design Patterns**:
- Dark theme default (`bg-mm-dark text-mm-white`)
- Mobile-first responsive grid layouts
- Color-coded analytics (purple for Nirvana, blue for core metrics)

### Analytics Architecture

**Multi-layered Analytics System**:
1. **Daily Metrics Calculation** - BMR-based calorie balancing
2. **Nirvana Training Analytics** - 6 visualization types (streaks, frequency, correlations)
3. **Body Part Heat Mapping** - Visual training frequency analysis
4. **Session Correlation Analysis** - AI pattern recognition with confidence scoring

**Data Processing Pattern**: Analytics load data reactively using multiple storage modules and compute derived metrics client-side with statistical confidence measures.

## Key Implementation Patterns

### Date Handling
- All dates stored as `YYYY-MM-DD` strings for localStorage keys
- Consistent `+ 'T12:00:00'` suffix for timezone-safe Date object creation
- Week calculations use Monday-based weeks with `getWeekStartDate()` utility

### State Management
- **React Context + useReducer**: `AppProvider` with centralized reducer for global state management
- **Specialized Hooks**: `useProfile()`, `useDailyEntry()`, `useHealthMetrics()` for domain-specific state
- **Hybrid Architecture**: Global context for daily entries, localStorage-direct for specialized systems (Nirvana)
- **Real-time Sync**: Automatic localStorage persistence with useEffect watchers

### Component Architecture
- Page components handle their own data loading and storage operations
- Shared utilities in `/lib` for calculations and date operations
- Consistent modal patterns for data entry (see Nirvana personal records)

### Error Boundaries
- `safeParseJSON()` utility with fallbacks for corrupted localStorage
- SSR-safe storage access patterns
- Graceful degradation for missing data

## Critical Development Notes

### Storage Module Pattern
When adding new data types, follow the established storage module pattern:
1. Define TypeScript interfaces in `src/types/index.ts`
2. Create storage module with `get()`, `save()`, CRUD operations
3. Handle date serialization and SSR safety (`typeof window === 'undefined'`)
4. Add to main storage imports where needed
5. **Dual-Architecture**: Use Context for daily entries, direct localStorage for specialized features

### Context vs Direct Storage Decision Tree
- **Use Context**: Daily health metrics (calories, exercise, weight) that need global state
- **Use Direct Storage**: Specialized features (Nirvana, analytics) with complex data structures
- **Integration Point**: Analytics page imports from both systems for unified reporting

### Analytics Integration
New metrics should integrate with the analytics system:
1. Add data processing in `loadAnalyticsData()`
2. Extend `AnalyticsData` interface
3. Create visualization components following Recharts patterns
4. Maintain consistent color coding and responsive design

### Nirvana System Extensions
The Nirvana training system is highly extensible:
- Session types are configurable via `nirvanaSessionTypesStorage`
- Body part mappings support intensity levels and position coordinates
- Correlation analysis provides AI-powered training insights
- Progress milestones follow ordered, categorized structure

## Development Port Configuration
The application commonly runs on port 3001 (not default 3000) based on development patterns observed in the codebase. Use `npm run dev -- -p 3001` for consistency with existing development workflow.