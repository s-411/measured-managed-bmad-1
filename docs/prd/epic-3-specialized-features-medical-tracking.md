# Epic 3: Specialized Features & Medical Tracking

**Epic Goal**: Implement specialized tracking features including injectable compound management for medical protocols, productivity integration with MIT planning and deep work tracking, and weekly objective management. These features differentiate MM Health Tracker from standard fitness apps.

## Story 3.1: Injectable Compound Registry

As a user,
I want to manage a list of injectable compounds with dosing information,
so that I can track my medical protocols accurately.

### Acceptance Criteria
1: Compound entry form with name, concentration, ester type
2: Ester half-life calculations for common esters
3: Weekly target dosage configuration per compound
4: Compound list management (add, edit, delete)
5: Storage in localStorage (mm-compounds key)
6: Support for multiple compounds simultaneously
7: Compound categories (TRT, HRT, Peptides, Other)
8: Notes field for protocol details

## Story 3.2: Injection Tracking and Site Rotation

As a user,
I want to log my injections with site rotation tracking,
so that I can maintain proper injection practices.

### Acceptance Criteria
1: Injection entry with compound, dose, date, site
2: Injection sites: Delts, Glutes, Quads, SubQ locations
3: Site rotation recommendations based on history
4: Visual body map showing recent injection sites
5: Daily injection entries in localStorage
6: Weekly adherence calculation vs. targets
7: Injection history view with filtering
8: Export capability for medical provider reports

## Story 3.3: MIT Planning System

As a user,
I want to plan my Most Important Tasks daily,
so that I can focus on high-priority activities.

### Acceptance Criteria
1: MIT entry interface with 3 task slots
2: Task description and completion checkbox
3: Daily MIT planning prompt
4: Completion tracking as boolean per task
5: MIT history view showing completion rates
6: Integration with daily dashboard
7: MIT data in daily entry localStorage
8: Weekly MIT completion statistics

## Story 3.4: Deep Work Tracking

As a user,
I want to track my deep work sessions,
so that I can monitor my focused productivity.

### Acceptance Criteria
1: Simple deep work completion toggle for each day
2: Optional session duration tracking
3: Deep work streak calculation
4: Weekly deep work frequency display
5: Integration with daily dashboard
6: Correlation analysis with health metrics
7: Deep work data in daily entry
8: Monthly deep work calendar view

## Story 3.5: Weekly Objectives Management

As a user,
I want to set and review weekly objectives,
so that I can maintain strategic focus.

### Acceptance Criteria
1: Monday planning interface for 3 weekly objectives
2: Objective description and success criteria
3: Friday review interface with completion status
4: Week-over-week completion tracking
5: Weekly entry localStorage (mm-weekly-entry-{weekStart})
6: Objective categories (Health, Work, Personal)
7: Weekly review notifications
8: Historical objectives browser

## Story 3.6: Compound Dosage Calculator

As a user,
I want to calculate precise dosages based on concentration,
so that I can accurately measure my injectable compounds.

### Acceptance Criteria
1: Calculator with concentration and desired dose inputs
2: Volume calculation in mL with syringe markings
3: Weekly total calculations based on frequency
4: Ester release calculations over time
5: Stack total calculations for multiple compounds
6: IU to mg conversions for peptides
7: Save calculation results to notes
8: Visual syringe representation of volume

## Story 3.7: Productivity Analytics

As a user,
I want to see analytics about my productivity metrics,
so that I can optimize my work patterns.

### Acceptance Criteria
1: MIT completion rate over time
2: Deep work frequency and streaks
3: Weekly objective success rate
4: Correlation with health metrics (calories, sleep)
5: Best/worst productivity days analysis
6: Productivity score calculation
7: Trend analysis with recommendations
8: Export productivity data