'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Crown, 
  ArrowLeft,
  Calendar,
  CreditCard,
  PieChart,
  History,
  Info,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { AdminDashboardService } from '@/app/services/admin-dashboard.service'

interface Transaction {
  id: string
  source: string
  from: string
  amount: number
  platformCut: number // percentage
  platformEarnings: number
  type: 'chapter_purchase' | 'premium_subscription' | 'donation' | 'ad'
  date: string
}

export default function RevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'this_week' | 'this_month' | 'this_year' | 'all'>('today')
  const [revenueData, setRevenueData] = useState<Record<string, Transaction[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true)
        const data = await AdminDashboardService.getRevenue()
        setRevenueData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch revenue:', err)
        setError('Failed to load revenue data')
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  const periods = [
    { id: 'today', label: 'Today', icon: DollarSign },
    { id: 'this_week', label: 'This Week', icon: Calendar },
    { id: 'this_month', label: 'This Month', icon: CreditCard },
    { id: 'this_year', label: 'This Year', icon: PieChart },
    { id: 'all', label: 'All Time', icon: History },
  ]

  const transactions = revenueData[selectedPeriod] || []
  
  const calculateTotalForPeriod = (periodId: string) => {
    const txs = revenueData[periodId] || []
    return txs.reduce((sum, t) => sum + t.amount, 0)
  }

  const totalEarnings = transactions.reduce((acc, curr) => acc + curr.platformEarnings, 0)
  const premiumEarnings = transactions
    .filter(t => t.type === 'premium_subscription' || t.type === 'premium')
    .reduce((acc, curr) => acc + curr.platformEarnings, 0)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-neutral-500 font-medium">Loading financial data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-neutral-950">
        <div className="text-center">
          <p className="text-red-500 font-bold text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-primary px-6 py-2 text-white font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-950 p-6 lg:p-10 transition-colors duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link 
            href="/admin" 
            className="group mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            Monitor and analyze platform financial growth and distribution.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 p-2 shadow-sm border dark:border-neutral-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <div className="pr-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Current Share</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">Platform Cut: 15-20%</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 flex flex-wrap gap-4 lg:flex-nowrap">
        {periods.map((period) => {
          const Icon = period.icon
          const isActive = selectedPeriod === period.id
          const totalAmount = calculateTotalForPeriod(period.id)
          return (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              className={cn(
                "group relative flex flex-1 items-center gap-4 rounded-2xl border p-4 transition-all duration-300 min-w-[180px]",
                isActive 
                  ? "border-primary bg-white dark:bg-neutral-900 shadow-lg shadow-primary/5 scale-[1.02] z-10" 
                  : "border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                isActive ? "bg-primary text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate">
                  {period.label}
                </p>
                <p className={cn(
                  "mt-0.5 text-lg font-black tracking-tight transition-colors duration-300 truncate",
                  isActive ? "text-primary dark:text-white" : "text-neutral-900 dark:text-neutral-200"
                )}>
                  ETB {totalAmount.toLocaleString()}
                </p>
              </div>
              
              {isActive && (
                <div className="absolute bottom-0 left-4 right-4 h-1 rounded-t-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Details Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <div className="border-b dark:border-neutral-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    <History className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Transaction History</h3>
                </div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest text-neutral-400">
                  {selectedPeriod.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    <th className="px-6 py-4">Source & From</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Platform Cut</th>
                    <th className="px-6 py-4">Our Earnings</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-neutral-800">
                  {transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-900 dark:text-white">{t.source}</span>
                          <span className="text-sm text-neutral-500">@{t.from}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-semibold text-neutral-700 dark:text-neutral-300">
                        ETB {t.amount}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                          {t.platformCut}%
                        </span>
                      </td>
                      <td className="px-6 py-5 font-bold text-primary">
                        +ETB {t.platformEarnings}
                      </td>
                      <td className="px-6 py-5 text-right text-xs text-neutral-400">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-neutral-500">
                        No transactions found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Breakdown Summary */}
        <div className="space-y-6">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-neutral-900 dark:text-white">Revenue Breakdown</h3>
            
            <div className="space-y-6">
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 p-5 border border-dashed dark:border-neutral-700">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Net Earning</p>
                <p className="text-3xl font-black text-primary tracking-tight">ETB {totalEarnings.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Premium Subs</span>
                  </div>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">ETB {premiumEarnings.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${totalEarnings > 0 ? (premiumEarnings / totalEarnings) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Other Purchases</span>
                  </div>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">ETB {(totalEarnings - premiumEarnings).toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${totalEarnings > 0 ? ((totalEarnings - premiumEarnings) / totalEarnings) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t dark:border-neutral-800">
                <div className="flex items-center gap-3 rounded-2xl bg-primary/5 p-4 border border-primary/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">Premium Highlight</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Premium users contribute {totalEarnings > 0 ? Math.round((premiumEarnings / totalEarnings) * 100) : 0}% of your current revenue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group border-primary/20 bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-lg shadow-primary/20 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-bold">Growth Insight</h3>
              <p className="mt-2 text-sm text-white/80">
                Financial performance is being pulled directly from live transactions.
              </p>
              <button className="mt-4 rounded-xl bg-white/20 px-4 py-2 text-xs font-bold transition-colors hover:bg-white/30 backdrop-blur-md">
                Live Data Connected
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
          </Card>
        </div>
      </div>
    </div>
  )
}
