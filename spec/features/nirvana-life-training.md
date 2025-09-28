# Nirvana Life Training

## 1) Context (why this exists)
This is a specialized training tracking system for gymnastics, mobility, and handstand progression. Users want to track specific training sessions, monitor their progress on various skills, and understand patterns in their training to optimize their practice routine.

## 2) User Journey (step-by-step)
- User navigates to the Nirvana page from main navigation
- They see today's date with navigation arrows to switch dates
- A grid shows the current week with session counts per day
- User clicks "Quick Add" to log a training session
- They select from predefined session types like "Handstands", "Mobility: Spine", "Press handstand"
- Session is immediately added to today with a timestamp
- User can see personal records section to update achievements
- They can view milestones and mark them complete when achieved
- Weekly view shows training consistency and patterns
- User can navigate to Analytics to see body part heat maps and session correlations
- All data persists and builds a comprehensive training history

## 3) Technology (what it uses today)
Complex multi-module system across several files:
- `nirvanaSessionStorage` for daily sessions: `mm-nirvana-{date}`
- `nirvanaSessionTypesStorage` for session types: `mm-nirvana-session-types`
- `nirvanaProgressStorage` for milestones/records: `mm-nirvana-progress`
- `bodyPartMappingStorage` for correlation analysis: `mm-nirvana-body-mappings`
- `sessionCorrelationStorage` for AI-powered insights with statistical analysis
- Default session types include 15 predefined types from mobility to advanced handstands
- Body part mapping system correlates sessions to anatomical locations
- Progress tracking with 15 default milestones and 8 default personal records
- Built in `src/app/nirvana/page.tsx` with extensive state management

## 4) Design Directions (what it looks/feels like)
**Layout:** Multi-section page with weekly calendar, quick actions, and progress tracking
**Weekly Grid:** 7-day calendar view showing session counts per day with heat map coloring
**Session Types:** Organized grid of predefined training types for one-click logging
**Progress Section:** Separate cards for milestones and personal records with completion tracking
**Purple Branding:** Consistent purple color scheme to distinguish from main health tracking
**Modal System:** Record updating uses modal overlays for focused data entry
**Mobile Responsive:** Cards stack and grid adjusts for mobile viewing
**Visual Indicators:** Check marks, progress bars, and completion percentages throughout

## Data We Store (plain-English "table idea")
- `nirvana_entries` table:
  - `id`, `user_id`, `date` (YYYY-MM-DD)
  - `sessions` (JSON array of session objects)
  - `created_at`, `updated_at`

- `nirvana_sessions` (within each entry):
  - `id`, `session_type`, `timestamp`

- `nirvana_session_types` table:
  - `id`, `user_id`, `name` (e.g., "Handstands", "Mobility: Spine")
  - Default types provided, user can add custom types

- `nirvana_progress` table:
  - `id`, `user_id`
  - `milestones` (JSON array of milestone objects)
  - `personal_records` (JSON array of record objects)
  - `created_at`, `updated_at`

- `milestones` (within progress):
  - `id`, `title`, `description`, `category`, `difficulty`, `completed`, `completed_date`
  - `target_value`, `unit`, `order`

- `personal_records` (within progress):
  - `id`, `name`, `category`, `value`, `unit`, `record_date`
  - `previous_value`, `previous_date`, `notes`

- `body_part_mappings` table:
  - Session type to body part correlation data
  - Used for heat map visualization and analytics

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own training sessions and progress
- Personal records and milestones are private to each user
- No sharing or social features - this is personal training tracking
- All progress data is confidential to the individual

## Acceptance Criteria (done = true)
- As a user, I can log a training session and see it appear in today's list immediately
- As a user, I can view a weekly calendar and see my training consistency
- As a user, I can mark a milestone complete and see it reflected in my progress
- As a user, I can update a personal record and track my improvement over time
- As a user, I can navigate between dates and see historical training data
- As a user, I can add custom session types and they persist for future use
- As a user, I can see body part correlation analysis showing which areas I train most
- If I refresh the page, all my training sessions and progress remain intact
- As a user, I can see session correlation insights suggesting optimal training patterns
- As a user, I can view analytics showing training streaks and frequency patterns

## Open Questions / Assumptions
- The 15 default session types seem gymnastics/mobility focused - unclear if customizable for other disciplines
- Progress milestones are hierarchical (beginner → advanced) but progression logic unclear
- Body part mapping appears to be manually configured rather than automatic
- Personal records support multiple categories but no automatic calculation or prompting
- Session correlation analysis uses complex statistical confidence measures - unclear how actionable

## Code References
- Main Nirvana page: `src/app/nirvana/page.tsx:25-100+`
- Session storage: `src/lib/storage.ts:725-793` (nirvanaSessionStorage)
- Progress storage: `src/lib/storage.ts:835-943` (nirvanaProgressStorage)
- Body part mapping: `src/lib/storage.ts:1054-1126` (bodyPartMappingStorage)
- Correlation analysis: `src/lib/storage.ts:1129-1319` (sessionCorrelationStorage)
- Types: `src/types/index.ts:116-164` (NirvanaSession, NirvanaProgress, etc.)
- Default data: `src/lib/storage.ts:796-1051` (default milestones, records, mappings)