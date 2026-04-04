'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/app/store/authstore'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const signup = useAuthStore((state) => state.signup)
  const loading = useAuthStore((state) => state.isLoading)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      await signup({ name, email, password })
      router.push('/home')
    } catch {
      setError('Unable to create account')
    }
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-lg border border-border">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Join InkLink</h1>
        <p className="text-muted-foreground">Start your reading and writing journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-input border-border"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-input border-border"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary/90 font-semibold">
            Login
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
