# Epic 1: Foundation & Core Health Tracking

**Epic Goal**: Establish the foundational infrastructure and core health tracking capabilities that all other features will build upon. This epic delivers a functional health tracker with BMR-based calorie calculations, daily tracking dashboard, and essential data persistence using localStorage.

## Story 1.1: Project Setup and Infrastructure

As a developer,
I want to initialize the Next.js project with all necessary configurations,
so that we have a solid foundation for building the application.

### Acceptance Criteria
1. Next.js 15.5+ project initialized with TypeScript 5 and App Router
2: Tailwind CSS 4.0 configured with MM Design System theme
3: ESLint and Prettier configured with consistent code style rules
4: Git repository initialized with proper .gitignore
5: Basic folder structure created (components/, lib/, types/, app/)
6: Package.json configured with necessary scripts (dev, build, lint)
7: Vercel deployment configured with preview environments
8: README.md with setup instructions and project overview

## Story 1.2: localStorage Storage Layer

As a developer,
I want to implement a robust localStorage abstraction layer,
so that all features can reliably persist and retrieve data.

### Acceptance Criteria
1: Storage service with get/set/delete operations for all data types
2: Date serialization/deserialization handling YYYY-MM-DD format
3: SSR safety checks (typeof window !== 'undefined')
4: Error handling for quota exceeded and corrupted data
5: TypeScript interfaces for all storage data structures
6: Storage keys constants file with all 47+ keys defined
7: Debug utilities for localStorage inspection in development
8: Unit tests for all storage operations

## Story 1.3: User Profile Management

As a user,
I want to create and manage my health profile,
so that the app can calculate my personalized BMR and calorie targets.

### Acceptance Criteria
1: Profile form with fields: age, gender, height, weight, activity level
2: BMR calculation using Mifflin-St Jeor formula
3: TDEE calculation based on activity multiplier
4: Profile data persisted to localStorage (mm-health-profile key)
5: Profile update triggers BMR recalculation
6: Form validation with appropriate error messages
7: Success confirmation after profile save
8: Profile data available throughout app via Context

## Story 1.4: Daily Dashboard Layout

As a user,
I want to see my daily health metrics in a unified dashboard,
so that I can track my progress at a glance.

### Acceptance Criteria
1: Dashboard route at /daily with responsive layout
2: Card-based layout using MM Design System styles
3: Header showing current date with navigation to previous/next days
4: Calorie balance card showing consumed vs. target
5: Weight card with current weight and trend indicator
6: Exercise summary card (placeholder for now)
7: Quick entry button for adding new data
8: Mobile-responsive grid layout

## Story 1.5: Daily Calorie Tracking

As a user,
I want to log my daily calorie consumption,
so that I can monitor my caloric intake against my targets.

### Acceptance Criteria
1: Modal form for calorie entry with amount and meal type
2: Meal types: Breakfast, Lunch, Dinner, Snacks
3: Running total of calories for the day
4: Visual progress bar showing calories vs. target
5: Calorie entries saved to localStorage (mm-daily-entry-{date})
6: Edit and delete functionality for existing entries
7: Real-time balance calculation (target - consumed)
8: Color-coded feedback (green=under, yellow=near, red=over target)

## Story 1.6: Weight Tracking

As a user,
I want to record my daily weight,
so that I can monitor trends over time.

### Acceptance Criteria
1: Weight entry form in daily dashboard
2: Weight saved with current date to localStorage
3: Display of current weight with change from previous entry
4: 7-day moving average calculation
5: Trend indicator (up/down/stable)
6: Weight changes trigger BMR recalculation prompt
7: Validation for reasonable weight ranges
8: Unit support (lbs/kg) based on user preference

## Story 1.7: Basic Navigation and Layout

As a user,
I want to navigate between different sections of the app,
so that I can access all features easily.

### Acceptance Criteria
1: Navigation bar with links to all major sections
2: Mobile hamburger menu for small screens
3: Active state indication for current page
4: Footer with version and basic info
5: Consistent layout wrapper for all pages
6: Loading states for data fetching
7: Error boundary for graceful error handling
8: 404 page for invalid routes