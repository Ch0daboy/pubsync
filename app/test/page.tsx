import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎉 ContentSync Test Page
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this page, the basic Next.js app is working correctly!
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✅ Next.js routing working</p>
          <p>✅ Tailwind CSS loading</p>
          <p>✅ Build successful</p>
          <p>✅ Deployment successful</p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-600">
            <strong>Debug Info:</strong><br/>
            Environment: {process.env.NODE_ENV}<br/>
            Timestamp: {new Date().toISOString()}
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
