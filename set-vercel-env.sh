#!/bin/bash
export PATH="/tmp/node-v20.10.0-darwin-arm64/bin:$PATH"

# Add environment variables to Vercel
echo "https://placeholder.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "placeholder-key" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Environment variables set!"
