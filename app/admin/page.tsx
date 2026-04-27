'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Crown, ShieldAlert, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminOverviewDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'

const defaultOverview: AdminOverviewDto = {
  users: 0,
  authors: 0,
  content: 0,
  premiumSubscriptions: 0,
  platformHealth: 98.5,
  serverStatus: 'operational',
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession)
  const [overview, setOverview] = useState<AdminOverviewDto>(defaultOverview)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void bootstrapSession()
  }, [bootstrapSession])

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [router, user])

  useEffect(() => {
    if (user?.role !== 'admin') return

    const run = async () => {
      try {
        setError(null)
        setOverview(await AdminDashboardService.getOverview())
      } catch (e) {
        setError(extractApiErrorMessage(e, 'Failed to load admin overview'))
      }
    }

    void run()
  }, [user?.role])

  if (!user || user.role !== 'admin') return null

  const stats = [
    {
      title: 'Users',
      value: overview.users.toLocaleString(),
      description: 'Active users on platform',
      icon: Users,
      color: 'from-pink-500 to-red-500',
      href: '/admin/users',
    },
    {
      title: 'Authors',
      value: overview.authors.toLocaleString(),
      description: 'Registered authors',
      icon: BookOpen,
      color: 'from-red-500 to-pink-600',
      href: '/admin/authors',
    },
    {
      title: 'Content',
      value: overview.content.toLocaleString(),
      description: 'Managed chapters',
      icon: ShieldAlert,
      color: 'from-pink-600 to-red-600',
      href: '/admin/content',
    },
    {
      title: 'Premium Subscription',
      value: overview.premiumSubscriptions.toLocaleString(),
      description: 'Monetized authors',
      icon: Crown,
      color: 'from-red-600 to-pink-500',
      href: '/admin/premium',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-red-600">
              <span className="text-lg font-bold text-white">i</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">InkLink</h1>
          </div>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h2 className="mb-2 text-3xl font-bold text-foreground">Welcome back, Admin</h2>
          <p className="text-base text-muted-foreground">
            Here&apos;s an overview of your InkLink platform
          </p>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="block cursor-pointer rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/70 hover:bg-secondary"
              >
                <div className="mb-4 flex items-center">
                  <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-border pt-8 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-1 text-sm text-muted-foreground">Platform Health</p>
            <p className="text-2xl font-bold text-foreground">{overview.platformHealth}%</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-1 text-sm text-muted-foreground">Last Updated</p>
            <p className="text-2xl font-bold text-foreground">Live</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-1 text-sm text-muted-foreground">Server Status</p>
            <p className="text-2xl font-bold text-accent">{overview.serverStatus}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
