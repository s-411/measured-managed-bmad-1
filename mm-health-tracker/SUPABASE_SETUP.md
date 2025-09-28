# MM Health Tracker - Supabase Setup Guide

## 🎉 Epic 1 Complete: Foundation & Core Health Tracking

This project has been successfully migrated from localStorage to **Supabase** with full authentication, user profiles, and core health tracking functionality.

## 🚀 Quick Start

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API and copy:
   - Project URL
   - Public anon key

### 2. Configure Environment Variables

Create `.env.local` in the `mm-health-tracker` directory:

```bash
# Copy from .env.local.example and fill in your values
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Schema

Start your local Supabase (requires Docker):

```bash
cd mm-health-tracker
supabase start
```

Apply the migration:

```bash
supabase db push
```

### 4. Start Development

```bash
npm run dev
```

## 🏗️ What's Implemented

### ✅ Core Foundation
- **Supabase Integration**: Full database with Row Level Security
- **Authentication System**: Login/register with email
- **User Profiles**: BMR calculations, macro targets, activity levels
- **Daily Dashboard**: Card-based layout with real-time metrics

### ✅ Health Tracking Features
- **Daily Entries**: Weight, calories, exercise, MIT tasks, deep work
- **Food Tracking**: Meal categorization, macro tracking, food templates
- **Weight Tracking**: Daily weight with trend calculations
- **BMR/TDEE Calculations**: Automatic recalculation on profile changes

### ✅ Data Architecture
- **10 Database Tables**: Multi-tenant with RLS policies
- **TypeScript Types**: Full type safety with generated types
- **Service Layer**: Clean separation with error handling
- **Real-time Updates**: Automatic sync across devices

## 🗂️ New File Structure

```
mm-health-tracker/
├── src/
│   ├── lib/
│   │   ├── supabase/          # Supabase client & types
│   │   ├── services/          # Business logic services
│   │   └── context/           # React contexts (Auth, Profile)
│   ├── components/
│   │   ├── guards/            # Route protection
│   │   ├── profile/           # Profile management
│   │   ├── dashboard/         # Dashboard components
│   │   └── food/              # Food tracking components
│   └── app/
│       ├── auth/              # Authentication pages
│       ├── profile/setup/     # Profile setup for new users
│       ├── daily/             # New Supabase-powered dashboard
│       └── calories/          # New food tracking interface
└── supabase/
    └── migrations/            # Database schema migrations
```

## 🔄 Migration Notes

The old localStorage-based system is preserved alongside the new Supabase implementation:
- **Old pages**: `page.tsx` (localStorage-based)
- **New pages**: `page-new.tsx` (Supabase-based)

To switch to the new system, simply rename:
- `page-new.tsx` → `page.tsx`
- Backup the old files if needed

## 🎯 Next Steps

### Phase 2: Exercise & Nutrition Management
- Exercise database with MET values
- Exercise logging with calorie calculations
- Food templates and recent foods
- Meal timing and intermittent fasting

### Phase 3: Specialized Features
- Injectable compound management
- Weekly objectives system
- Nirvana Life training integration
- Advanced MIT planning

### Phase 4: Analytics & Insights
- Multi-metric correlation analysis
- Trend visualization with Recharts
- Progress milestone tracking
- Data export functionality

## 🛡️ Security Features

- **Row Level Security**: Database-level data isolation
- **JWT Authentication**: Secure session management
- **Route Protection**: Middleware-based auth guards
- **Input Validation**: Zod schemas for all data entry
- **Error Handling**: Comprehensive error boundaries

## 📱 Features in Action

1. **New User Flow**: Register → Email verification → Profile setup → Dashboard
2. **Daily Tracking**: Weight, calories, exercise, MIT tasks all in one view
3. **Food Logging**: Quick meal categorization with macro tracking
4. **Real-time Updates**: Changes sync instantly across devices
5. **BMR Intelligence**: Automatic recalculation based on weight changes

Ready to continue building the future of health tracking! 🚀