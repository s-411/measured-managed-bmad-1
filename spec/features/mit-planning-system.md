# MIT Planning System

## 1) Context (why this exists)
Users want to plan their Most Important Tasks (MITs) each evening to focus on high-priority work the next day. This system helps them identify 3-5 key tasks that will move the needle forward and track completion to maintain productivity momentum.

## 2) User Journey (step-by-step)
- User opens Daily Tracker page and scrolls to the bottom MIT planning section
- They see a prominent yellow-gradient card labeled "Plan Tomorrow's MITs"
- User clicks "Add tomorrow's MITs" to open the input form
- They type a task description and press Enter or click Add
- Task appears in the list with automatic numbering (1, 2, 3...)
- User can add multiple tasks (recommended 3-5 tasks)
- Each task can be deleted with a trash icon if entered incorrectly
- Tomorrow, when user opens Daily Tracker, their planned MITs appear prominently at the top
- User can check off completed MITs throughout the day
- MIT completion contributes to the daily progress percentage
- Planning MITs is one of the 5 core completion metrics tracked daily

## 3) Technology (what it uses today)
Built into the Daily Tracker page using localStorage:
- `dailyEntryStorage.updateMITs()` saves tasks: `mm-daily-entry-{date}`
- MITs are stored as JSON array within daily entries
- Tomorrow's date calculation: `new Date(currentDate).setDate(date + 1)`
- Real-time state management with React hooks for immediate UI updates
- `generateId()` creates unique identifiers for each MIT entry
- Completion status tracked with boolean `completed` field
- Order maintained with numeric `order` field for consistent display

## 4) Design Directions (what it looks/feels like)
**Planning Section:** Large yellow-gradient card at bottom of Daily Tracker page
**Visual Hierarchy:** Prominent header with clipboard icon and explanatory text
**Entry Form:** Inline form with text input, Add button, and Cancel button
**Task Display:** Numbered list with yellow badge numbers and clear task text
**Completion Tracking:** Checkbox-style buttons for marking tasks complete on execution day
**Color Coding:** Yellow theme for planning, green checkmarks for completion
**Mobile:** Full-width cards, large touch targets for easy interaction
**Tip Integration:** Helpful tip box explaining optimal MIT planning (3-5 tasks)

## Data We Store (plain-English "table idea")
- `mit_entries` (stored within daily_entries):
  - `id` (unique identifier)
  - `daily_entry_id` (references the day these MITs belong to)
  - `task` (description of the task)
  - `completed` (boolean completion status)
  - `order` (numeric order for display consistency)

Note: MITs are planned "tonight for tomorrow" so they're stored in tomorrow's daily entry

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own MITs
- MIT planning and completion data is private to each individual
- No sharing or collaboration features for task planning
- Work tasks remain confidential to the user

## Acceptance Criteria (done = true)
- As a user, I can add a MIT and see it appear in tomorrow's task list immediately
- As a user, I can add multiple MITs and they maintain proper numbering (1, 2, 3...)
- As a user, I can delete a MIT I added by mistake before saving
- As a user, tomorrow's MITs appear prominently at the top of the Daily Tracker
- As a user, I can check off completed MITs and see my progress update
- As a user, MIT completion contributes to my daily completion percentage
- As a user, I see helpful guidance about planning 3-5 MITs for optimal focus
- If I refresh the page, my planned MITs remain exactly as I entered them
- As a user, I can see today's MITs and plan tomorrow's MITs simultaneously
- MIT planning is tracked as one of the 5 core daily completion metrics

## Open Questions / Assumptions
- Planning window is restricted to exactly "tomorrow" - no multi-day planning
- No categorization or prioritization within MITs - all treated equally
- No time estimation or scheduling integration
- MIT system focuses on work tasks rather than personal tasks
- No recurring MIT templates or copy-from-previous-day functionality
- Completion tracking is binary (done/not done) without partial progress

## Code References
- MIT planning UI: `src/app/daily/page.tsx:979-1069` (Tomorrow's MIT Planning Card)
- MIT display: `src/app/daily/page.tsx:571-607` (Today's MITs Display)
- MIT functions: `src/app/daily/page.tsx:187-225` (addMIT, removeMIT, toggleTodayMIT)
- Storage operations: `src/lib/storage.ts:231-241` (updateMITs, toggleMITCompletion)
- MIT type: `src/types/index.ts:65-70` (MITEntry interface)
- Completion calculation: `src/app/daily/page.tsx:270-322` (metrics calculation)