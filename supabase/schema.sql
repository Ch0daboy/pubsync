-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE platform_type AS ENUM ('youtube', 'instagram', 'twitter', 'linkedin', 'tiktok', 'blog');
CREATE TYPE platform_status AS ENUM ('connected', 'error', 'syncing', 'pending');
CREATE TYPE content_type AS ENUM ('video', 'post', 'story', 'article', 'thread', 'carousel');
CREATE TYPE content_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE content_status AS ENUM ('detected', 'in_progress', 'completed', 'dismissed');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'published');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platforms table
CREATE TABLE public.platforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  platform_type platform_type NOT NULL,
  status platform_status DEFAULT 'pending',
  last_sync TIMESTAMP WITH TIME ZONE,
  content_count INTEGER DEFAULT 0,
  gap_count INTEGER DEFAULT 0,
  primary_color TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_gaps table
CREATE TABLE public.content_gaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source_platform UUID REFERENCES public.platforms(id) ON DELETE CASCADE,
  target_platform UUID REFERENCES public.platforms(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  priority content_priority DEFAULT 'medium',
  status content_status DEFAULT 'detected',
  engagement_score DECIMAL(3,2),
  source_content_url TEXT,
  generated_content TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create repurposed_content table
CREATE TABLE public.repurposed_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  original_content_title TEXT NOT NULL,
  original_platform UUID REFERENCES public.platforms(id) ON DELETE CASCADE,
  target_platform UUID REFERENCES public.platforms(id) ON DELETE CASCADE,
  original_content TEXT,
  repurposed_content TEXT NOT NULL,
  content_type content_type NOT NULL,
  status review_status DEFAULT 'pending',
  confidence_score DECIMAL(3,2),
  hashtags TEXT[],
  notes TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_reviews table
CREATE TABLE public.content_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES public.repurposed_content(id) ON DELETE CASCADE NOT NULL,
  status review_status DEFAULT 'pending',
  reviewer_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_generations table for logging
CREATE TABLE public.ai_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  model_used TEXT DEFAULT 'gemini-pro',
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_platforms_user_id ON public.platforms(user_id);
CREATE INDEX idx_content_gaps_user_id ON public.content_gaps(user_id);
CREATE INDEX idx_repurposed_content_user_id ON public.repurposed_content(user_id);
CREATE INDEX idx_content_reviews_user_id ON public.content_reviews(user_id);
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repurposed_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own platforms" ON public.platforms
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own content gaps" ON public.content_gaps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own repurposed content" ON public.repurposed_content
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own content reviews" ON public.content_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI generations" ON public.ai_generations
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON public.platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_gaps_updated_at BEFORE UPDATE ON public.content_gaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repurposed_content_updated_at BEFORE UPDATE ON public.repurposed_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_reviews_updated_at BEFORE UPDATE ON public.content_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 