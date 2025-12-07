# Deploy BW-Backbone to Vercel

## One-Click Deploy (Easiest)

Click this button to deploy your own copy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/bw-backbone&env=NEXT_PUBLIC_USE_MOCK_DATA,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Environment%20variables%20needed%20for%20BW-Backbone&envLink=https://github.com/YOUR-USERNAME/bw-backbone/blob/main/README.md&project-name=bw-backbone&repository-name=bw-backbone)

**Note:** Replace `YOUR-USERNAME` with your GitHub username after pushing to GitHub.

## Manual Deploy (Step by Step)

### Prerequisites
- GitHub account
- Vercel account (free)

### Step 1: Push to GitHub

```bash
# Navigate to project
cd /Users/edwardseal/BW-Backbone

# If not already done, push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/bw-backbone.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your `bw-backbone` repository
5. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### Step 3: Environment Variables

Add these in Vercel:

```
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
```

**Note:** With `NEXT_PUBLIC_USE_MOCK_DATA=true`, the app will work immediately with demo data. No database needed!

### Step 4: Deploy

1. Click "Deploy"
2. Wait ~2 minutes
3. Get your URL: `https://bw-backbone-xxx.vercel.app`

🎉 **You're live!**

## After Deployment

### Share the Demo

Your app is now live at: `https://YOUR-PROJECT.vercel.app`

Share this link with:
- Your team for feedback
- Stakeholders for approval
- Staff for training

### Switch to Production Database (Later)

When ready to use real data:

1. Set up Supabase (see `SUPABASE_SETUP.md`)
2. In Vercel dashboard, go to Settings → Environment Variables
3. Update:
   ```
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
4. Redeploy: Deployments → ⋮ → Redeploy

## Automatic Deployments

Every time you push to GitHub main branch:
- ✅ Vercel automatically rebuilds
- ✅ Runs tests and checks
- ✅ Deploys new version
- ✅ Zero downtime

## Custom Domain (Optional)

1. In Vercel project, go to Settings → Domains
2. Add your domain: `ops.biltwood.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: ops
   Value: cname.vercel-dns.com
   ```
4. Wait for SSL certificate (~10 minutes)
5. Your app is now at your custom domain!

## Deployment Tips

### Preview Deployments

Every branch gets its own URL:
- `main` branch → Production URL
- `feature-branch` → Preview URL

Perfect for testing before merging!

### Rollback Quickly

If something breaks:
1. Go to Deployments
2. Find last working version
3. Click ⋮ → Promote to Production
4. Instant rollback!

### Monitor Performance

Vercel provides:
- Real-time analytics
- Performance metrics
- Error tracking
- Build logs

All in your dashboard.

## Environment Variable Guide

### Demo Mode (Current)
```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
# Supabase variables not needed
```

### Production Mode (Future)
```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Optional, for admin functions

# Optional: Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Optional: Google Drive
GOOGLE_DRIVE_API_KEY=AIzaSy...
GOOGLE_DRIVE_PARENT_FOLDER_ID=1abc...
```

## Troubleshooting Deployment

### Build Failed
```bash
# Test build locally first
npm run build

# If it works locally but fails on Vercel:
# - Check Node.js version (should be 20.x)
# - Verify all dependencies are in package.json
# - Check environment variables are set
```

### App Shows Blank Page
- Check browser console for errors
- Verify environment variables are set
- Check Vercel deployment logs
- Try hard refresh (Cmd+Shift+R)

### Demo Data Not Showing
- Verify `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Check that env var is set in Vercel
- Redeploy after changing env vars
- Clear browser cache

## Cost

### Vercel Pricing
- **Hobby Plan:** FREE
  - Perfect for team use
  - Custom domains
  - Automatic HTTPS
  - 100GB bandwidth/month
  - Unlimited deployments

- **Pro Plan:** $20/month (if you need more)
  - Commercial use
  - Priority support
  - Advanced analytics
  - 1TB bandwidth/month

### Supabase Pricing (When You Add It)
- **Free Plan:**
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
  - Perfect for starting

- **Pro Plan:** $25/month (if you need more)
  - 8GB database
  - 100GB storage
  - 250GB bandwidth

**Total cost to start: $0** 🎉

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Share demo link with team
3. ✅ Gather feedback
4. ✅ Set up Supabase (when ready)
5. ✅ Switch to production mode
6. ✅ Add custom domain
7. ✅ Train staff
8. ✅ Launch!

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: support@vercel.com
- This Project: See other docs in repo

---

**Ready to deploy?** Follow the steps above or click the deploy button! 🚀
