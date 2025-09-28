# Calorie & Macro Tracking

## 1) Context (why this exists)
Users need to track their food intake and exercise to maintain their health goals and stay within their calorie and macro nutrient targets. This feature helps them log meals, calculate macro breakdowns, and monitor their daily calorie balance against their BMR.

## 2) User Journey (step-by-step)
- User navigates to the Calories page from the main navigation
- They see today's date with navigation arrows to switch dates
- Dashboard shows current day's calorie and macro summary with targets comparison
- User clicks "Add Food" to log a meal
- A form opens asking for food name, calories, carbs, protein, and fat
- They can save food items as templates for quick reuse later
- User can add exercise by clicking "Add Exercise"
- Exercise form asks for type, duration (minutes), and calories burned
- All entries appear in chronological lists with timestamps
- User can delete any entry they added by mistake
- Running totals update automatically and show against their set targets
- If they haven't set targets, they're prompted to do so in Settings

## 3) Technology (what it uses today)
Built in `src/app/calories/page.tsx` and uses several localStorage modules:
- `dailyEntryStorage.addCalorieEntry()` saves food: `mm-daily-entry-{date}`
- `dailyEntryStorage.addExerciseEntry()` saves exercise: `mm-daily-entry-{date}`
- `foodTemplateStorage` for reusable food items: `mm-food-templates`
- `localStorage.getItem('mm-macro-targets')` for user-set targets
- Real-time calculation using `calculations.calculateDailyMetrics()` for balance computation
- Form validation and modal management for data entry
- Timestamps automatically added using `new Date()` on each entry

## 4) Design Directions (what it looks/feels like)
**Layout:** Two-column design with summary cards on left, entry forms and lists on right
**Summary Cards:** Show total calories, macros, and balance with color-coded progress bars
**Entry Forms:** Modal or inline forms with clear input fields for food/exercise data
**Food Templates:** Dropdown or quick-select interface for saved foods
**Entry Lists:** Chronological display with timestamps, edit/delete options
**Targets:** Visual progress indicators showing current vs target (green=good, red=over)
**Mobile:** Single column layout, cards stack vertically
**Color Coding:** Orange for calories/food, green for exercise, red for exceeding targets

## Data We Store (plain-English "table idea")
- `calorie_entries` (stored within daily_entries):
  - `id` (unique identifier for each food entry)
  - `daily_entry_id` (references the day this belongs to)
  - `name` (food item name)
  - `calories` (calorie count)
  - `carbs` (carbohydrates in grams)
  - `protein` (protein in grams)
  - `fat` (fat in grams)
  - `timestamp` (when entry was added)

- `exercise_entries` (stored within daily_entries):
  - `id` (unique identifier)
  - `daily_entry_id` (references the day)
  - `type` (exercise name/description)
  - `duration` (minutes)
  - `calories_burned` (calories burned during exercise)
  - `timestamp` (when entry was added)

- `food_templates` table:
  - `id`, `user_id`, `name`, `calories`, `carbs`, `protein`, `fat`, `created_at`
  - Reusable food items for quick logging

- `macro_targets` (stored in simple key-value):
  - `user_id`, `calories`, `carbs`, `protein`, `fat`
  - User-defined daily targets

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own food and exercise entries
- Food templates are private to each user
- No other user can view or modify anyone else's calorie tracking data
- Macro targets are private user preferences

## Acceptance Criteria (done = true)
- As a user, I can add a food item and see it appear in today's list with timestamp
- As a user, I can add an exercise and see calories burned added to my daily total
- As a user, I can save a food item as a template and reuse it later quickly
- As a user, I can delete any food or exercise entry I added by mistake
- As a user, I can see my calorie balance calculated correctly (BMR - consumed + burned)
- As a user, I can see my macro progress against targets with color coding
- If I set macro targets, I can see green/red indicators for staying within limits
- As a user, I can navigate to different dates and see historical food/exercise data
- If I refresh the page, all my entries remain exactly as I logged them
- As a user, I can distinguish between food entries and exercise entries clearly

## Open Questions / Assumptions
- Food database integration is not implemented - users must manually enter all nutrition data
- Exercise calorie burn calculation appears to be user-estimated rather than automatic
- No barcode scanning or nutrition lookup - all data entry is manual
- Templates are simple name/macro storage without portions or serving sizes
- BMR is used as baseline for calorie balance calculation but BMR source/calculation method unclear

## Code References
- Main calories page: `src/app/calories/page.tsx`
- Food template storage: `src/lib/storage.ts:257-304` (foodTemplateStorage module)
- Daily entry functions: `src/lib/storage.ts:183-241` (addCalorieEntry, addExerciseEntry)
- Calculations: `src/lib/storage.ts:393-447` (calculateDailyMetrics function)
- Types: `src/types/index.ts:28-44` (CalorieEntry, ExerciseEntry interfaces)
- Form data types: `src/types/index.ts:217-229` (CalorieFormData, ExerciseFormData)