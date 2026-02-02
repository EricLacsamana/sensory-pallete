'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaLock, FaUser, FaArrowRight } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (username && password) {
        // Mock authentication
        router.push('/dashboard')
      } else {
        setError('Please enter both username and password')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-light to-primary flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-surface-lighter/80 to-surface/80 backdrop-blur-xl border border-accent/20 rounded-3xl p-8 shadow-2xl hover:shadow-glow-lg transition-all duration-500">
          
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-accent to-secondary rounded-2xl mb-4 shadow-glow">
              <FaLock className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sensory Palette</h1>
            <p className="text-muted text-sm">Educational Admin Dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm font-semibold animate-bounce-subtle">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-accent mb-2 block">Username</label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-4 text-accent/50 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 bg-surface/50 border-2 border-accent/20 rounded-xl text-white placeholder-muted/30 focus:border-accent focus:shadow-glow focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="text-sm font-semibold text-accent mb-2 block">Password</label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-accent/50 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-surface/50 border-2 border-accent/20 rounded-xl text-white placeholder-muted/30 focus:border-accent focus:shadow-glow focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 bg-gradient-to-r from-accent to-secondary text-white font-bold rounded-xl hover:shadow-glow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚡</span> Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted">
            <p>Demo credentials: Use any username/password to proceed</p>
          </div>
        </div>

        {/* Floating cards behind main card */}
        <div className="absolute -top-4 -right-4 w-full h-full border-2 border-accent/10 rounded-3xl -z-10 animate-pulse"></div>
        <div className="absolute -top-8 -right-8 w-full h-full border-2 border-secondary/10 rounded-3xl -z-20 animate-float"></div>
      </div>
    </div>
  )
}
