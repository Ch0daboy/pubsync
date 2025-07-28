'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AuthDebugPage() {
  const { user, loading, session } = useAuth()
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    const info = [
      `Loading: ${loading}`,
      `User exists: ${!!user}`,
      `User ID: ${user?.id || 'none'}`,
      `User email: ${user?.email || 'none'}`,
      `Session exists: ${!!session}`,
      `Environment check: ${typeof window !== 'undefined' ? 'Client' : 'Server'}`,
      `Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}`,
      `Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`,
    ]
    setDebugInfo(info)
  }, [user, loading, session])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🔍 Authentication Debug Page
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Current Auth State:</h2>
            <div className="space-y-1 text-sm">
              {debugInfo.map((info, index) => (
                <div key={index} className="font-mono text-blue-700">
                  {info}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">What should happen:</h2>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• If loading=true: Show loading spinner</li>
              <li>• If loading=false and no user: Redirect to /auth</li>
              <li>• If loading=false and user exists: Show dashboard</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Test Links:</h2>
            <div className="space-y-2">
              <Link href="/test" className="block text-green-700 hover:underline">
                → Test Page (Basic functionality)
              </Link>
              <Link href="/debug" className="block text-green-700 hover:underline">
                → Debug Page (Components without auth)
              </Link>
              <Link href="/auth" className="block text-green-700 hover:underline">
                → Auth Page (Login/Signup)
              </Link>
              <Link href="/" className="block text-green-700 hover:underline">
                → Home Page (The problematic one)
              </Link>
            </div>
          </div>

          {loading && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-purple-700">Authentication is loading...</span>
              </div>
            </div>
          )}

          {!loading && !user && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold">No user found</h3>
              <p className="text-red-700 text-sm">This would normally redirect to /auth</p>
            </div>
          )}

          {!loading && user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold">✅ User authenticated!</h3>
              <p className="text-green-700 text-sm">This would normally show the dashboard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
