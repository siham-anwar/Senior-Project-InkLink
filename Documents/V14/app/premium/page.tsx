'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { PRICING_PLANS } from '@/config/pricing'

export default function PremiumPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly' | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContinue = () => {
    if (mounted && selectedPlan) {
      router.push(`/premium/checkout?plan=${selectedPlan}`)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Link href="/home" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Premium Membership</h1>
              <p className="text-muted-foreground">Unlock unlimited access and support your favorite authors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Go Ad-Free</h2>
          <p className="text-lg text-muted-foreground">Remove all ads and enjoy uninterrupted reading</p>
          <p className="text-sm text-muted-foreground">Cancel anytime, no commitment required</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 transition-all cursor-pointer p-6 flex flex-col ${
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              } ${plan.popular ? 'md:scale-105' : ''}`}
              onClick={() => setSelectedPlan(plan.id as 'weekly' | 'monthly' | 'yearly')}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.currency}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.period}</p>
                {plan.savings && (
                  <p className="text-sm text-primary font-medium mt-2">{plan.savings}</p>
                )}
              </div>

              {/* Features List */}
              <div className="flex-1 mb-6">
                <div className="flex items-center gap-3">
                  <Check size={18} className="text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">Ad-Free Reading</span>
                </div>
              </div>

              {/* Select Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedPlan && (
          <div className="flex justify-center mb-12">
            <Link
              href={`/premium/checkout?plan=${selectedPlan}`}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue to Checkout
            </Link>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Can I cancel my subscription?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! Cancel anytime from your account settings. No questions asked.
              </p>
            </div>
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Will I get a refund?</h4>
              <p className="text-sm text-muted-foreground">
                No refunds are issued for used portions of billing periods, but you can continue to use your premium benefits until the end of your current billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
