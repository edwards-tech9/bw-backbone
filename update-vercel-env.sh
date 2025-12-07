#!/bin/bash
export PATH="/tmp/node-v22.12.0-darwin-arm64/bin:$PATH"

echo "🔧 Adding Supabase credentials to Vercel..."

# Add Supabase URL
echo "https://vygnafgxzavbystyhytz.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Add Supabase Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Z25hZmd4emF2YnlzdHloeXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTkwNjgsImV4cCI6MjA4MDY5NTA2OH0.oJBAZpzAH0ag12YRkZ98LUsrxtz1O4A8-QhFIS3iU_g" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Disable mock data
echo "false" | npx vercel env add NEXT_PUBLIC_USE_MOCK_DATA production

echo "✅ Vercel environment variables updated!"
