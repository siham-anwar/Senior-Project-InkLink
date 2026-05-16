
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Crown, 
  ShieldAlert, 
  Users, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminOverviewDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

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
      color: 'bg-blue-500',
    },
    {
      title: 'Authors',
      value: overview.authors.toLocaleString(),
      description: 'Registered authors',
      icon: BookOpen,
      href: '/admin/authors',
      color: 'bg-emerald-500',
    },
    {
      title: 'Content',
      value: overview.content.toLocaleString(),
      description: 'Managed chapters',
      icon: ShieldAlert,
      href: '/admin/content',
      color: 'bg-amber-500',
    },
    {
      title: 'Premium Subscription',
      value: overview.premiumSubscriptions.toLocaleString(),
      description: 'Active premium users',
      icon: Crown,
      href: '/admin/premium',
      color: 'bg-rose-500',
    },
  ]

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">InkLink Admin</h1>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Dashboard Overview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-lg text-neutral-500 dark:text-neutral-400">Monitor platform performance and key metrics at a glance.</p>
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-none dark:hover:border-primary/50"
              >
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className={cn("w-fit rounded-2xl p-3 text-white shadow-lg transition-transform group-hover:scale-110", stat.color)}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title & Value */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{stat.description}</p>
                    <ArrowUpRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Health Metrics */}
        <div className="space-y-6">
          <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">System Health</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Platform Health */}
            <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Security Health</p>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-4">
                  <span className="text-5xl font-black tracking-tight text-primary">
                    {overview.platformHealth}%
                  </span>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${overview.platformHealth}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Server Status */}
            <Card className="p-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Server Status</p>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-2xl font-black capitalize text-neutral-900 dark:text-white">
                      {overview.serverStatus}
                    </span>
                    <p className="text-xs font-medium text-neutral-500 uppercase">Latency: 24ms</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Live Updates */}
            <Card className="p-6 border-primary/20 bg-primary/5 dark:bg-primary/10 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Live Engine</p>
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">Synchronized</p>
                  <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">Real-time data stream active</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
