'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RefreshCw, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clay-element glass-effect p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="clay-element bg-gradient-to-br from-purple-400 to-blue-500 p-4 w-16 h-16 rounded-full mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">ContentSync</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="clay-element bg-red-50 border border-red-200 p-4 rounded-lg"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="clay-element bg-white pl-10 pr-4 py-3 w-full rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="clay-element bg-white pl-10 pr-12 py-3 w-full rounded-lg border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white w-full py-3 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-600 hover:text-purple-700 font-medium ml-1"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Demo Account</h3>
          <p className="text-sm text-gray-600 mb-2">
            You can use any email and password to create an account for testing.
          </p>
          <p className="text-xs text-gray-500">
            This is a demo application - no real authentication is required.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 