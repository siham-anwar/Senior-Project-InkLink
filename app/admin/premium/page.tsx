'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, RotateCcw, Loader2, Users, Calendar, Crown, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminPricingPlanDto, type AdminSubscriptionDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/card'

type EditablePlan = AdminPricingPlanDto & { draftPrice: number }

export default function AdminPremiumPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [pricing, setPricing] = useState<EditablePlan[]>([])
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionDto[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle')
  const [loadingSubs, setLoadingSubs] = useState(true)
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
        setLoadingSubs(true)
        const [plans, subs] = await Promise.all([
          AdminDashboardService.getPricing(),
          AdminDashboardService.getSubscriptions()
        ])
        setPricing(plans.map((plan) => ({ ...plan, draftPrice: plan.price })))
        setSubscriptions(subs)
      } catch (e) {
        setError(extractApiErrorMessage(e, 'Failed to load premium data'))
      } finally {
        setLoadingSubs(false)
      }
    }

    void run()
  }, [user?.role])

  const handlePriceChange = (index: number, nextValue: string) => {
    setPricing((prev) =>
      prev.map((plan, i) =>
        i === index ? { ...plan, draftPrice: Number.parseFloat(nextValue) || 0 } : plan,
      ),
    )
  }

  const handleReset = () => {
    setPricing((prev) => prev.map((plan) => ({ ...plan, draftPrice: plan.price })))
    setSaveStatus('idle')
  }

  const handleSave = async () => {
    try {
      setSaveStatus('saving')
      const nextPlans = pricing.map(({ draftPrice, ...plan }) => ({
        ...plan,
        price: draftPrice,
      }))
      const updated = await AdminDashboardService.updatePricing(nextPlans)
      setPricing(updated.map((plan) => ({ ...plan, draftPrice: plan.price })))
      setSaveStatus('success')
      toast.success('Pricing updated successfully')
      window.setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (e) {
      setSaveStatus('idle')
      toast.error(extractApiErrorMessage(e, 'Failed to update pricing'))
    }
  }

  if (!user || user.role !== 'admin') return null

  const hasChanges = pricing.some((plan) => plan.price !== plan.draftPrice)

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="sticky top-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800">
        <div className="w-full px-6 py-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-primary transition-all hover:opacity-80"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-black uppercase tracking-widest">Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Premium Plans</h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Manage subscription tiers and pricing strategy.
            </p>
            {error && <p className="mt-2 text-sm font-bold text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        <div className="mb-12 rounded-[2rem] border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-none">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Dynamic Pricing Engine
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Adjust prices below. Changes will propagate instantly to the frontend `PremiumPage` once saved.
            These updates are persistent across sessions.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {pricing.map((plan, index) => {
            const delta = plan.draftPrice - plan.price

            return (
              <div
                key={plan.id}
                className="group relative overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white p-8 transition-all duration-300 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Tier: {plan.period}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-neutral-900 dark:text-white">{plan.name}</h3>
                </div>

                <div className="mb-8 rounded-[1.5rem] bg-neutral-50 p-6 dark:bg-neutral-950/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Current Active Rate
                  </p>
                  <p className="mt-2 text-4xl font-black text-primary">
                    {plan.price.toFixed(2)}{' '}
                    <span className="text-sm font-bold text-neutral-500">{plan.currency}</span>
                  </p>
                </div>

                <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Proposed New Rate
                </label>
                <div className="flex items-center gap-4 rounded-2xl border-2 border-neutral-100 bg-neutral-50 px-5 py-4 focus-within:border-primary focus-within:bg-white transition-all dark:border-neutral-800 dark:bg-neutral-950/50 dark:focus-within:bg-neutral-900">
                  <span className="font-black text-primary">{plan.currency}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={plan.draftPrice}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    className="w-full bg-transparent text-xl font-black text-neutral-900 dark:text-white outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-neutral-400">Net Adjustment</span>
                    <span
                      className={cn(
                        "font-black",
                        delta === 0
                          ? "text-neutral-400"
                          : delta > 0
                            ? "text-red-500"
                            : "text-emerald-500"
                      )}
                    >
                      {delta > 0 ? '+' : ''}
                      {delta.toFixed(2)} {plan.currency}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="sticky bottom-8 z-30 flex items-center justify-center">
           <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-600 transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={!hasChanges || saveStatus === 'saving'}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-primary/20",
                  hasChanges && saveStatus !== 'saving'
                    ? "bg-primary hover:scale-105 active:scale-95"
                    : "cursor-not-allowed bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-600"
                )}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Updated
                  </>
                ) : (
                  'Deploy Changes'
                )}
              </button>
           </div>
        </div>
      </div>

      <div className="w-full px-6 py-12 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white">Active Subscriptions</h2>
              <p className="text-sm font-medium text-neutral-500">Real-time view of all premium members.</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-primary">
              <Users className="h-4 w-4" />
              <span className="text-sm font-black">{subscriptions.length} Members</span>
            </div>
          </div>

          <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-200/40 dark:shadow-none rounded-[2rem]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    <th className="px-8 py-5">User Profile</th>
                    <th className="px-8 py-5">Tier</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Start Date</th>
                    <th className="px-8 py-5 text-right">Expiration</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-neutral-800">
                  {loadingSubs ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm font-bold text-neutral-400">Loading members...</p>
                        </div>
                      </td>
                    </tr>
                  ) : subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Crown className="h-12 w-12 text-neutral-200 dark:text-neutral-800" />
                          <p className="text-lg font-bold text-neutral-400">No active premium members yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => (
                      <tr key={sub.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary font-black">
                              {sub.username.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-neutral-900 dark:text-white">@{sub.username}</span>
                              <span className="text-xs text-neutral-500">{sub.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                            {sub.plan}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                            sub.status === 'active' 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                          )}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(sub.startDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-neutral-900 dark:text-white">
                              {new Date(sub.endDate).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                              {Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
