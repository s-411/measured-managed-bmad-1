# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

This repository contains multiple related projects for the Measured Managed ecosystem:

1. **MM Design System** (`design-system-cpn/`) - Complete styling package with Tailwind CSS 4.0
2. **MM Health Tracker** (`mm-health-tracker/`) - Comprehensive health and fitness tracking application
3. **Project Documentation** (`spec/`, `Project Overview/`) - Feature specifications and implementation guides

## Common Commands

### MM Health Tracker
```bash
cd mm-health-tracker
npm run dev          # Start development server (port 3000)
npm run dev -- -p 3001  # Start on port 3001 (commonly used)
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Design System
The design system is a standalone CSS package without its own build commands. Import `design-system-cpn/styles/globals.css` in applications.

## Architecture Overview

### Repository Structure
```
/
├── mm-health-tracker/           # Main Next.js application
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities and storage layer
│   │   └── types/              # TypeScript definitions
│   └── package.json            # Dependencies and scripts
│
├── design-system-cpn/           # Shared design system
│   ├── styles/globals.css      # Tailwind 4.0 theme
│   ├── fonts/                  # Custom fonts
│   └── examples/               # Component examples
│
└── spec/features/               # Feature specifications
```

### MM Health Tracker Architecture

**Technology Stack:**
- Next.js 15.5.3, React 19.1.0, TypeScript 5
- Tailwind CSS 4.0 with custom theme
- localStorage-based persistence (no database)
- Recharts for data visualization

**Data Storage Layer** (`mm-health-tracker/src/lib/storage.ts`):
11 specialized storage modules handling different data domains:
- User profiles and BMR calculations
- Daily health entries (calories, exercise, weight)
- Nirvana Life training sessions
- Injectable compound management
- Weekly objectives and MIT planning

**State Management:**
- React Context + useReducer for global state
- Hybrid approach: Context for daily entries, direct localStorage for specialized features
- Date-keyed storage using `YYYY-MM-DD` format

**Key Features:**
1. BMR-based calorie tracking with real-time balance calculation
2. Comprehensive exercise logging with calorie burn
3. Injectable compound tracking with weekly targets
4. Nirvana Life training (gymnastics/mobility) with progress milestones
5. Advanced analytics with 6+ visualization types
6. MIT planning and weekly objectives management

### Design System Architecture

**Theme Configuration** (`design-system-cpn/styles/globals.css`):
- **Brand Color**: `--color-mm-blue: #00A1FE` (single source of truth)
- **Dark Theme**: mm-dark (#1f1f1f), mm-dark2 (#2a2a2a)
- **Typography**: National2Condensed (headings), ESKlarheit (body)
- **Border Radius**: `--radius-mm: 100px` for signature button styling

**Component Classes:**
- `.btn-mm` - Primary blue buttons
- `.card-mm` - Dark theme cards
- `.input-mm` - Form inputs with blue focus
- `.glass-card` - Semi-transparent cards

## Key Implementation Patterns

### Date Handling
- All dates stored as `YYYY-MM-DD` strings
- Timezone-safe Date creation with `+ 'T12:00:00'` suffix
- Monday-based weeks for weekly objectives

### Storage Module Pattern
When adding new data types:
1. Define TypeScript interface in `src/types/index.ts`
2. Create storage module with get/save/CRUD operations
3. Handle SSR safety with `typeof window === 'undefined'` checks
4. Add date serialization/deserialization

### Component Patterns
- Page components handle their own data loading
- Consistent card-based layouts with `card-mm` class
- Modal forms for data entry
- Responsive grid systems

## Feature Specifications

Detailed specifications for all 14 major features are available in `/spec/features/`:

**Core Health Tracking:**
- User Profile Management
- Daily Health Dashboard
- Calorie & Macro Tracking
- Injectable Compound Management

**Productivity Features:**
- MIT Planning System
- Weekly Objectives Management
- Deep Work Tracking

**Specialized Training:**
- Nirvana Life Training
- Progress Milestones
- Body Part Heat Mapping

**Analytics:**
- Comprehensive Analytics Dashboard

## Development Guidelines

### When Building New Features
1. Check existing patterns in `mm-health-tracker/src/`
2. Use established storage modules from `lib/storage.ts`
3. Follow the Context vs Direct Storage decision tree:
   - Use Context for daily health metrics
   - Use Direct Storage for specialized features
4. Maintain consistent date handling (`YYYY-MM-DD` format)

### When Using the Design System
1. Import `design-system-cpn/styles/globals.css`
2. Apply `bg-mm-dark text-mm-white` to root layout
3. Use provided component classes (`.btn-mm`, `.card-mm`, etc.)
4. Reference examples in `design-system-cpn/examples/`

### Testing Approach
Currently no test framework is configured. When adding tests in the future, consider:
- Unit tests for storage modules and calculations
- Integration tests for data persistence
- Component tests for form validation