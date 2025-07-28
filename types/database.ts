export type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'blog'
export type PlatformStatus = 'connected' | 'error' | 'syncing' | 'pending'
export type ContentType = 'video' | 'post' | 'story' | 'article' | 'thread' | 'carousel'
export type ContentPriority = 'high' | 'medium' | 'low'
export type ContentStatus = 'detected' | 'in_progress' | 'completed' | 'dismissed'
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'published'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Platform {
  id: string
  user_id: string
  name: string
  url?: string
  platform_type: PlatformType
  status: PlatformStatus
  last_sync?: string
  content_count: number
  gap_count: number
  primary_color?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ContentGap {
  id: string
  user_id: string
  title: string
  description?: string
  source_platform?: string
  target_platform?: string
  content_type: ContentType
  priority: ContentPriority
  status: ContentStatus
  engagement_score?: number
  source_content_url?: string
  generated_content?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface RepurposedContent {
  id: string
  user_id: string
  original_content_title: string
  original_platform?: string
  target_platform?: string
  original_content?: string
  repurposed_content: string
  content_type: ContentType
  status: ReviewStatus
  confidence_score?: number
  hashtags?: string[]
  notes?: string
  scheduled_date?: string
  created_at: string
  updated_at: string
}

export interface ContentReview {
  id: string
  user_id: string
  content_id: string
  status: ReviewStatus
  reviewer_notes?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface AIGeneration {
  id: string
  user_id: string
  prompt: string
  response?: string
  model_used: string
  tokens_used?: number
  processing_time_ms?: number
  success: boolean
  error_message?: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      platforms: {
        Row: Platform
        Insert: Omit<Platform, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Platform, 'id' | 'created_at' | 'updated_at'>>
      }
      content_gaps: {
        Row: ContentGap
        Insert: Omit<ContentGap, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContentGap, 'id' | 'created_at' | 'updated_at'>>
      }
      repurposed_content: {
        Row: RepurposedContent
        Insert: Omit<RepurposedContent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<RepurposedContent, 'id' | 'created_at' | 'updated_at'>>
      }
      content_reviews: {
        Row: ContentReview
        Insert: Omit<ContentReview, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ContentReview, 'id' | 'created_at' | 'updated_at'>>
      }
      ai_generations: {
        Row: AIGeneration
        Insert: Omit<AIGeneration, 'id' | 'created_at'>
        Update: Partial<Omit<AIGeneration, 'id' | 'created_at'>>
      }
    }
  }
} 