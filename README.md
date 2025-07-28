# ContentSync MVP

AI-powered content repurposing platform that helps you sync and transform your content across all social media platforms.

## 🚀 Features

- **AI Content Repurposing**: Transform content between platforms using Google Gemini AI
- **Multi-Platform Support**: YouTube, Instagram, Twitter, LinkedIn, TikTok, and Blog
- **Content Gap Analysis**: Identify opportunities to repurpose existing content
- **Review Workflow**: Approve and edit AI-generated content before publishing
- **Real-time Dashboard**: Monitor your platforms and content performance
- **Secure Authentication**: Powered by Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Supabase account (free tier works)
- Google Gemini API access
- Vercel account for deployment

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd contentsync-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Environment Variables](DEPLOYMENT_ENV.md) - Environment configuration guide
- [Next Steps](NEXT_STEPS.md) - Future development roadmap

## 🚀 Deployment

### Deploy to Vercel

1. **Prepare for deployment**:
   ```bash
   npm run build
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy!

See [DEPLOYMENT_ENV.md](DEPLOYMENT_ENV.md) for detailed deployment instructions.

## 🧪 Testing

Run the test suite:

```bash
# Basic functionality tests
node test-functionality.js

# API endpoint tests
node test-api.js
```

## 📊 Performance

The application is optimized for production with:

- ✅ Code splitting and lazy loading
- ✅ Optimized bundle sizes
- ✅ Performance monitoring
- ✅ Core Web Vitals tracking
- ✅ Production-ready caching

## 🔒 Security

- ✅ Row Level Security (RLS) enabled
- ✅ Environment variables secured
- ✅ API endpoints protected
- ✅ HTTPS enforced in production
- ✅ Security headers configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](SETUP.md#troubleshooting)
2. Review the documentation
3. Create an issue in the repository
4. Contact support

---

**Built with ❤️ for content creators everywhere**# Updated README - Testing GitHub Actions
