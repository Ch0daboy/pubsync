'use client'

import React, { useState } from 'react'
import { Wand2, Copy, Download, Share2, Sparkles } from 'lucide-react'
import Layout from '@/components/Layout'

const platforms = [
  { id: 'youtube', name: 'YouTube', color: 'from-red-400 to-red-600' },
  { id: 'instagram', name: 'Instagram', color: 'from-pink-400 to-purple-600' },
  { id: 'twitter', name: 'Twitter', color: 'from-blue-400 to-blue-600' },
  { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
  { id: 'tiktok', name: 'TikTok', color: 'from-gray-800 to-gray-900' },
  { id: 'blog', name: 'Blog', color: 'from-green-400 to-green-600' }
]

export default function RepurposePage() {
  const [originalContent, setOriginalContent] = useState('')
  const [sourcePlatform, setSourcePlatform] = useState('')
  const [targetPlatform, setTargetPlatform] = useState('')
  const [repurposedContent, setRepurposedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRepurpose = async () => {
    if (!originalContent || !sourcePlatform || !targetPlatform) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalContent,
          sourcePlatform,
          targetPlatform,
          originalContentTitle: 'User Content',
          contentType: 'post'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to repurpose content')
      }

      const data = await response.json()
      setRepurposedContent(data.repurposedContent)
    } catch (error) {
      console.error('Error repurposing content:', error)
      alert('Failed to repurpose content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(repurposedContent)
    alert('Content copied to clipboard!')
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="clay-element bg-gradient-to-br from-purple-400 to-blue-500 p-3">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">AI Content Repurposer</h1>
            <p className="text-gray-600 font-medium">Transform your content for different platforms with AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="clay-element bg-white/60 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Original Content</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Platform</label>
              <select
                value={sourcePlatform}
                onChange={(e) => setSourcePlatform(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select source platform</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Platform</label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select target platform</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                placeholder="Paste your original content here..."
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleRepurpose}
              disabled={isLoading || !originalContent || !sourcePlatform || !targetPlatform}
              className="w-full clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Repurposing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Repurpose Content
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="clay-element bg-white/60 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Repurposed Content</h2>
            
            {repurposedContent ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {repurposedContent}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="clay-button bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button className="clay-button bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="clay-button bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your repurposed content will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
