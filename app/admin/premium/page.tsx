'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminPricingPlanDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'

type EditablePlan = AdminPricingPlanDto & { draftPrice: number }

export default function AdminPremiumPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [pricing, setPricing] = useState<EditablePlan[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle')
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
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
        <div className="w-full px-6 py-6">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition-colors hover:text-red-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-950">Premium Plans</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage subscription prices by billing period.
            </p>
            {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-700">
            Pricing Configuration
          </p>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Update the amount for each premium plan. Changes are saved to the admin pricing
            configuration used by the backend.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pricing.map((plan, index) => {
            const delta = plan.draftPrice - plan.price

            return (
              <div
                key={plan.id}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all hover:border-red-200 hover:bg-white hover:shadow-sm"
              >
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    {plan.period}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-neutral-950">{plan.name}</h3>
                </div>

                <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Current Price
                  </p>
                  <p className="mt-2 text-3xl font-bold text-red-700">
                    {plan.price.toFixed(2)}{' '}
                    <span className="text-base font-semibold text-neutral-600">{plan.currency}</span>
                  </p>
                </div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  New Price
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <span className="text-sm font-semibold text-red-700">{plan.currency}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={plan.draftPrice}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    className="w-full bg-transparent text-lg font-bold text-neutral-950 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
                  <p>
                    Billing period: <span className="font-semibold text-neutral-900">{plan.period}</span>
                  </p>
                  <p className="mt-2">
                    Price change:{' '}
                    <span
                      className={`font-semibold ${
                        delta === 0
                          ? 'text-neutral-900'
                          : delta > 0
                            ? 'text-red-700'
                            : 'text-emerald-700'
                      }`}
                    >
                      {delta > 0 ? '+' : ''}
                      {delta.toFixed(2)} {plan.currency}
                    </span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Check className="h-4 w-4" />
                Pricing updated successfully.
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-red-200 hover:bg-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                hasChanges && saveStatus !== 'saving'
                  ? 'bg-red-700 hover:bg-red-800'
                  : 'cursor-not-allowed bg-neutral-300'
              }`}
            >
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'success'
                  ? 'Saved'
                  : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
