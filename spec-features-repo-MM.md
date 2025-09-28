# MM Health Tracker - Complete Feature Inventory & Specifications

## Project Overview
This is a comprehensive health and fitness tracking application built with Next.js 15.5.3, React 19, and TypeScript. The application uses localStorage for data persistence and focuses on detailed health metrics including calorie tracking, exercise logging, injection management, and specialized gymnastics/mobility training tracking with advanced analytics.

## All Features Summary
This application contains **14 major features** organized across 8 main pages:

### Core Health Tracking Features
1. **User Profile Management** - BMR-based profile setup and management
2. **Daily Health Tracking** - Comprehensive daily metrics dashboard
3. **Calorie & Macro Tracking** - Food intake and macro nutrient management
4. **Exercise Tracking** - Workout logging with calorie burn calculation
5. **Weight Tracking** - Daily weight monitoring and trends
6. **Injectable Compound Management** - Medical injection tracking and targets

### Productivity & Planning Features
7. **Deep Work Tracking** - Focus session completion tracking
8. **MIT Planning** - Most Important Tasks planning system
9. **Weekly Objectives** - Monday planning and Friday review system

### Specialized Training Features
10. **Nirvana Life Training** - Gymnastics/mobility session tracking
11. **Progress Milestones** - Achievement tracking for training goals
12. **Personal Records** - Performance record management
13. **Body Part Heat Mapping** - Training frequency visualization

### Analytics & Insights
14. **Comprehensive Analytics** - Multi-dimensional data analysis and correlation insights

## localStorage Keys Used
The application uses 47+ different localStorage keys organized into these patterns:

**Core Storage:**
- `mm-health-profile` - User profile data
- `mm-daily-entry-{date}` - Daily entries (one per day)
- `mm-weekly-entry-{weekStart}` - Weekly objectives (one per week)
- `mm-macro-targets` - User-set macro targets

**Nirvana Training Storage:**
- `mm-nirvana-{date}` - Daily training sessions
- `mm-nirvana-session-types` - Available session types
- `mm-nirvana-progress` - Milestones and personal records
- `mm-nirvana-body-mappings` - Session to body part correlations

**Injectable Management:**
- `mm-compounds` - Available compounds list
- `mm-injection-targets` - Weekly dosage targets
- `mm-food-templates` - Saved food templates

## Navigation Structure
The application has 8 main pages accessible through navigation:

1. **Daily Tracker** (`/daily`) - Primary dashboard
2. **Calories** (`/calories`) - Food and exercise tracking
3. **Injections** (`/injections`) - Compound management
4. **Nirvana** (`/nirvana`) - Specialized training
5. **Analytics** (`/analytics`) - Data visualization and insights
6. **Calculator** (`/calculator`) - BMR and peptide calculators
7. **Settings** (`/settings`) - Profile and configuration
8. **Profile** (`/profile`) - BMR calculator and profile setup

## Code Organization
**Main Storage Layer:** `src/lib/storage.ts` (1,320 lines) - Contains 11 specialized storage modules
**Type Definitions:** `src/types/index.ts` (306 lines) - 25+ TypeScript interfaces
**Core Context:** `src/lib/context.tsx` - Global state management with React Context + useReducer

## Individual Feature Specifications
Each feature below has been analyzed for:
- User journey and context
- Technology implementation
- Design patterns
- Data storage requirements
- Security/permissions
- Acceptance criteria

### Core Features:
- [User Profile Management](./spec/features/user-profile-management.md)
- [Daily Health Dashboard](./spec/features/daily-health-dashboard.md)
- [Calorie & Macro Tracking](./spec/features/calorie-macro-tracking.md)
- [Exercise Tracking](./spec/features/exercise-tracking.md)
- [Weight Monitoring](./spec/features/weight-monitoring.md)
- [Injectable Compound Management](./spec/features/injectable-compound-management.md)

### Productivity Features:
- [Deep Work Tracking](./spec/features/deep-work-tracking.md)
- [MIT Planning System](./spec/features/mit-planning-system.md)
- [Weekly Objectives Management](./spec/features/weekly-objectives-management.md)

### Specialized Training:
- [Nirvana Life Training](./spec/features/nirvana-life-training.md)
- [Progress Milestones](./spec/features/progress-milestones.md)
- [Personal Records Management](./spec/features/personal-records-management.md)
- [Body Part Heat Mapping](./spec/features/body-part-heat-mapping.md)

### Analytics:
- [Comprehensive Analytics Dashboard](./spec/features/comprehensive-analytics-dashboard.md)

## Technical Architecture Summary

**Data Storage Strategy:** localStorage-based with sophisticated JSON serialization/deserialization handling date objects and SSR safety.

**State Management:** Hybrid approach using React Context for daily entries and direct localStorage access for specialized features.

**Calculation Engine:** Built-in BMR-based calorie balance calculations with real-time metric computation.

**Date Handling:** Consistent YYYY-MM-DD string format with timezone-safe Date object creation using 'T12:00:00' suffix.

**Component Patterns:** Consistent card-based layouts, modal forms, and responsive grid systems using Tailwind CSS 4.0 custom theme.

## Migration Considerations

When rebuilding with a proper database:
1. **Preserve Data Structure** - The type definitions can be directly mapped to database schemas
2. **Maintain Date Consistency** - Keep YYYY-MM-DD string format for daily/weekly keys
3. **BMR Centrality** - Ensure BMR remains central to all calorie calculations
4. **Session Correlation Logic** - The AI-powered correlation analysis contains complex business logic
5. **Multi-tenant Architecture** - Add user authentication and data isolation
6. **Backup localStorage** - Export functionality already exists for data migration

Each feature specification contains detailed implementation guidance for database migration while preserving the exact user experience and business logic.

## Suggested Rebuild Order

1. **User Profile Management** — Foundation for all BMR-based calculations used throughout the application
   - **Depends on:** None (starting point)

2. **Weight Monitoring** — Simple daily tracking that feeds into profile updates and trend analysis
   - **Depends on:** User Profile Management

3. **Daily Health Dashboard (basic structure)** — Core interface framework to build other features into
   - **Depends on:** User Profile Management, Weight Monitoring

4. **Deep Work Tracking** — Simple boolean completion tracking provides early productivity wins
   - **Depends on:** Daily Health Dashboard

5. **Calorie & Macro Tracking** — Core health feature requiring BMR calculations for calorie balance
   - **Depends on:** User Profile Management, Daily Health Dashboard

6. **Exercise Tracking** — Natural extension of calorie tracking sharing similar patterns and UI
   - **Depends on:** Calorie & Macro Tracking

7. **MIT Planning System** — Simple task planning system extends the daily dashboard patterns
   - **Depends on:** Daily Health Dashboard

8. **Injectable Compound Management** — Standalone medical tracking with weekly targets and adherence
   - **Depends on:** User Profile Management

9. **Weekly Objectives Management** — Planning and review cycles build on established daily tracking patterns
   - **Depends on:** Daily Health Dashboard, MIT Planning System

10. **Nirvana Life Training** — Complex specialized training system with session types and progress tracking
    - **Depends on:** User Profile Management

11. **Progress Milestones** — Achievement tracking system that depends on training session data
    - **Depends on:** Nirvana Life Training

12. **Personal Records Management** — Performance tracking that extends the milestone system
    - **Depends on:** Nirvana Life Training, Progress Milestones

13. **Body Part Heat Mapping** — Complex visualization requiring session-to-anatomy correlation data
    - **Depends on:** Nirvana Life Training

14. **Comprehensive Analytics Dashboard** — Multi-dimensional analysis requiring data from all tracking systems
    - **Depends on:** All previous features

### Shared Building Blocks (build these first)
- User authentication and session management with secure multi-tenant data isolation
- Database schema migration scripts and seed data for session types and default milestones
- Generic CRUD form patterns with validation, error handling, and success states
- Date handling utilities maintaining YYYY-MM-DD format consistency and timezone safety
- BMR calculation utilities and real-time calorie balance computation engine
- Reusable UI components for cards, modals, progress indicators, and responsive grids
- Error, loading, and empty state components with consistent messaging
- Real-time data synchronization patterns for immediate UI updates

### Assumptions & Notes
- BMR calculation logic must be preserved exactly as implemented in the current system
- Date handling requires maintaining YYYY-MM-DD string format for database keys and consistency
- Complex session correlation analysis in analytics may need performance optimization for large datasets
- Nirvana training session types may benefit from admin configuration interface for customization
- Multi-user authentication system is required but not present in current localStorage implementation
- Weekly objectives are intentionally limited to exactly 3 objectives and Monday-Friday cycle
- MIT planning assumes single-day-ahead planning without multi-day or recurring task support