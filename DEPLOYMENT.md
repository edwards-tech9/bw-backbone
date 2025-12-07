# BW-Backbone Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy from GitHub

1. **Push to GitHub:**
   ```bash
   # If you haven't already, create a new GitHub repository
   # Then push your code
   git remote add origin https://github.com/YOUR_USERNAME/bw-backbone.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure everything
   - Click "Deploy"

3. **Environment Variables (Optional for demo):**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add the same variables from your `.env.local` file
   - Or leave as-is to use mock data mode

### Option 2: Deploy from CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Features of Deployed Demo

### Immediately Available (Using Mock Data):
- ✅ Job Management - View 3 sample jobs, create new ones
- ✅ Time Tracking - Clock in/out for demo staff
- ✅ Quality Control - Record QC inspections
- ✅ Staff Directory - View team members with roles
- ✅ Equipment Management - Track equipment status
- ✅ QR Code Generation - Generate QR codes for jobs
- ✅ Dashboard with Live Stats

### Mock Data Includes:
- 2 Customers (Acme Manufacturing, BuildRight Construction)
- 3 Staff Members (Manager, Operator, QA Inspector)
- 3 Jobs (In Progress, QA, Completed)
- Time Punches (Clock in/out history)
- QC Events (Pass/Fail inspections)
- 2 Equipment Items (Powder Booth, Cure Oven)

## Connecting Real Database (After Deployment)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to provision (~2 minutes)

### Step 2: Run Database Migration

1. In Supabase dashboard, go to SQL Editor
2. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste into SQL Editor and run
4. Verify all tables were created (check the Table Editor)

### Step 3: Update Environment Variables

1. In Supabase, go to Settings > API
2. Copy:
   - Project URL
   - Anon/Public key
   - Service Role key

3. Update in Vercel:
   - Go to your project settings
   - Environment Variables section
   - Update these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-key
     NEXT_PUBLIC_USE_MOCK_DATA=false
     ```

4. Redeploy your project to apply changes

### Step 4: Enable Google OAuth (Optional)

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Add authorized redirect URLs:
   - `https://your-project.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

The app will run in demo mode with mock data by default.

## Demo Mode vs Production Mode

### Demo Mode (Default)
- `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`
- Uses mock data from `/src/lib/mockData.ts`
- No Supabase connection required
- Perfect for testing and demonstrations
- All features work with sample data

### Production Mode
- `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
- Requires Supabase configuration
- Real database with persistence
- Google OAuth authentication
- Multi-user support with row-level security

## Deployment Checklist

Before deploying to production:

- [ ] Supabase project created and configured
- [ ] Database migration script executed successfully
- [ ] Environment variables updated in Vercel
- [ ] Google OAuth configured (if needed)
- [ ] Mock data mode disabled (`NEXT_PUBLIC_USE_MOCK_DATA=false`)
- [ ] Test all features with real data
- [ ] Row-level security policies configured
- [ ] Staff members added to database
- [ ] Initial customers created

## Vercel Deployment Settings

When deploying, Vercel will automatically:
- Detect Next.js project
- Install dependencies
- Build the production bundle
- Deploy to global CDN
- Enable auto-deployments from main branch

### Recommended Settings:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** (leave default)
- **Install Command:** `npm install`
- **Node Version:** 20.x

## Custom Domain (Optional)

1. In Vercel project settings, go to Domains
2. Add your custom domain (e.g., `ops.biltwood.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate to provision
5. Update Google OAuth redirect URLs if using auth

## Monitoring & Analytics

Vercel provides built-in:
- Real-time logs
- Analytics dashboard
- Performance monitoring
- Error tracking

Access via your Vercel project dashboard.

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build` locally
- Verify all imports are correct
- Check environment variables are set

### Mock Data Not Showing
- Verify `NEXT_PUBLIC_USE_MOCK_DATA=true` in environment
- Check browser console for errors
- Clear browser cache and reload

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is running
- Test connection in Supabase dashboard
- Review RLS policies (they may block access)

### QR Codes Not Generating
- This uses client-side library, should work offline
- Check browser console for errors
- Try different browser

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

Project-specific questions: See README.md and PROJECT_OVERVIEW.md
