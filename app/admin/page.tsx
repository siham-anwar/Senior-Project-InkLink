
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
  const [overview, setOverview] = useState<AdminOverviewDto>(defaultOverview)
  const [error, setError] = useState<string | null>(null)

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
      href: '/admin/users',
    },
    {
      title: 'Authors',
      value: overview.authors.toLocaleString(),
      description: 'Registered authors',
      icon: BookOpen,
      href: '/admin/authors',
    },
    {
      title: 'Content',
      value: overview.content.toLocaleString(),
      description: 'Managed chapters',
      icon: ShieldAlert,
      href: '/admin/content',
    },
    {
      title: 'Premium Subscription',
      value: overview.premiumSubscriptions.toLocaleString(),
      description: 'Monetized authors',
      icon: Crown,
      href: '/admin/premium',
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b" style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff' }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#8b0000' }}>
              <span className="text-xl font-bold text-white">i</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0a0a0a' }}>InkLink Admin</h1>
              <p className="text-xs mt-0.5" style={{ color: '#525252' }}>Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12 space-y-3">
          <h2 className="text-4xl font-bold" style={{ color: '#0a0a0a' }}>Dashboard</h2>
          <p className="text-base" style={{ color: '#525252' }}>Monitor platform performance and metrics</p>
          {error && (
            <div className="mt-4 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: '#e5e5e5', backgroundColor: '#fafafa', color: '#8b0000' }}>
              {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group relative overflow-hidden rounded-lg border transition-all duration-300 p-6 hover:shadow-md"
                style={{
                  backgroundColor: '#fafafa',
                  borderColor: '#e5e5e5'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8b0000'
                  e.currentTarget.style.backgroundColor = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                  e.currentTarget.style.backgroundColor = '#fafafa'
                }}
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-fit rounded-lg p-3 transition-all" style={{ backgroundColor: '#8b0000' }}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Title & Value */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#525252' }}>
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#0a0a0a' }}>
                      {stat.value}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t" style={{ borderColor: '#e5e5e5' }}>
                    <p className="text-xs" style={{ color: '#525252' }}>{stat.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Health Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: '#0a0a0a' }}>System Health</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Platform Health */}
            <div className="rounded-lg border p-6 transition-all hover:shadow-md" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#525252' }}>Platform Health</p>
                <div className="space-y-3">
                  <span className="text-4xl font-bold" style={{ color: '#8b0000' }}>
                    {overview.platformHealth}%
                  </span>
                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${overview.platformHealth}%`, backgroundColor: '#8b0000' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Server Status */}
            <div className="rounded-lg border p-6 transition-all hover:shadow-md" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#525252' }}>Server Status</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-2xl font-bold capitalize" style={{ color: '#0a0a0a' }}>
                    {overview.serverStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Updates */}
            <div className="rounded-lg border p-6 transition-all hover:shadow-md" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#525252' }}>Real-Time Updates</p>
                <div className="mt-3 space-y-2">
                  <p className="text-2xl font-bold" style={{ color: '#0a0a0a' }}>Live</p>
                  <p className="text-xs" style={{ color: '#525252' }}>Always refreshing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
