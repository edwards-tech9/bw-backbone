# Supabase Setup - Quick Start Guide

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Create a new organization (or use existing)

## Step 2: Create New Project

1. Click "New Project"
2. Fill in:
   - **Name:** `bw-backbone` (or your choice)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to you (e.g., US West)
   - **Pricing Plan:** Free (perfect for starting)
3. Click "Create new project"
4. Wait ~2 minutes for database to provision

## Step 3: Get Your API Keys

1. In Supabase dashboard, click "Settings" (gear icon)
2. Go to "API" section
3. You'll need these three values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc...
```

**Copy these somewhere safe!** You'll need them in the next step.

## Step 4: Run Database Migration

1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Open the file: `/Users/edwardseal/BW-Backbone/supabase/migrations/001_initial_schema.sql`
4. Copy the ENTIRE contents
5. Paste into Supabase SQL Editor
6. Click "Run" (bottom right)

You should see: "Success. No rows returned"

## Step 5: Verify Tables Were Created

1. Click "Table Editor" (left sidebar)
2. You should see all these tables:
   - staff
   - customers
   - jobs
   - parts
   - operations
   - colors
   - materials
   - qc_events
   - time_punches
   - labor_ledger
   - equipment
   - invoices
   - marketing_posts
   - And more...

If you see all the tables, **success!** ✅

## Step 6: Update Local Environment

1. Open `/Users/edwardseal/BW-Backbone/.env.local`
2. Update these lines with your values from Step 3:

```bash
# Replace these with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...

# Switch to real database mode
NEXT_PUBLIC_USE_MOCK_DATA=false
```

3. Save the file

## Step 7: Test Locally

```bash
# Restart your dev server
npm run dev
```

Open http://localhost:3000

Now the app will use the real Supabase database!

## Step 8: Add Initial Data

### Option A: Use SQL Editor

```sql
-- Add your first staff member
INSERT INTO staff (email, first_name, last_name, employee_id, role, department, status, hourly_rate)
VALUES ('you@biltwood.com', 'Your', 'Name', 'BW001', ARRAY['admin', 'manager'], 'management', 'active', 35.00);

-- Add your first customer
INSERT INTO customers (company_name, contact_name, email, phone, payment_terms)
VALUES ('Test Customer Inc', 'John Doe', 'john@test.com', '555-0100', 'net_30');
```

### Option B: Use the App

Once you have at least one staff member, you can use the web interface to add:
- More staff members
- Customers
- Equipment
- Jobs

## Troubleshooting

### "Error: Invalid API key"
- Double-check you copied the full key (they're very long)
- Make sure no spaces before/after the key
- Verify you're using `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not service role)

### "Error: relation does not exist"
- The migration script didn't run completely
- Go back to SQL Editor
- Try running the migration again
- Check for any error messages

### No data showing in app
- Make sure `NEXT_PUBLIC_USE_MOCK_DATA=false`
- Check browser console for errors
- Verify database has at least one staff member
- Try refreshing the page

### Can't create new records
- Check Row Level Security (RLS) policies
- For now, you can disable RLS on tables while testing
- In Table Editor, click table → Settings → "Enable RLS" (toggle off)

## Enable Google OAuth (Optional)

This allows staff to sign in with Google accounts:

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Find "Google" in the list
3. Toggle it ON
4. You'll need:
   - Google Client ID
   - Google Client Secret
   (Get these from Google Cloud Console)
5. Add authorized redirect URL:
   ```
   https://YOUR-PROJECT.supabase.co/auth/v1/callback
   ```

See Google OAuth setup guide for detailed instructions.

## Row Level Security (RLS) - Production

For production, you'll want to enable RLS on all tables:

```sql
-- Enable RLS on all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Example policy: Staff can only see their own time punches
CREATE POLICY "Users can view own punches"
  ON time_punches FOR SELECT
  USING (staff_id = auth.uid());

-- Example policy: Admins can see everything
CREATE POLICY "Admins can view all punches"
  ON time_punches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE id = auth.uid()
      AND 'admin' = ANY(role)
    )
  );
```

But for initial testing, you can leave RLS disabled.

## Backup Your Database

Supabase automatically backs up daily, but you can also:

1. Go to "Database" → "Backups"
2. See automatic backups listed
3. Click "Download" to save locally
4. Restore from backup if needed

## Next Steps

- ✅ Database is set up
- ✅ App is connected
- ✅ Ready to use!

Now you can:
1. Add your real staff members
2. Import customers
3. Start creating jobs
4. Track time and QC

Then proceed to deploying on Vercel!
