# Supabase Setup Guide for BW-Backbone

## Quick Setup (15 minutes)

This guide will walk you through setting up your Supabase backend for BW-Backbone.

---

## Step 1: Create Supabase Account & Project (5 min)

1. **Go to Supabase**: https://supabase.com
2. **Sign up** or **Sign in** with GitHub (recommended)
3. **Create a new project**:
   - Click "New Project"
   - **Name**: `bw-backbone-production`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to you (e.g., "East US (North Virginia)")
   - **Plan**: Start with Free tier
   - Click "Create new project"
4. **Wait ~2 minutes** for provisioning

---

## Step 2: Get Your API Credentials (1 min)

Once your project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. **Copy these values** (you'll need them):
   - **Project URL** (under "Project URL")
   - **anon public key** (under "Project API keys")

---

## Step 3: Run Database Migration (3 min)

1. In Supabase dashboard, click **SQL Editor** (icon in sidebar)
2. Click "**+ New query**"
3. **Copy the entire contents** of `/Users/edwardseal/BW-Backbone/supabase/migrations/001_initial_schema.sql`
4. **Paste** into the SQL editor
5. Click "**Run**" (or press Cmd+Enter)
6. You should see: "Success. No rows returned"

This creates all 16+ tables for your app!

---

## Step 4: Configure Google OAuth (5 min)

### A. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to **APIs & Services** > **Credentials**
4. Click "**Create Credentials**" > "**OAuth 2.0 Client ID**"
5. **Application type**: Web application
6. **Name**: "BW-Backbone"
7. **Authorized redirect URIs** - Add this URL (replace YOUR_PROJECT_REF with your actual Supabase project reference):
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

   To find YOUR_PROJECT_REF:
   - Look at your Supabase Project URL
   - It's the subdomain: `https://[THIS_PART].supabase.co`

8. Click "**Create**"
9. **Copy** your Client ID and Client Secret

### B. Add to Supabase

1. In Supabase, go to **Authentication** > **Providers**
2. Find "**Google**" and click to expand
3. **Enable** the toggle
4. Paste your **Client ID** and **Client Secret**
5. Click "**Save**"

---

## Step 5: Update Vercel Environment Variables (2 min)

Now connect your live database to Vercel:

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/edwards-projects-cac5e695/bw-backbone/settings/environment-variables
2. Find `NEXT_PUBLIC_SUPABASE_URL` and click "Edit"
   - Update value to your Supabase Project URL
   - Save
3. Find `NEXT_PUBLIC_SUPABASE_ANON_KEY` and click "Edit"
   - Update value to your anon public key
   - Save
4. Find `NEXT_PUBLIC_USE_MOCK_DATA` and click "Edit"
   - Change value from `true` to `false`
   - Save

### Option B: Via CLI

```bash
cd /Users/edwardseal/BW-Backbone

# Remove old values
npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production
npx vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env rm NEXT_PUBLIC_USE_MOCK_DATA production

# Add new values
echo "YOUR_SUPABASE_PROJECT_URL" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "YOUR_SUPABASE_ANON_KEY" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "false" | npx vercel env add NEXT_PUBLIC_USE_MOCK_DATA production
```

---

## Step 6: Redeploy Your App (1 min)

```bash
cd /Users/edwardseal/BW-Backbone
npx vercel --prod
```

Or push to GitHub (auto-deploys):
```bash
git add .
git commit -m "Switch to production Supabase"
git push
```

---

## Step 7: Test Your Live App! (2 min)

1. Visit https://bw-backbone.vercel.app
2. You should now see "**Sign in with Google**" button
3. Click it and sign in with your Google account
4. You're in! 🎉

---

## Verify Everything Works

✅ **Authentication**: Can you sign in with Google?
✅ **Database**: Go to Jobs > Create New Job - does it save?
✅ **Time Tracking**: Can you clock in/out?
✅ **QC**: Can you record an inspection?

---

## Troubleshooting

### "Invalid login credentials"
- Double-check your Google OAuth credentials in Supabase
- Make sure the redirect URI matches exactly

### "Cannot connect to database"
- Verify your env vars in Vercel are correct
- Check Supabase project is not paused (Free tier pauses after 7 days inactivity)

### "Network error"
- Check Supabase project status at https://status.supabase.com/

### Still stuck?
- Check Supabase logs: Dashboard > Logs
- Check Vercel logs: `npx vercel logs`

---

## What You Just Built

🎉 **Congratulations!** You now have:

- ✅ Production PostgreSQL database (Supabase)
- ✅ Real-time authentication with Google OAuth
- ✅ Secure API with Row Level Security
- ✅ Deployed app with live data
- ✅ All 6 modules connected to database
- ✅ Ready for your team to use!

---

## Next Steps

1. **Add your team**: Go to Settings > Team in Supabase dashboard
2. **Import data**: Use the Supabase Table Editor to add:
   - Customers
   - Staff members
   - Equipment
3. **Customize**: Update colors, logos, etc. in the code
4. **Train staff**: Share the URL and show them how to use it!

---

## Cost Estimate

- **Supabase Free Tier**: $0/month
  - 500MB database
  - 2GB bandwidth
  - 50,000 monthly active users
  - Perfect for getting started!

- **Vercel Hobby Tier**: $0/month
  - Perfect for this app

**Total monthly cost: $0** until you need to scale! 🚀

---

## Support

Need help? Check these docs:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)

---

*Created: December 7, 2025*
*BW-Backbone v1.0*
