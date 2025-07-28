'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('HomePage useEffect:', { user: !!user, loading })
    if (!loading && !user) {
      console.log('Redirecting to auth...')
      router.push('/auth')
    }
  }, [user, loading, router])

  console.log('HomePage render:', { user: !!user, loading })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ContentSync...</p>
          <p className="text-xs text-gray-400 mt-2">Debug: Loading state</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">No user found, redirecting...</p>
          <p className="text-xs text-gray-400 mt-2">Debug: No user state</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}