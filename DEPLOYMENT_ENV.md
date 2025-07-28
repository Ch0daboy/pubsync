# Environment Variables for Deployment

This document outlines the environment variables required for deploying ContentSync MVP to Vercel.

## Required Environment Variables

### Supabase Configuration

These variables are required for database and authentication functionality:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**How to get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL for `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the anon public key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the service_role key for `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Google Gemini AI

Required for AI-powered content repurposing:

```
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

**How to get this value:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Application Configuration

```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

**Note:** Replace `your-vercel-domain` with your actual Vercel deployment domain.

## Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value
4. Make sure to set the environment to "Production" (and "Preview" if needed)

### Method 2: Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_GEMINI_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

## Environment Variable Security

### Public Variables (NEXT_PUBLIC_*)
- These are exposed to the browser
- Safe to include: URLs, public keys, feature flags
- **Never include:** passwords, private keys, secrets

### Private Variables
- Only available on the server
- Include: service role keys, private API keys, database credentials
- These are secure and not exposed to the browser

## Validation

After setting environment variables, you can validate they're working by:

1. Checking the Vercel deployment logs
2. Testing authentication functionality
3. Testing AI content generation
4. Verifying database connections

## Troubleshooting

### Common Issues

1. **Build fails with "Environment variable not found"**
   - Ensure all required variables are set in Vercel
   - Check variable names for typos
   - Verify the environment (Production/Preview) is correct

2. **Authentication not working**
   - Verify Supabase URL and keys are correct
   - Check that RLS policies are enabled in Supabase
   - Ensure the domain is added to Supabase auth settings

3. **AI features not working**
   - Verify Google Gemini API key is valid
   - Check API usage limits and billing
   - Ensure the API key has the correct permissions

### Getting Help

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test variables locally first
4. Check Supabase and Google AI Studio dashboards for errors

## Production Checklist

Before deploying to production:

- [ ] All environment variables are set in Vercel
- [ ] Supabase RLS policies are enabled
- [ ] Google Gemini API key is valid and has sufficient quota
- [ ] NEXT_PUBLIC_APP_URL points to production domain
- [ ] Database schema is up to date
- [ ] Authentication is working
- [ ] AI features are functional
