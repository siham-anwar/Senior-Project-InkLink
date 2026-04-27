'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  AdminDashboardService,
  type AdminPricingPlanDto,
} from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'

type EditablePlan = AdminPricingPlanDto & { draftPrice: number }

export default function AdminPremiumPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession)
  const [pricing, setPricing] = useState<EditablePlan[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle')
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
        const plans = await AdminDashboardService.getPricing()
        setPricing(plans.map((plan) => ({ ...plan, draftPrice: plan.price })))
      } catch (e) {
        setError(extractApiErrorMessage(e, 'Failed to load pricing'))
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
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="w-full max-w-full px-6 py-8">
          <div className="mb-4 flex items-center gap-4">
            <Link
              href="/admin"
              className="rounded-lg p-2 transition-colors hover:bg-secondary"
              title="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Premium Subscription</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage subscription pricing tiers
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <div className="w-full max-w-full px-6 py-12">
        <div className="max-w-4xl">
          <div className="mb-12 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              Subscription Pricing Configuration
            </h2>
            <p className="text-sm text-muted-foreground">
              Update the pricing for each subscription tier. Changes apply to new subscriptions.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricing.map((plan, index) => (
              <div key={plan.id} className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-6 text-xl font-bold text-foreground">{plan.name}</h3>

                <div className="mb-6">
                  <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                    Current Price
                  </label>
                  <p className="text-3xl font-bold text-accent">
                    {plan.price.toFixed(2)} {plan.currency}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                    New Price
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{plan.currency}</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={plan.draftPrice}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {plan.price !== plan.draftPrice && (
                  <div className="mb-6 rounded-lg border border-accent/30 bg-accent/10 p-3">
                    <p className="text-xs font-medium text-accent">
                      Change: {(plan.draftPrice - plan.price).toFixed(2)} {plan.currency}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-accent">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Pricing updated successfully!</span>
                </div>
              )}
            </div>
            <button
              onClick={() => void handleSave()}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`rounded-lg px-8 py-3 font-semibold transition-all ${
                saveStatus === 'saving'
                  ? 'cursor-not-allowed bg-accent/50 text-background'
                  : hasChanges
                    ? 'cursor-pointer bg-accent text-background hover:bg-accent/90'
                    : 'cursor-not-allowed bg-secondary text-muted-foreground opacity-50'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
