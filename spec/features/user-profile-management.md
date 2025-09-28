# User Profile Management

## 1) Context (why this exists)
Users need to set up their basic health profile including BMR (Basal Metabolic Rate), height, weight, and gender to enable accurate calorie balance calculations throughout the application. This profile serves as the foundation for all health tracking features.

## 2) User Journey (step-by-step)
- New user is automatically redirected to Settings page with `?firstTime=true` parameter
- They see a welcome message and profile setup form
- User enters their height (cm), weight (kg), gender selection, and BMR value
- BMR can be calculated using the built-in BMR calculator on the Calculator page
- Profile is saved and user is redirected to Daily Tracker as the main dashboard
- Existing users can edit their profile anytime through Settings page
- Weight updates from daily tracking automatically update the profile weight
- Profile completion is validated before allowing access to main application
- All calorie balance calculations throughout the app use the BMR value

## 3) Technology (what it uses today)
Profile management spans multiple components:
- `profileStorage` handles profile data: `mm-health-profile`
- Profile validation: `profileStorage.isComplete()` checks required fields
- Home page redirect logic in `src/app/page.tsx` routes based on profile completeness
- BMR calculator in `src/app/calculator/page.tsx` for BMR computation
- Settings page in `src/app/settings/page.tsx` for profile editing
- Real-time BMR usage in `calculations.calculateDailyMetrics()` for calorie balance
- Profile updates automatically sync weight from daily tracking
- JSON serialization with Date object handling for timestamps

## 4) Design Directions (what it looks/feels like)
**Setup Flow:** Clean onboarding form with clear field labels and validation
**BMR Integration:** Link to calculator page for BMR computation assistance
**Settings Page:** Standard form layout with save/cancel actions
**Field Types:** Numeric inputs for measurements, radio buttons for gender selection
**Validation:** Required field indicators and completion status
**Success States:** Confirmation messages and smooth transitions
**Mobile:** Form fields stack vertically with large touch targets
**Calculator Integration:** BMR calculator provides computed value for profile setup

## Data We Store (plain-English "table idea")
- `user_profiles` table:
  - `id` (unique identifier)
  - `user_id` (owner of this profile)
  - `bmr` (Basal Metabolic Rate in calories - critical for all calculations)
  - `height` (height in centimeters)
  - `weight` (current weight in kilograms)
  - `gender` ('male', 'female', or 'other')
  - `created_at` (when profile was first created)
  - `updated_at` (last modification timestamp)

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see and edit their own profile
- Profile data is private and not shared with other users
- Height, weight, BMR, and gender are personal health information
- No profile visibility or social features

## Acceptance Criteria (done = true)
- As a new user, I'm guided to create a profile before accessing the main application
- As a user, I can enter my height, weight, gender, and BMR and save my profile
- As a user, I can use the BMR calculator to determine my BMR value
- As a user, I can edit my profile information anytime through Settings
- As a user, my daily weight entries automatically update my profile weight
- As a user, my BMR is used consistently across all calorie balance calculations
- If I don't complete my profile, I cannot access the main tracking features
- As a user, I can see my profile information is saved and persists across sessions
- Profile validation prevents incomplete profiles from accessing the main app
- As a user, I can change my gender selection and it updates throughout the system

## Open Questions / Assumptions
- BMR is manually entered or calculated but not automatically updated based on weight/age changes
- No age field despite age being critical for BMR calculations
- Weight syncing from daily tracking may overwrite intentional profile weight updates
- No profile photo or additional personal information storage
- Gender selection limited to three options without additional customization
- No imperial unit support (feet/inches, pounds) - metric only

## Code References
- Profile storage: `src/lib/storage.ts:40-98` (profileStorage module)
- Profile validation: `src/lib/storage.ts:86-97` (isComplete function)
- Home page routing: `src/app/page.tsx:11-23` (profile completion check)
- Settings page: `src/app/settings/page.tsx` (profile editing interface)
- BMR calculator: `src/app/calculator/page.tsx` (BMR computation)
- Profile usage: `src/lib/storage.ts:394-410` (BMR used in daily calculations)
- Profile types: `src/types/index.ts:4-12` (UserProfile interface)
- Form data types: `src/types/index.ts:238-244` (ProfileFormData interface)