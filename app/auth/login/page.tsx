'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.isLoading)

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const data = await login(email, password)
      const userRole = data.user?.role
      
      if (userRole === 'admin' || email === 'admin@gmail.com') {
        router.push('/admin')
      } else if (userRole === 'child') {
        router.push('/children')
      } else {
        router.push('/home')
      }
    } catch (err) {
      setError(extractApiErrorMessage(err, 'Invalid email or password'))
    }
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-lg border border-border">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">InkLink</h1>
        <p className="text-muted-foreground">Welcome back to your reading sanctuary</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your_email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-input border-border"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88 4.62 4.62" />
                  <path d="M7.71 15.65a9 9 0 0 1-4.71-3.65 9 9 0 0 1 15.34-3.5" />
                  <path d="M10.47 10.47a3 3 0 0 0 4.06 4.06" />
                  <path d="M17.47 17.47a9 9 0 0 1-14.94 0" />
                  <path d="M21 21l-4.48-4.48" />
                  <path d="M1 1l22 22" />
                  <path d="M21.22 12.01A9 9 0 0 1 12 21a9 9 0 0 1-2.02-.23" />
                  <path d="M15 15a3 3 0 0 1-4.24-4.24" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary/90 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Link href="/" className="text-sm text-primary hover:text-primary/90 flex items-center gap-2">
          ← Back to Home
        </Link>
      </div>
    </Card>
  )
}
