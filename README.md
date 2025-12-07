# BW-Backbone

**Operations Management System for Biltwood Powder Coating**

A comprehensive web-based platform that unifies quoting, job tracking, production workflow, quality control, maintenance, invoicing, and payroll into a single integrated dashboard.

## Quick Links

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete project vision and roadmap
- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Full database design documentation
- **[SETUP.md](SETUP.md)** - Step-by-step setup instructions

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Integrations**: Google OAuth, Google Drive API, QuickBooks

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials (see SETUP.md for details).

### 3. Set Up Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the migration script: `supabase/migrations/001_initial_schema.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/              # Next.js pages
│   ├── (auth)/      # Login & auth
│   ├── dashboard/   # Main dashboard
│   └── jobs/        # Job management
├── components/      # React components
├── lib/             # Utilities & Supabase client
└── types/           # TypeScript definitions
```

## Core Features

### Phase 1 (Current Foundation)
- ✅ Authentication (Google OAuth + Email)
- ✅ Dashboard shell
- ✅ Job management foundation
- ✅ Database schema
- 🔄 Time tracking (planned)
- 🔄 QC module (planned)

### Phase 2 (Next Steps)
- Job creation & traveler generation
- QR code workflows
- Google Drive integration
- Time clock system
- Manager approval workflows
- QuickBooks export

### Phase 3 (Future)
- JARVIS AI estimator
- Marketing automation
- Advanced analytics
- Mobile PWA

## Key Modules

1. **Job & Production Management** - Complete job lifecycle tracking
2. **JARVIS Estimator** - AI-powered quote generation
3. **Material Library** - Powder colors and vendor catalogs
4. **Staff Management** - Role-based access and team portal
5. **Time Tracking** - Clock in/out with payroll integration
6. **Quality Control** - Defect tracking and trend analysis
7. **Equipment Maintenance** - Inspections and preventive maintenance
8. **Invoicing** - Auto-generation and QuickBooks sync
9. **Marketing Dashboard** - Social media automation
10. **Role-Based Dashboards** - Custom views per department

## Development

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Documentation

- See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete table structures
- See [SETUP.md](SETUP.md) for detailed setup instructions
- See [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for full project scope

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Support

For setup questions, see SETUP.md or contact the development team.

## License

Proprietary - Biltwood Powder Coating
