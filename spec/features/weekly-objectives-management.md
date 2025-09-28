# Weekly Objectives Management

## 1) Context (why this exists)
Users want to set weekly goals and conduct regular reviews to maintain long-term progress. This system provides Monday planning sessions to set 3 key objectives for the week and Friday review sessions to reflect on accomplishments and lessons learned.

## 2) User Journey (step-by-step)
- On Monday, user opens Daily Tracker and sees a prominent green planning card at the top
- They click "Set Weekly Objectives" to open the planning form
- User enters 3 weekly objectives in numbered input fields
- They write an explanation of why these objectives are important
- Objectives are saved and display throughout the week
- Tuesday-Thursday shows a compact reminder card with the week's objectives
- On Friday, user sees the weekly review section prominently displayed
- They mark completed objectives with checkboxes
- User writes a reflection about the week's progress and lessons learned
- Review is saved and the weekly cycle begins again the following Monday
- Historical weekly data is preserved for long-term pattern analysis

## 3) Technology (what it uses today)
Built into Daily Tracker using specialized weekly storage:
- `weeklyEntryStorage` manages weekly data: `mm-weekly-entry-{weekStart}`
- `getWeekStartDate()` calculates Monday's date for consistent weekly boundaries
- `getDayOfWeek()` determines current day for conditional UI display
- Monday: Planning form with 3 objective inputs plus importance explanation
- Tuesday-Thursday: Compact display of current week's objectives
- Friday: Review form with completion checkboxes and reflection textarea
- Week boundaries are Monday-to-Sunday with Monday as the key date
- Data persists across the entire weekly cycle with automatic loading

## 4) Design Directions (what it looks/feels like)
**Monday Planning:** Large green-gradient card with academic cap icon and planning form
**Objective Entry:** Three numbered input fields with clear labels and numbering badges
**Importance Field:** Textarea for explaining why objectives matter
**Tuesday-Thursday Display:** Compact green card showing objectives as reminder
**Friday Review:** Expanded green card with completion checkboxes and reflection area
**Color Coding:** Consistent green theme for all weekly objective features
**Progressive Disclosure:** Form shows/hides based on completion status
**Mobile:** Full-width cards with large touch targets for easy interaction

## Data We Store (plain-English "table idea")
- `weekly_entries` table:
  - `id`, `user_id`
  - `week_start_date` (Monday's date in YYYY-MM-DD format)
  - `objectives` (JSON array of 3 objective objects)
  - `why_important` (text explanation of objectives' importance)
  - `friday_review` (reflection text from Friday review)
  - `review_completed` (boolean indicating Friday review completion)
  - `created_at`, `updated_at`

- `weekly_objectives` (within weekly_entries):
  - `id` (unique identifier)
  - `objective` (text description of the objective)
  - `completed` (boolean completion status)
  - `order` (0, 1, 2 for first, second, third objective)

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own weekly objectives
- Weekly planning and review data is private to each individual
- No sharing or team collaboration features
- Personal reflections and goal setting remain confidential

## Acceptance Criteria (done = true)
- As a user on Monday, I can set 3 weekly objectives and explain their importance
- As a user on Tuesday-Thursday, I can see my weekly objectives as a reminder
- As a user on Friday, I can mark objectives complete and write a weekly reflection
- As a user, I can edit objectives or review text after initial creation
- As a user, weekly objectives persist throughout the entire week cycle
- As a user, I can navigate to previous weeks and see historical objectives and reviews
- If I refresh the page, my weekly planning data remains exactly as entered
- As a user, the system automatically detects what day it is and shows appropriate UI
- As a user, I can see the visual progression from planning to execution to review
- Week boundaries are consistent (Monday to Sunday) regardless of when I start

## Open Questions / Assumptions
- Limited to exactly 3 objectives - no more, no less flexibility
- Weekly cycle is rigid Monday-Sunday with no customization
- No quarterly or monthly goal integration
- Friday review is optional but encouraged - no enforcement
- No objective prioritization or dependency tracking
- Week-over-week trend analysis not built into the interface

## Code References
- Monday planning UI: `src/app/daily/page.tsx:377-477` (Weekly Objectives Planning)
- Friday review UI: `src/app/daily/page.tsx:481-568` (Weekly Review)
- Tuesday-Thursday display: `src/app/daily/page.tsx:951-977` (Compact objectives display)
- Weekly functions: `src/app/daily/page.tsx:228-266` (saveWeeklyObjectives, toggleWeeklyObjective, saveFridayReview)
- Storage operations: `src/lib/storage.ts:575-667` (weeklyEntryStorage module)
- Week calculation: `src/lib/storage.ts:26-32` (getWeekStartDate function)
- Types: `src/types/index.ts:72-88` (WeeklyEntry, WeeklyObjective interfaces)