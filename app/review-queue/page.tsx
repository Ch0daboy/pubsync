'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Check, X, Clock, Eye } from 'lucide-react'
import Layout from '@/components/Layout'

type ReviewStatus = 'pending' | 'approved' | 'rejected'

interface ReviewContent {
  id: number
  title: string
  originalPlatform: string
  targetPlatform: string
  originalContent: string
  repurposedContent: string
  status: ReviewStatus
  createdAt: string
}

const statusConfig: Record<ReviewStatus, { color: string, icon: any }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { color: 'bg-green-100 text-green-700', icon: Check },
  rejected: { color: 'bg-red-100 text-red-700', icon: X }
}

const ReviewCard = ({ content, index }: { content: ReviewContent, index: number }) => {
  const [status, setStatus] = useState(content.status)
  const StatusIcon = statusConfig[status].icon

  const handleApprove = () => {
    setStatus('approved')
    // TODO: API call to update status
  }

  const handleReject = () => {
    setStatus('rejected')
    // TODO: API call to update status
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="clay-element bg-white/60 p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">{content.title}</h3>
          <p className="text-sm text-gray-600">
            {content.originalPlatform} → {content.targetPlatform}
          </p>
        </div>
        <div className={`${statusConfig[status].color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {status}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Original Content</h4>
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            {content.originalContent}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Repurposed Content</h4>
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
            {content.repurposedContent}
          </div>
        </div>

        {status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApprove}
              className="clay-button bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={handleReject}
              className="clay-button bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
            <button className="clay-button bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function ReviewQueuePage() {
  const [content, setContent] = useState<ReviewContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | ReviewStatus>('all')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Mock data for now - replace with actual API call
        const mockContent: ReviewContent[] = [
          {
            id: 1,
            title: "YouTube Video to Instagram Reel",
            originalPlatform: "YouTube",
            targetPlatform: "Instagram",
            originalContent: "Check out this amazing tutorial on React hooks! In this video, we'll explore useState, useEffect, and custom hooks...",
            repurposedContent: "🚀 React Hooks Tutorial! \n\n✨ useState for state management\n🔄 useEffect for side effects\n🛠️ Custom hooks for reusability\n\n#ReactJS #WebDev #Programming",
            status: "pending" as ReviewStatus,
            createdAt: "2024-01-15"
          },
          {
            id: 2,
            title: "Blog Post to Twitter Thread",
            originalPlatform: "Blog",
            targetPlatform: "Twitter",
            originalContent: "The future of web development is here with Next.js 14. This framework brings incredible performance improvements...",
            repurposedContent: "🧵 Thread: Next.js 14 is a game-changer! \n\n1/5 Performance improvements that will blow your mind\n2/5 New App Router features\n3/5 Server Components revolution\n4/5 Improved developer experience\n5/5 Why you should upgrade today",
            status: "approved" as ReviewStatus,
            createdAt: "2024-01-14"
          },
          {
            id: 3,
            title: "LinkedIn Post to TikTok",
            originalPlatform: "LinkedIn",
            targetPlatform: "TikTok",
            originalContent: "Professional networking in 2024 requires a strategic approach. Here are 5 tips that have helped me build meaningful connections...",
            repurposedContent: "POV: You're networking like a pro in 2024 💼\n\n✅ Authentic connections over quantity\n✅ Value-first approach\n✅ Follow up consistently\n✅ Be genuinely helpful\n✅ Share your knowledge\n\n#Networking #CareerTips #Professional",
            status: "rejected" as ReviewStatus,
            createdAt: "2024-01-13"
          }
        ]
        setContent(mockContent)
      } catch (e) {
        console.error("Failed to fetch content", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])

  const filteredContent = content.filter(item => 
    filter === 'all' || item.status === filter
  )

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="clay-element bg-gradient-to-br from-green-400 to-blue-500 p-3">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Review Queue</h1>
              <p className="text-gray-600 font-medium">Review and approve AI-generated content</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as 'all' | ReviewStatus)}
                className={`clay-button px-4 py-2 rounded-lg font-medium capitalize ${
                  filter === status
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="clay-element bg-white/40 p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredContent.map((item, index) => (
              <ReviewCard key={item.id} content={item} index={index} />
            ))}
            {filteredContent.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No content to review</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
