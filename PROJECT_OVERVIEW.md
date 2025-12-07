# BW-Backbone Project Overview

## What We've Built

BW-Backbone is a modern web application built specifically for Biltwood Powder Coating operations management. The foundation has been set up with Next.js, TypeScript, and Supabase as the tech stack.

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React 19** - Latest React features

### Backend & Database
- **Supabase** - PostgreSQL database with built-in auth
- **Row Level Security (RLS)** - Secure, role-based access control
- **Real-time subscriptions** - Live dashboard updates

### Integrations (To be configured)
- Google OAuth - Staff authentication
- Google Drive API - Auto-folder creation and file management
- QuickBooks - Payroll export

## Current Project Structure

```
BW-Backbone/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/          # Authentication page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── jobs/               # Job management
│   │   └── page.tsx            # Root redirects to login
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── jobs/               # Job components
│   │   ├── time/               # Time tracking
│   │   ├── qa/                 # Quality control
│   │   ├── equipment/          # Equipment management
│   │   ├── invoicing/          # Billing
│   │   └── marketing/          # Marketing tools
│   ├── lib/
│   │   └── supabase.ts         # Supabase client
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   └── hooks/                  # Custom React hooks
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete DB schema
├── public/                     # Static assets
├── DATABASE_SCHEMA.md          # Full schema documentation
├── SETUP.md                    # Setup instructions
└── package.json
```

## Core Modules Planned

### 1. Job & Production Management
- Job creation (manual, CSV import, JARVIS integration)
- Traveler system with QR codes
- Auto-folder creation in Google Drive
- Stage tracking (Estimate → Production → QC → Complete → Invoiced)

### 2. JARVIS Estimator (AI)
- Local GPT model for quote generation
- Trained on historical data
- Auto-creates jobs from approved quotes

### 3. Material & Vendor Library
- Pre-seeded powder color catalogs (Prismatic, Tiger, Sherwin)
- Price list management
- Stock tracking

### 4. Staff Management
- Google OAuth authentication
- Role-based access (admin, manager, estimator, operator, qa, billing, marketing)
- QR badges for time clock
- Team portal with PTO requests

### 5. Time Tracking & Payroll
- Clock in/out via QR scan or Google Auth
- Manager review workflow
- Labor cost tracking per job
- QuickBooks export (IIF/CSV format)

### 6. Quality Control
- Defect taxonomy
- Photo requirements for high-risk operations
- Pass/Fail tracking with corrective actions
- Trend analysis dashboard

### 7. Equipment & Maintenance
- Equipment registry with QR codes
- Inspection checklists
- Preventive maintenance scheduler
- Auto-PDF reports to Drive

### 8. Invoicing
- Auto-draft from completed jobs
- Approval workflow
- Email PDF to customer
- Print queue for mailing

### 9. Marketing Dashboard
- Job photo selection
- AI-assisted captions and hashtags
- Social media scheduling (FB/IG)
- Attribution tracking

### 10. Role-Based Dashboards
- Plant Manager view - WIP, utilization, on-time delivery
- Estimator view - Quotes, win rates, margins
- QA view - Inspections, defect trends
- Billing view - Ready to invoice, costs vs quotes
- Marketing view - Post performance, conversions

## What's Complete

✅ Next.js project initialized with TypeScript
✅ Core dependencies installed (Supabase, QR code, date utilities)
✅ Complete database schema designed
✅ Initial SQL migration script created
✅ Project structure organized
✅ Authentication pages (login with Google OAuth + email magic link)
✅ Basic dashboard shell
✅ Jobs list page foundation
✅ TypeScript type definitions
✅ Environment configuration template
✅ Setup documentation

## Next Steps

### Immediate (Phase 1)
1. **Supabase Setup**
   - Create Supabase project
   - Run migration script
   - Configure environment variables
   - Enable Google OAuth

2. **Google Drive Integration**
   - Set up Drive API credentials
   - Build auto-folder creation function
   - Test file linking

3. **Job Management**
   - Job creation form
   - QR code generation
   - Traveler PDF generation
   - CSV import functionality

4. **Time Tracking**
   - Clock in/out UI
   - QR scanner interface
   - Manager approval dashboard

### Phase 2
- Complete all module UIs
- Add real-time updates
- Build role-based dashboards
- QuickBooks integration

### Phase 3
- JARVIS AI integration
- Advanced reporting
- Mobile PWA optimization
- Marketing automation

## Database Schema Highlights

The database includes 16+ tables covering:
- Staff management with role-based access
- Complete job lifecycle tracking
- Parts and operations with QR workflows
- Time punches and labor ledger
- QC events with defect taxonomy
- Equipment inspections and maintenance
- Invoicing and payments
- Marketing posts and attribution
- PTO requests

All tables have proper indexes, foreign keys, and trigger-based `updated_at` timestamps.

## Security & Access Control

Row Level Security (RLS) policies will enforce:
- Admins: Full access
- Managers: Department-specific access
- Operators: View assigned tasks only
- QA: Read jobs, write QC events
- Billing: Jobs and invoices
- Marketing: Jobs and social posts

## Development Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Environment Variables Required

See `.env.local.example` for all required variables:
- Supabase URL and keys
- Google OAuth credentials
- Google Drive API key and folder ID
- QuickBooks credentials (later)

## Support & Documentation

- `DATABASE_SCHEMA.md` - Complete database design
- `SETUP.md` - Step-by-step setup guide
- This file - Project overview and roadmap

## Notes

- WordPress was considered but rejected in favor of Next.js + Supabase for better performance, real-time capabilities, and cleaner architecture
- QuickBooks will be used for payroll instead of ADP/Paychex
- JARVIS AI will be integrated in Phase 3 after data collection
- Google Drive folders will be auto-created for each job

---

**Ready to proceed?** Start with the Supabase setup in `SETUP.md`
