# ContentSync MVP Setup Guide

This guide will walk you through setting up the ContentSync MVP from scratch.

## 🎯 What We're Building

A production-ready MVP with:
- ✅ User authentication
- ✅ Platform management
- ✅ AI-powered content repurposing
- ✅ Content review workflow
- ✅ Real-time updates
- ✅ Modern UI/UX

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free tier works)
- Google Gemini API access

## 🚀 Step-by-Step Setup

### Step 1: Project Setup

```bash
# Clone the repository (if you haven't already)
git clone <your-repo-url>
cd contentsync-mvp

# Install dependencies
npm install
```

### Step 2: Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `contentsync-mvp`
   - Set a database password
   - Choose a region close to you
   - Click "Create new project"

2. **Get API Keys**
   - Go to Settings > API
   - Copy the Project URL
   - Copy the anon public key
   - Copy the service_role key (keep this secret!)

3. **Run Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste and run the SQL

### Step 3: Google Gemini Setup

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the API key

### Step 4: Environment Configuration

```bash
# Copy environment template
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Test Local Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 🔧 Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `app/` and `components/`
2. **API Changes**: Edit files in `app/api/`
3. **Database Changes**: Update `supabase/schema.sql` and run in Supabase dashboard

### Testing Features

1. **Authentication**: Sign up with a new email
2. **Platform Management**: Add a test platform
3. **Content Repurposing**: Try the AI content generation
4. **Review Workflow**: Test the approval process

## 🚀 Deployment to Vercel

### Step 1: Prepare for Deployment

```bash
# Run the deployment script
./scripts/deploy.sh
```

### Step 2: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   In Vercel dashboard, add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   npm run build
   ```

2. **Supabase Connection Issues**
   - Check your API keys in `.env.local`
   - Verify RLS policies are enabled
   - Check Supabase dashboard for errors

3. **Gemini API Errors**
   - Verify your API key is correct
   - Check API usage limits
   - Ensure you have billing set up if needed

### Getting Help

- Check the [README.md](README.md) for more details
- Review Supabase documentation
- Check Google Gemini API documentation

## 📊 Monitoring & Analytics

### Supabase Dashboard
- Monitor database performance
- Check authentication logs
- Review API usage

### Vercel Analytics
- Monitor app performance
- Check error logs
- Track user analytics

## 🔒 Security Checklist

- [ ] Environment variables are set
- [ ] RLS policies are enabled
- [ ] API keys are secure
- [ ] HTTPS is enabled
- [ ] Input validation is working

## 🎉 Next Steps

After successful deployment:

1. **Test All Features**
   - User registration/login
   - Platform management
   - Content repurposing
   - Review workflow

2. **Add Real Platform Integrations**
   - YouTube API
   - Instagram API
   - Twitter API
   - LinkedIn API

3. **Enhance AI Features**
   - Better prompts
   - Content templates
   - Batch processing

4. **Add Analytics**
   - User engagement
   - Content performance
   - AI usage metrics

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs
3. Create an issue in the repository
4. Contact support

---

**Happy coding! 🚀** 