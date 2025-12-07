#!/bin/bash

# BW-Backbone Production Setup Script
# This script connects your app to Supabase and deploys to production

set -e  # Exit on error

echo "🚀 BW-Backbone Production Setup"
echo "================================"
echo ""

# Set Node path
export PATH="/tmp/node-v22.12.0-darwin-arm64/bin:$PATH"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from /Users/edwardseal/BW-Backbone"
    exit 1
fi

echo "📋 Please have your Supabase credentials ready:"
echo "   - Project URL (from Settings > API)"
echo "   - Anon Key (from Settings > API)"
echo ""

# Prompt for Supabase credentials
read -p "Enter your Supabase Project URL: " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Both Project URL and Anon Key are required"
    exit 1
fi

echo ""
echo "✅ Credentials received!"
echo ""

# Update .env.local for local development
echo "📝 Updating .env.local..."
cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF

echo "✅ Local environment configured"
echo ""

# Update Vercel environment variables
echo "🔧 Updating Vercel production environment..."
echo ""

# Remove old mock data values
echo "Removing old environment variables..."
npx vercel env rm NEXT_PUBLIC_USE_MOCK_DATA production --yes 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>/dev/null || true

# Add new production values
echo "Adding production Supabase credentials..."
echo "$SUPABASE_URL" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "false" | npx vercel env add NEXT_PUBLIC_USE_MOCK_DATA production

echo ""
echo "✅ Vercel environment updated"
echo ""

# Update mockData.ts to use environment variable instead of hardcoded true
echo "📝 Updating mock data configuration..."
sed -i '' 's/export const useMockData = true/export const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === '\''true'\''/' src/lib/mockData.ts

echo "✅ Mock data configuration updated"
echo ""

# Build the app
echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
else
    echo "❌ Build failed"
    exit 1
fi

# Commit changes
echo "📦 Committing changes..."
git add -A
git commit -m "feat: Connect to production Supabase database

- Added Supabase credentials
- Disabled mock data mode
- Ready for production deployment"

echo "✅ Changes committed"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push

echo "✅ Pushed to GitHub"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel production..."
npx vercel --yes --prod

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "✅ Your app is now connected to Supabase"
echo "✅ Deployed to production"
echo ""
echo "Next steps:"
echo "1. Visit https://bw-backbone.vercel.app"
echo "2. Sign in with Google"
echo "3. Start using your app!"
echo ""
echo "📚 Database is ready with:"
echo "   - Jobs table"
echo "   - Staff table"
echo "   - Customers table"
echo "   - Time tracking"
echo "   - QC events"
echo "   - Equipment"
echo "   - And 10+ more tables!"
echo ""
echo "Happy powder coating! 🎨"
