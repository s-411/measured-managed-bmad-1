# Technical Assumptions

## Repository Structure: Monorepo

Single repository containing the Next.js application, shared components, and future service modules. Structure: apps/ (web, future mobile), packages/ (shared, ui, utils), services/ (api, workers).

## Service Architecture

Start with Next.js monolithic architecture using API routes for backend logic. Design with clear domain boundaries to enable future microservices extraction. Use dependency injection patterns to facilitate testing and modularity.

## Testing Requirements

Unit tests for all calculation logic and storage operations. Integration tests for critical user flows. Manual testing convenience methods for localStorage inspection. Visual regression testing for key UI components. No E2E tests in MVP phase.

## Additional Technical Assumptions and Requests

- TypeScript strict mode enabled for type safety
- Tailwind CSS 4.0 with custom MM theme configuration
- React 19 with Server Components where beneficial
- localStorage as primary data store with migration path planned
- React Context + useReducer for state management
- Date-fns for all date manipulations maintaining YYYY-MM-DD format
- Recharts for data visualizations
- Progressive enhancement approach for JavaScript-dependent features
- No external analytics or tracking scripts for privacy
- Build-time optimization for minimal bundle size
- Environment-based configuration for API endpoints
- GitHub Actions for CI/CD pipeline
- Vercel deployment with preview environments