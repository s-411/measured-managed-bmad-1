# Daily Health Dashboard

## 1) Context (why this exists)
This is the main dashboard where users track all their daily health metrics in one place. It provides a comprehensive view of their health progress and helps them stay on top of their daily goals including calories, exercise, weight, productivity tasks, and weekly planning.

## 2) User Journey (step-by-step)
- User opens the Daily Tracker page (primary destination after login)
- They see today's date prominently displayed with navigation arrows to change dates
- Dashboard shows completion percentage and status for 5 key metrics: Weight, Deep Work, Food, Exercise, and MITs
- User can click metric cards to add data (weight form, food tracking, exercise tracking)
- If it's Monday, they see a prominent weekly planning section to set 3 objectives
- If it's Friday, they see a weekly review section to mark completed objectives and reflect
- Tuesday-Thursday shows a compact view of the week's objectives
- At the bottom, they plan tomorrow's Most Important Tasks (MITs)
- All data is automatically saved and progress updates in real-time

## 3) Technology (what it uses today)
The dashboard is built in `src/app/daily/page.tsx` (~1,070 lines) and uses multiple localStorage modules:
- `profileStorage` for BMR calculations and user profile: `mm-health-profile`
- `dailyEntryStorage` for daily metrics: `mm-daily-entry-{YYYY-MM-DD}`
- `weeklyEntryStorage` for objectives: `mm-weekly-entry-{weekStart}`
- `localStorage.getItem('mm-macro-targets')` for macro targets
- Real-time calculations using `calculations.calculateDailyMetrics()` from storage.ts
- Date navigation with `getTodayDateString()` and date manipulation utilities
- Responsive grid layouts with custom CSS classes like `.card-mm` and `.btn-mm`

## 4) Design Directions (what it looks/feels like)
**Layout:** Single-page dashboard with distinct sections stacked vertically
**Date Navigation:** Large date display with left/right arrows in a dark card
**Completion Overview:** Three-column layout showing progress percentage, daily summary, and macro progress
**Metric Cards:** 5-card grid showing Weight, Deep Work, Food, Exercise, and MITs with completion checkmarks
**Weekly Planning:** Special highlighted sections on Monday (green gradient) and Friday for planning/review
**MIT Planning:** Bottom section with yellow gradient for tomorrow's task planning
**Color Coding:** Green for weekly objectives, yellow for MITs, blue for main metrics, purple for deep work
**Mobile:** Cards stack vertically, navigation stays prominent

## Data We Store (plain-English "table idea")
- `daily_entries` table:
  - `id` (unique identifier)
  - `user_id` (owner of this entry)
  - `date` (YYYY-MM-DD format, unique per user)
  - `weight` (optional daily weight in kg)
  - `deep_work_completed` (boolean)
  - `calories` (JSON array of calorie entries)
  - `exercises` (JSON array of exercise entries)
  - `injections` (JSON array of injection entries)
  - `mits` (JSON array of Most Important Tasks)
  - `created_at`, `updated_at`

- `weekly_entries` table:
  - `id` (unique identifier)
  - `user_id` (owner)
  - `week_start_date` (Monday's date in YYYY-MM-DD)
  - `objectives` (JSON array of 3 weekly objectives)
  - `why_important` (text explanation)
  - `friday_review` (reflection text)
  - `review_completed` (boolean)
  - `created_at`, `updated_at`

- `user_profiles` table:
  - `id`, `user_id`, `bmr`, `height`, `weight`, `gender`
  - Used for calorie balance calculations

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own daily entries
- No other user can view or modify anyone else's health data
- All data is private to the individual user
- Weekly objectives and daily metrics are personal and not shared

## Acceptance Criteria (done = true)
- As a user, I can navigate between any date and see my data for that day
- As a user, I can see my completion percentage update in real-time as I add data
- As a user on Monday, I can set 3 weekly objectives and explain why they matter
- As a user on Friday, I can mark objectives complete and write a weekly reflection
- As a user, I can add tomorrow's MITs and they appear on tomorrow's dashboard
- As a user, I can toggle deep work completion and see it reflect in my progress
- As a user, I can add my weight and see it saved to today's entry
- If I refresh the page, all my data remains exactly as I entered it
- As a user, I can see my calorie balance calculated correctly (BMR - consumed + burned)
- The dashboard shows accurate macro progress against my set targets

## Open Questions / Assumptions
- The BMR calculation is central to calorie balance - unclear how BMR is initially calculated or updated
- MIT planning assumes users want to plan exactly one day ahead (tomorrow)
- Weekly objectives are limited to exactly 3 objectives - this seems intentionally constrained
- The completion percentage gives equal weight to all 5 metrics (weight, deep work, food, exercise, MITs)

## Code References
- Main dashboard: `src/app/daily/page.tsx:26-1072`
- Storage operations: `src/lib/storage.ts:101-242` (dailyEntryStorage), `src/lib/storage.ts:575-667` (weeklyEntryStorage)
- Calculations: `src/lib/storage.ts:393-447` (BMR-based metrics)
- Date utilities: `src/lib/storage.ts:22-37` (date formatting and week calculations)
- Types: `src/types/index.ts:14-88` (DailyEntry, WeeklyEntry interfaces)