# BW-Backbone Setup Guide

## Prerequisites

- Node.js 20.x or higher
- A Supabase account (free tier works for development)
- Google Cloud project (for OAuth and Drive API)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy the following values:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon/Public key
   - Service role key (keep this secret!)

4. Create the database tables by running the migration script:
   - Go to SQL Editor in Supabase dashboard
   - Run the scripts in `supabase/migrations/` (we'll create these next)

## Step 2: Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials from Step 1
3. Leave Google and QuickBooks credentials empty for now (we'll set up later)

```bash
cp .env.local.example .env.local
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Google OAuth Setup (Optional - for later)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API and Google Drive API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

## Step 6: Google Drive API Setup (Optional - for later)

1. In the same Google Cloud project, enable Google Drive API
2. Create an API key (restrict it to Drive API)
3. Create a root folder in Google Drive for BW-Backbone
4. Share that folder with the service account email
5. Copy folder ID (from URL) to `.env.local` as `GOOGLE_DRIVE_PARENT_FOLDER_ID`

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── jobs/              # Job management
│   ├── time/              # Time tracking
│   ├── qa/                # Quality control
│   ├── equipment/         # Equipment management
│   ├── invoicing/         # Billing & invoicing
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard widgets
│   ├── jobs/             # Job-related components
│   ├── time/             # Time tracking components
│   ├── qa/               # QC components
│   ├── equipment/        # Equipment components
│   ├── invoicing/        # Invoicing components
│   └── marketing/        # Marketing components
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Next Steps

1. Create database migration scripts
2. Set up authentication flows
3. Build core dashboard UI
4. Implement job management module
5. Add time tracking functionality
6. Integrate Google Drive
7. Build QC module
8. Create invoicing system
9. Add marketing tools

## Development Workflow

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Migrations

All database schemas are documented in `DATABASE_SCHEMA.md`. We'll create migration scripts in the `supabase/migrations/` directory.

## Support

For questions or issues, refer to the main project documentation or contact the development team.
