# MM Health Tracker

A comprehensive health and fitness tracking application built with Next.js, React, and Supabase. Features detailed health metrics including calorie tracking, exercise logging, injectable compound management, and specialized Nirvana Life training analytics.

## ✨ Features

### Core Health Tracking
- **BMR-based Calorie Tracking** - Automatic daily calorie balance calculations
- **Exercise Logging** - Comprehensive workout tracking with calorie burn estimation
- **Daily Health Dashboard** - Real-time overview of health metrics
- **Weight & Macro Tracking** - Detailed nutritional monitoring

### Specialized Features
- **Injectable Compound Management** - Track peptides and compounds with dosage schedules
- **Nirvana Life Training** - Gymnastics/mobility session tracking with progress milestones
- **Advanced Analytics** - 6+ visualization types with statistical confidence measures
- **Body Part Heat Mapping** - Visual training frequency analysis

### User Experience
- **Profile Setup** - Guided onboarding with BMR calculations
- **Supabase Authentication** - Secure user management
- **Dark Theme Design** - Custom MM brand styling with Tailwind CSS 4.0
- **Mobile Responsive** - Optimized for all device sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd measured-managed-bmad-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` in the root directory:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

   # Development Environment
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
measured-managed-bmad-1/
├── src/                       # Next.js application source
│   ├── app/                   # Next.js App Router pages
│   │   ├── auth/             # Authentication pages
│   │   ├── daily/            # Main dashboard
│   │   ├── analytics/        # Data visualization
│   │   ├── calories/         # Calorie tracking
│   │   ├── injections/       # Compound management
│   │   ├── nirvana/          # Training tracking
│   │   └── profile/          # User settings
│   ├── components/           # Reusable React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── food/             # Nutrition components
│   │   ├── guards/           # Route protection
│   │   └── profile/          # Profile management
│   ├── lib/                  # Core utilities and services
│   │   ├── context/          # React Context providers
│   │   ├── services/         # Business logic
│   │   ├── supabase/         # Database client config
│   │   └── storage.ts        # Local storage management
│   └── types/                # TypeScript definitions
├── public/                   # Static assets and fonts
├── design-system-cpn/        # Shared design system
├── supabase/                 # Database migrations
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── .env.local               # Environment variables
```

## 🎨 Design System

The application uses a custom design system located in `design-system-cpn/`:

- **Colors**: MM Blue (#00A1FE) primary brand color
- **Typography**: National2Condensed (headings), ESKlarheit (body)
- **Theme**: Dark theme default with custom component classes
- **Components**: `.btn-mm`, `.card-mm`, `.input-mm` for consistency

## 💾 Data Architecture

### Storage Strategy
- **Local Storage**: Primary data persistence for client-side functionality
- **Supabase**: User authentication and future data synchronization
- **Date-keyed Storage**: All entries use `YYYY-MM-DD` format for consistency

### Key Storage Modules
- `profileStorage` - User profiles and BMR calculations
- `dailyEntryStorage` - Daily health metrics
- `nirvanaSessionStorage` - Training sessions
- `injectionTargetStorage` - Compound management
- `weeklyEntryStorage` - Weekly objectives

## 🔧 Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Frontend**: React 19.1.0, TypeScript 5
- **Styling**: Tailwind CSS 4.0 with custom theme
- **Database**: Supabase with Row Level Security
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons React
- **Authentication**: Supabase Auth with SSR

## 📊 Analytics Features

### Visualization Types
1. **Daily Metrics** - BMR-based calorie balancing
2. **Training Analytics** - 6 chart types for Nirvana sessions
3. **Body Part Heat Maps** - Visual frequency analysis
4. **Correlation Analysis** - AI pattern recognition
5. **Progress Tracking** - Milestone achievements
6. **Statistical Confidence** - Data quality indicators

## 🔐 Authentication

- Supabase-powered authentication system
- Row Level Security (RLS) policies
- Protected route middleware
- Profile-based access control
- Session persistence across devices

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Ensure environment variables are configured

### Environment Variables
Required for production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Development Notes

### Key Patterns
- **Date Handling**: All dates as `YYYY-MM-DD` strings with timezone safety
- **State Management**: React Context + useReducer for global state
- **Component Architecture**: Page-level data loading with shared utilities
- **Error Handling**: SSR-safe storage access with graceful fallbacks

### Code Style
- ESLint configured with Next.js best practices
- TypeScript strict mode enabled
- Component-first architecture
- Consistent naming conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

Private project - All rights reserved.

## 🆘 Support

For questions or issues:
1. Check the application logs
2. Verify environment configuration
3. Test with a fresh database state
4. Contact the development team

---

**Built with ❤️ for comprehensive health tracking**