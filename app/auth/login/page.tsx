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
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-input border-border"
          />
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
