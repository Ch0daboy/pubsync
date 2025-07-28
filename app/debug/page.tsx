'use client'

import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔧 Debug Page - No Auth Required
          </h1>
          <p className="text-gray-600 mb-4">
            This page tests the Layout and Dashboard components without authentication.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This bypasses authentication for testing purposes.
              The Dashboard component may show errors if it tries to fetch user-specific data.
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Testing Layout Component:</h2>
          <p className="text-red-700 text-sm">If you see a navigation sidebar, the Layout component is working.</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Testing Dashboard Component:</h2>
          <p className="text-blue-700 text-sm">If you see dashboard cards below, the Dashboard component is working.</p>
        </div>
      </div>
      
      {/* Test Layout Component */}
      <Layout>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Layout Component Loaded</h2>
          <p className="text-green-700 text-sm">The Layout component is working if you can see this message with navigation.</p>
        </div>
        
        {/* Test Dashboard Component */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">Testing Dashboard Component:</h2>
          <p className="text-purple-700 text-sm">Dashboard component will load below (may show errors without auth):</p>
        </div>
        
        <Dashboard />
      </Layout>
    </div>
  )
}
