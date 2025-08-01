'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Plus, Trash2, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import Layout from '@/components/Layout'
import { useAuth } from '@/components/AuthProvider'
import AddPlatformModal from '@/components/AddPlatformModal'
import { PlatformInfo } from '@/lib/platform-analyzer'

const platformTypes = [
  { id: 'youtube', name: 'YouTube', color: 'from-red-400 to-red-600' },
  { id: 'instagram', name: 'Instagram', color: 'from-pink-400 to-purple-600' },
  { id: 'twitter', name: 'Twitter', color: 'from-blue-400 to-blue-600' },
  { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
  { id: 'tiktok', name: 'TikTok', color: 'from-gray-800 to-gray-900' },
  { id: 'blog', name: 'Blog', color: 'from-green-400 to-green-600' }
]

type PlatformStatus = 'connected' | 'error' | 'pending'
type PlatformType = 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'blog'

interface Platform {
  id: string
  name: string
  url?: string
  platform_type: PlatformType
  status: PlatformStatus
  content_count: number
  gap_count: number
}

const statusConfig: Record<PlatformStatus, { color: string, icon: React.ComponentType<{ className?: string }> }> = {
  connected: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  error: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle }
}

const PlatformCard = ({ platform, onEdit, onDelete }: { platform: Platform, onEdit: (platform: Platform) => void, onDelete: (id: string) => void }) => {
  const platformType = platformTypes.find(p => p.id === platform.platform_type)
  const StatusIcon = statusConfig[platform.status].icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="clay-element bg-white/60 p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`clay-element bg-gradient-to-br ${platformType?.color} p-3`}>
            <div className="w-6 h-6 bg-white rounded text-center text-xs font-bold flex items-center justify-center">
              {platform.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{platform.name}</h3>
            <p className="text-sm text-gray-600">{platformType?.name}</p>
          </div>
        </div>
        <div className={`${statusConfig[platform.status].color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {platform.status}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Content Count:</span>
          <span className="font-medium">{platform.content_count}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Gap Count:</span>
          <span className="font-medium">{platform.gap_count}</span>
        </div>
        {platform.url && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">URL:</span>
            <a href={platform.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-32">
              {platform.url}
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(platform)}
          className="clay-button bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(platform.id)}
          className="clay-button bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </motion.div>
  )
}

export default function SettingsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchPlatforms = async () => {
      if (!user) return
      
      try {
        const response = await fetch('/api/platforms')
        if (response.ok) {
          const data = await response.json() as Array<{
            id: string
            name: string
            url?: string
            platform_type: string
            status?: string
            content_count?: number
            gap_count?: number
          }>
          setPlatforms(data.map((item) => ({
            id: item.id,
            name: item.name,
            url: item.url,
            platform_type: item.platform_type as PlatformType,
            status: (item.status as PlatformStatus) || 'pending',
            content_count: item.content_count || 0,
            gap_count: item.gap_count || 0
          })))
        } else {
          console.error('Failed to fetch platforms')
        }
      } catch (e) {
        console.error("Failed to fetch platforms", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlatforms()
  }, [user])

  const handleAddPlatform = async (platformInfo: PlatformInfo) => {
    try {
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: platformInfo.name,
          url: platformInfo.url,
          platform_type: platformInfo.platform_type,
        }),
      })

      if (response.ok) {
        const newPlatform = await response.json()
        setPlatforms([...platforms, {
          id: newPlatform.id,
          name: newPlatform.name,
          url: newPlatform.url,
          platform_type: newPlatform.platform_type,
          status: newPlatform.status || 'pending',
          content_count: newPlatform.content_count || 0,
          gap_count: newPlatform.gap_count || 0
        }])
      } else {
        throw new Error('Failed to add platform')
      }
    } catch (error) {
      console.error('Error adding platform:', error)
      throw error
    }
  }

  const handleEdit = (platform: Platform) => {
    // TODO: Implement edit functionality
    console.log('Edit platform:', platform)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this platform?')) {
      try {
        const response = await fetch(`/api/platforms/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setPlatforms(platforms.filter(p => p.id !== id))
        } else {
          console.error('Failed to delete platform')
        }
      } catch (error) {
        console.error('Error deleting platform:', error)
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="clay-element bg-gradient-to-br from-gray-400 to-gray-600 p-3">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Platform Settings</h1>
              <p className="text-gray-600 font-medium">Manage your connected platforms and configurations</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Platform
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="clay-element bg-white/40 p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded w-full"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {platforms.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No platforms configured yet</p>
                <p className="text-sm">Add your first platform to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AddPlatformModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
        }}
        onSave={handleAddPlatform}
      />
    </Layout>
  )
}
