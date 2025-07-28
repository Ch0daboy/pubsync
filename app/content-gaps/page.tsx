'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, ArrowRight, Wand2 } from 'lucide-react'
import Layout from '@/components/Layout'
import { useAuth } from '@/components/AuthProvider'

const platformIcons = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  blog: 'Blog',
  tiktok: 'TikTok'
}

type Priority = 'high' | 'medium' | 'low'
type Platform = 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'blog' | 'tiktok'

interface ContentGap {
  id: number
  title: string
  description: string
  source_platform: Platform
  target_platform: Platform
  priority: Priority
  original_content?: string
}

const priorityConfig: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200'
}

const ContentGapCard = ({ gap, index, onGenerate }: { 
  gap: ContentGap, 
  index: number,
  onGenerate: (gap: ContentGap) => void 
}) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await onGenerate(gap)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="clay-element bg-white/60 p-6 flex flex-col h-full"
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className={`${priorityConfig[gap.priority]} clay-element capitalize px-3 py-1 rounded-full text-sm font-medium`}>
            {gap.priority} Priority
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>{platformIcons[gap.source_platform]}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span>{platformIcons[gap.target_platform]}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{gap.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{gap.description}</p>
        
        {gap.original_content && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Original Content Preview</h4>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 max-h-20 overflow-y-auto">
              {gap.original_content.substring(0, 150)}...
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
    </motion.div>
  )
}

export default function ContentGapsPage() {
  const [gaps, setGaps] = useState<ContentGap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchGaps = async () => {
      if (!user) return
      
      try {
        // For now, we'll generate gaps based on existing platforms and content
        // In a real app, this would be an AI analysis of content gaps
        const platformsResponse = await fetch('/api/platforms')
        const contentResponse = await fetch('/api/repurpose')
        
        if (platformsResponse.ok && contentResponse.ok) {
          const platforms = await platformsResponse.json() as Array<{ platform_type: string }>
          const content = await contentResponse.json() as Array<{ original_content?: string }>
          
          // Generate mock gaps based on platform combinations
          const mockGaps: ContentGap[] = []
          
          if (platforms.length > 0) {
            const platformTypes = platforms.map((p) => p.platform_type)
            
            // Create gaps for different platform combinations
            if (platformTypes.includes('youtube') && platformTypes.includes('instagram')) {
              mockGaps.push({
                id: 1,
                title: "YouTube Video to Instagram Reels",
                description: "Transform your popular YouTube content into engaging Instagram Reels",
                source_platform: "youtube" as Platform,
                target_platform: "instagram" as Platform,
                priority: "high" as Priority,
                original_content: content[0]?.original_content || "Sample YouTube content..."
              })
            }
            
            if (platformTypes.includes('blog') && platformTypes.includes('twitter')) {
              mockGaps.push({
                id: 2,
                title: "Blog Post to Twitter Thread",
                description: "Break down your blog posts into compelling Twitter threads",
                source_platform: "blog" as Platform,
                target_platform: "twitter" as Platform,
                priority: "medium" as Priority,
                original_content: content[1]?.original_content || "Sample blog content..."
              })
            }
            
            if (platformTypes.includes('linkedin') && platformTypes.includes('tiktok')) {
              mockGaps.push({
                id: 3,
                title: "LinkedIn Article to TikTok",
                description: "Convert professional insights into TikTok content",
                source_platform: "linkedin" as Platform,
                target_platform: "tiktok" as Platform,
                priority: "low" as Priority,
                original_content: content[2]?.original_content || "Sample LinkedIn content..."
              })
            }
          }
          
          setGaps(mockGaps)
        } else {
          console.error('Failed to fetch data for gaps')
        }
      } catch (e) {
        console.error("Failed to fetch content gaps", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGaps()
  }, [user])

  const handleGenerateContent = async (gap: ContentGap) => {
    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalContent: gap.original_content || 'Sample content for repurposing',
          sourcePlatform: gap.source_platform,
          targetPlatform: gap.target_platform,
          contentType: 'post',
          originalContentTitle: gap.title
        }),
      })

      if (response.ok) {
        // Remove the gap from the list since content was generated
        setGaps(prev => prev.filter(g => g.id !== gap.id))
        alert('Content generated successfully! Check the Review Queue.')
      } else {
        console.error('Failed to generate content')
        alert('Failed to generate content. Please try again.')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Error generating content. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="clay-element bg-gradient-to-br from-orange-400 to-red-500 p-3">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Content Opportunities</h1>
              <p className="text-gray-600 font-medium">Discover gaps to reuse and expand your content&apos;s reach</p>
            </div>
          </div>
          <button className="clay-button bg-white hover:bg-gray-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
        
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
               <div key={i} className="clay-element bg-white/40 p-6 animate-pulse space-y-4">
                 <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                 <div className="h-5 bg-gray-200 rounded w-full"></div>
                 <div className="h-10 bg-gray-200 rounded w-full"></div>
                 <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
               </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gaps.map((gap, index) => (
              <ContentGapCard 
                key={gap.id} 
                gap={gap} 
                index={index}
                onGenerate={handleGenerateContent}
              />
            ))}
            {gaps.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No content gaps found</p>
                <p className="text-sm">Add more platforms to discover content opportunities</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
