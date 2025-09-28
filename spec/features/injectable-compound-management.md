# Injectable Compound Management

## 1) Context (why this exists)
Users need to track medical injectable compounds with precise dosage monitoring and weekly target adherence. This helps them maintain consistent medication schedules and ensure they're meeting their prescribed dosage requirements safely and accurately.

## 2) User Journey (step-by-step)
- User navigates to the Injections page from main navigation
- They see their configured compounds with weekly targets and current progress
- Dashboard shows percentage completion for each compound with color-coded status
- User clicks "Add Injection" to log a new injection
- Form asks for compound selection, dosage amount, unit, and optional notes
- Injection is logged with timestamp and appears in today's entry
- Weekly progress automatically updates showing target vs actual dosage
- User can set or modify weekly targets for each compound
- System shows adherence percentage and warns if significantly off-target
- Historical injection data is preserved and accessible through date navigation

## 3) Technology (what it uses today)
Built using multiple localStorage modules for injection management:
- `dailyEntryStorage.addInjectionEntry()` for logging: `mm-daily-entry-{date}`
- `injectionTargetStorage` for targets: `mm-injection-targets`
- `compoundStorage` for available compounds: `mm-compounds`
- Default compounds include 'Ipamorellin', 'Retatrutide', 'Testosterone'
- Weekly progress calculation using 7-day rolling window
- Automatic target calculation: `weeklyTarget = doseAmount * frequency`
- Progress tracking with 90-110% range considered "on target"
- Built in `src/app/injections/page.tsx` with real-time progress updates

## 4) Design Directions (what it looks/feels like)
**Layout:** Dashboard showing compound cards with progress indicators
**Progress Visualization:** Circular or bar progress indicators for weekly targets
**Color Coding:** Green for on-target, yellow for close, red for significantly off
**Entry Form:** Simple modal with compound dropdown, dosage input, unit selection
**Target Management:** Settings area to configure weekly frequency and dose amounts
**History View:** List of recent injections with timestamps and details
**Medical Styling:** Clean, clinical appearance appropriate for medical data
**Mobile:** Cards stack vertically, large touch targets for easy input

## Data We Store (plain-English "table idea")
- `injection_entries` (stored within daily_entries):
  - `id` (unique identifier)
  - `daily_entry_id` (references the day)
  - `compound` (medication name)
  - `dosage` (amount injected)
  - `unit` (mg, ml, IU, etc.)
  - `notes` (optional notes about injection)
  - `timestamp` (when injection was administered)

- `injection_targets` table:
  - `id`, `user_id`
  - `compound` (medication name)
  - `dose_amount` (amount per injection)
  - `unit` (dosage unit)
  - `frequency` (injections per week)
  - `weekly_target` (calculated: dose_amount * frequency)
  - `enabled` (whether this target is active)

- `compounds` table:
  - `id`, `user_id`, `name`
  - List of available compounds for selection
  - Default compounds provided, user can add custom ones

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own injection data
- Medical injection data is extremely private and not shared with anyone
- Compound targets and adherence data are confidential
- No other user can access any injection-related information

## Acceptance Criteria (done = true)
- As a user, I can log an injection and see it appear in today's record immediately
- As a user, I can set weekly targets for each compound I use
- As a user, I can see my weekly progress percentage update after each injection
- As a user, I can add custom compounds and they appear in the selection list
- As a user, I can see color-coded adherence status (green/yellow/red)
- As a user, I can view historical injection data by navigating dates
- As a user, I can add notes to specific injections for context
- If I'm 90-110% of my weekly target, it shows as "on target"
- As a user, I can disable targets for compounds I'm no longer using
- If I refresh the page, all injection data and targets remain intact

## Open Questions / Assumptions
- No dosage validation or safety warnings for excessive amounts
- Weekly targets reset every 7 days from current date (rolling window, not calendar week)
- Compound units are free-text input without standardization
- No reminder system for missed injections or scheduling
- Target calculation assumes uniform dosing (doesn't account for varying schedules)
- No integration with medical providers or prescription tracking

## Code References
- Main injections page: `src/app/injections/page.tsx`
- Injection entry: `src/lib/storage.ts:209-220` (addInjectionEntry function)
- Target storage: `src/lib/storage.ts:450-572` (injectionTargetStorage module)
- Compound storage: `src/lib/storage.ts:306-354` (compoundStorage module)
- Weekly progress: `src/lib/storage.ts:517-571` (getWeeklyProgress function)
- Types: `src/types/index.ts:46-63` (InjectionEntry, InjectionTarget interfaces)
- Form data: `src/types/index.ts:231-237` (InjectionFormData interface)