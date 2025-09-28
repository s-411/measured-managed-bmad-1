# Requirements

## Functional

- FR1: The system shall calculate and display real-time BMR-based calorie balance using the Mifflin-St Jeor formula
- FR2: The system shall support daily entry of calories consumed, exercise performed, and weight measurements
- FR3: The system shall track macronutrients (protein, carbs, fats) with user-defined targets
- FR4: The system shall provide food templates and recent items for quick calorie entry
- FR5: The system shall calculate exercise calorie burn using MET values and duration
- FR6: The system shall support injectable compound tracking with ester calculations and weekly targets
- FR7: The system shall track Nirvana Life training sessions with customizable session types
- FR8: The system shall manage progress milestones and personal records for specialized training
- FR9: The system shall provide MIT (Most Important Tasks) planning with daily task management
- FR10: The system shall support weekly objectives with Monday planning and Friday review cycles
- FR11: The system shall track deep work session completion as binary daily metrics
- FR12: The system shall generate analytics showing correlations between different health metrics
- FR13: The system shall provide data export functionality in standard formats (CSV, JSON)
- FR14: The system shall maintain all data in localStorage with zero data loss
- FR15: The system shall auto-adjust BMR calculations based on weight changes

## Non Functional

- NFR1: All page loads and UI interactions must complete in under 3 seconds
- NFR2: The application must function fully offline after initial load
- NFR3: The system must support Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ on desktop and mobile
- NFR4: Data entry for daily metrics must be completable in under 2 minutes
- NFR5: The application must maintain 60 FPS for all animations and transitions
- NFR6: localStorage usage must not exceed 10MB for typical user with 1 year of data
- NFR7: The system must ensure data consistency across all 47+ localStorage keys
- NFR8: All calculations must match established health app accuracy within 5%
- NFR9: The PWA must provide native-like experience on mobile devices
- NFR10: The application must be accessible at WCAG AA compliance level
- NFR11: Date handling must maintain consistency with YYYY-MM-DD format across all features
- NFR12: The system must support data migration path to future database backend
- NFR13: All monetary calculations must use integer cents to avoid floating-point errors
- NFR14: The application must maintain responsive design from 320px to 4K displays
- NFR15: Security must ensure no sensitive health data is exposed in browser logs or network requests