'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Edit3, Check } from 'lucide-react'
import { analyzePlatformUrl, PlatformInfo } from '@/lib/platform-analyzer'

interface AddPlatformModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (platform: PlatformInfo) => Promise<void>
}

const platformColors = {
  youtube: 'from-red-400 to-red-600',
  instagram: 'from-pink-400 to-purple-600',
  twitter: 'from-blue-400 to-blue-600',
  linkedin: 'from-blue-600 to-blue-800',
  tiktok: 'from-gray-800 to-gray-900',
  blog: 'from-green-400 to-green-600'
}

const platformNames = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  blog: 'Blog'
}

export default function AddPlatformModal({ isOpen, onClose, onSave }: AddPlatformModalProps) {
  const [url, setUrl] = useState('')
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl('')
      setPlatformInfo(null)
      setIsEditing(false)
      setEditedName('')
    }
  }, [isOpen])

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl)
    
    if (newUrl.trim()) {
      setIsAnalyzing(true)
      try {
        const analyzed = analyzePlatformUrl(newUrl)
        setPlatformInfo(analyzed)
        setEditedName(analyzed.name)
      } catch (error) {
        console.error('Error analyzing URL:', error)
      } finally {
        setIsAnalyzing(false)
      }
    } else {
      setPlatformInfo(null)
    }
  }

  const handleSave = async () => {
    if (!platformInfo) return
    
    setIsSaving(true)
    try {
      await onSave({
        ...platformInfo,
        name: editedName
      })
      onClose()
    } catch (error) {
      console.error('Error saving platform:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && platformInfo && !isEditing) {
      handleSave()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md clay-element bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Platform</h2>
              <button
                onClick={onClose}
                className="clay-button p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* URL Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://youtube.com/@channelname"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  autoFocus
                />
              </div>
            </div>

            {/* Analysis Loading */}
            {isAnalyzing && (
              <div className="mb-6 text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Analyzing platform...</p>
              </div>
            )}

            {/* Platform Preview */}
            {platformInfo && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-sm font-medium text-gray-700 mb-3">Platform Preview</h3>
                
                <div className="clay-element bg-white/60 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`clay-element bg-gradient-to-br ${platformColors[platformInfo.platform_type]} p-2 rounded-lg`}>
                      <div className="w-6 h-6 bg-white rounded text-center text-xs font-bold flex items-center justify-center">
                        {platformNames[platformInfo.platform_type].charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{editedName}</p>
                            <p className="text-sm text-gray-600">{platformNames[platformInfo.platform_type]}</p>
                          </div>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="clay-button p-1 rounded hover:bg-gray-100"
                          >
                            <Edit3 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 break-all">
                    {platformInfo.url}
                  </div>
                  
                  {isEditing && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setEditedName(platformInfo.name)
                          setIsEditing(false)
                        }}
                        className="clay-button bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="clay-button bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 clay-button bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!platformInfo || isSaving}
                className="flex-1 clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  'Add Platform'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 