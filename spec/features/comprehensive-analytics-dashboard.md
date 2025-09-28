# Comprehensive Analytics Dashboard

## 1) Context (why this exists)
Users want to understand patterns and trends in their health and training data over time. This analytics dashboard processes all their tracked data to provide insights, visualizations, and AI-powered correlations that help them optimize their health and training routines.

## 2) User Journey (step-by-step)
- User navigates to Analytics page from main navigation
- Dashboard loads with 6 distinct analysis sections
- Weight trends show weight changes over time with trend lines
- Calorie balance analysis displays deficit/surplus patterns with customizable time periods (7/30/90 days)
- Deep work completion shows consistency in focus sessions
- Injection analytics display compound usage and adherence patterns
- Nirvana training section shows 6 specialized visualizations (streaks, frequency, body part heat maps)
- Session correlation analysis provides AI-powered insights about training patterns
- All charts are interactive with hover details and responsive design
- Time period selectors allow users to zoom into different analysis windows
- Export functionality available for further analysis

## 3) Technology (what it uses today)
Complex multi-data-source analytics built in `src/app/analytics/page.tsx`:
- `dailyEntryStorage.getAll()` for health metrics across all dates
- `nirvanaSessionStorage.getSessionHistory()` for training data
- `bodyPartMappingStorage.getBodyPartUsage()` for heat map analysis
- `sessionCorrelationStorage.analyzeCorrelations()` for AI insights
- `profileStorage.get()` for BMR-based calculations
- Recharts library for data visualization (LineChart, BarChart, AreaChart)
- Complex data processing with statistical analysis and confidence scoring
- Body part position mapping for visual heat maps
- Correlation analysis with same-day and sequence pattern detection
- Real-time data aggregation from multiple localStorage sources

## 4) Design Directions (what it looks/feels like)
**Layout:** Multi-section dashboard with distinct visualization areas
**Chart Types:** Line charts for trends, bar charts for frequency, heat maps for body parts
**Color Coding:** Blue for health metrics, purple for Nirvana training, consistent throughout
**Interactive Elements:** Hover tooltips, clickable time period buttons, responsive charts
**Section Organization:** Health analytics first, then specialized Nirvana training analytics
**Mobile Responsive:** Charts resize and stack appropriately for mobile viewing
**Loading States:** Data processing indicators for complex correlation analysis
**Export Options:** JSON and CSV export capabilities for external analysis

## Data We Store (plain-English "table idea")
Analytics reads from existing tables but doesn't store new data:
- Processes `daily_entries` for health trends
- Processes `nirvana_entries` for training patterns
- Processes `injection_entries` for medication adherence
- Processes `body_part_mappings` for anatomical analysis
- Creates derived analytics data in memory only

Potential analytics cache table:
- `analytics_cache` table:
  - `id`, `user_id`, `cache_key`, `data` (JSON)
  - `expires_at`, `created_at`
  - For expensive correlation calculations

## Who Can See What (safety/permissions in plain words)
- Only the signed-in user can see analytics derived from their own data
- All charts and insights are private to the individual user
- No comparative or social analytics features
- Health and training patterns remain confidential

## Acceptance Criteria (done = true)
- As a user, I can see my weight trend over time with clear trend visualization
- As a user, I can adjust calorie balance analysis time periods and see data update
- As a user, I can view Nirvana training frequency and session type breakdowns
- As a user, I can see body part heat maps showing which areas I train most/least
- As a user, I can view AI-generated insights about my training patterns
- As a user, I can see session correlation analysis with confidence scores
- As a user, I can see training streaks and consistency metrics
- If I have insufficient data, I see helpful empty states explaining what's needed
- As a user, I can export my analytics data for external analysis
- Charts are interactive with hover details and responsive on mobile devices

## Open Questions / Assumptions
- Correlation analysis uses complex statistical confidence measures - unclear how users interpret these
- Body part heat mapping requires predefined session-to-anatomy mappings
- AI insights appear to be rule-based rather than machine learning
- No historical analytics caching - all calculations happen in real-time
- Time period analysis is limited to preset options (7/30/90 days)
- No goal setting or target analysis within the analytics dashboard

## Code References
- Main analytics page: `src/app/analytics/page.tsx:63-100+`
- Data loading: `src/app/analytics/page.tsx:89-200+` (loadAnalyticsData function)
- Body part analysis: `src/lib/storage.ts:1077-1125` (getBodyPartUsage)
- Correlation analysis: `src/lib/storage.ts:1130-1319` (analyzeCorrelations, generateInsights)
- Chart components: Recharts integration throughout analytics page
- Analytics types: `src/app/analytics/page.tsx:33-61` (AnalyticsData interface)
- Session insights: `src/types/index.ts:189-214` (SessionCorrelation, CorrelationAnalysis)