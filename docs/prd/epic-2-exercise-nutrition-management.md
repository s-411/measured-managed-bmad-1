# Epic 2: Exercise & Nutrition Management

**Epic Goal**: Complete the nutrition and exercise tracking features with detailed macro management, exercise calorie calculations, and food templates for efficient data entry. This transforms the basic calorie tracker into a comprehensive nutrition and fitness management system.

## Story 2.1: Exercise Database and MET Values

As a developer,
I want to create an exercise database with MET values,
so that we can accurately calculate calorie burn for activities.

### Acceptance Criteria
1: Exercise data structure with name, category, and MET value
2: Predefined list of common exercises with MET values
3: Categories: Cardio, Strength, Sports, Daily Activities
4: Search functionality for finding exercises
5: Ability to add custom exercises
6: MET to calorie calculation: (MET × weight in kg × duration in hours)
7: Storage of custom exercises in localStorage
8: TypeScript types for exercise data

## Story 2.2: Exercise Logging Interface

As a user,
I want to log my exercise sessions with duration and intensity,
so that I can track calories burned through activity.

### Acceptance Criteria
1: Exercise entry form with exercise selection, duration, intensity
2: Quick-select for recent exercises
3: Calorie burn calculation displayed in real-time
4: Multiple exercises per day support
5: Exercise entries saved to daily entry in localStorage
6: Edit and delete functionality for exercises
7: Daily exercise summary on dashboard
8: Time input in minutes with conversion for calculations

## Story 2.3: Macro Nutrient Tracking

As a user,
I want to track my protein, carbohydrate, and fat intake,
so that I can manage my macronutrient ratios.

### Acceptance Criteria
1: Macro entry fields (protein, carbs, fats) for each food entry
2: Automatic calorie calculation from macros (P×4 + C×4 + F×9)
3: Daily macro totals displayed on dashboard
4: Macro targets configuration in settings
5: Progress bars for each macro vs. target
6: Percentage breakdown of daily macros
7: Validation to ensure macro calories match total calories
8: Macro data saved with food entries in localStorage

## Story 2.4: Food Templates System

As a user,
I want to save frequently eaten meals as templates,
so that I can quickly log recurring meals.

### Acceptance Criteria
1: Save current food entry as template with custom name
2: Template includes calories and all macro values
3: Templates list with search functionality
4: Apply template to quickly fill entry form
5: Edit and delete template functionality
6: Templates stored in localStorage (mm-food-templates)
7: Favorite templates for quick access
8: Template categories (meals, snacks, drinks)

## Story 2.5: Recent Foods Feature

As a user,
I want to quickly re-log recently eaten foods,
so that I can save time on repetitive entries.

### Acceptance Criteria
1: Last 20 food entries stored as recent items
2: Recent foods displayed in entry modal
3: One-click to re-log a recent food
4: Ability to modify amount before saving
5: Recent items include name, calories, and macros
6: Clear recent foods option in settings
7: Smart ordering based on frequency and recency
8: Visual indicators for items logged today

## Story 2.6: Meal Categorization and Timing

As a user,
I want to categorize my food by meal and track eating times,
so that I can analyze my eating patterns.

### Acceptance Criteria
1: Meal type selection for each food entry
2: Optional timestamp for when food was consumed
3: Default to current time with ability to modify
4: Meal-based grouping in daily view
5: Meal timing analytics (average meal times)
6: Intermittent fasting window tracking
7: Visual timeline of daily eating pattern
8: Meal categories: Breakfast, Lunch, Dinner, Snacks

## Story 2.7: Nutrition Summary Dashboard

As a user,
I want to see comprehensive nutrition analytics,
so that I can understand my dietary patterns.

### Acceptance Criteria
1: Daily nutrition summary card with all metrics
2: Weekly average calculations for calories and macros
3: Adherence percentage to targets
4: Trend indicators for each metric
5: Calorie balance with exercise included
6: Net calories display (consumed - exercise)
7: Macro ratio pie chart
8: Quick stats: streak, best day, weekly average