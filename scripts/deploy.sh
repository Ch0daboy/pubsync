#!/bin/bash

echo "🚀 ContentSync MVP Deployment Script"
echo "====================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy env.example to .env.local and fill in your environment variables"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Ready to deploy!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Vercel"
    echo "3. Add environment variables in Vercel dashboard"
    echo "4. Deploy!"
    echo ""
    echo "Environment variables needed in Vercel:"
    echo "- NEXT_PUBLIC_SUPABASE_URL"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "- SUPABASE_SERVICE_ROLE_KEY"
    echo "- GOOGLE_GEMINI_API_KEY"
    echo "- NEXT_PUBLIC_APP_URL"
else
    echo "❌ Build failed!"
    exit 1
fi 