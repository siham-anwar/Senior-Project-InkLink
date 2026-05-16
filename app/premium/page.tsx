'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { PRICING_PLANS } from '../config/pricing'
import { SubscriptionService } from '../services/subscription.service'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authstore'

export default function PremiumPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [plansLoading, setPlansLoading] = useState(true)
  const [pricingPlans, setPricingPlans] = useState<any[]>([])
  const { user } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    const fetchPlans = async () => {
      try {
        const plans = await SubscriptionService.getPlans()
        // Map backend plan structure to frontend UI needs
        const mappedPlans = plans.map(p => ({
          id: p.plan,
          name: p.plan.charAt(0).toUpperCase() + p.plan.slice(1),
          price: p.price,
          currency: p.currency,
          period: `per ${p.plan.replace('ly', '')}`,
          popular: p.plan === 'monthly',
          savings: p.plan === 'yearly' ? 'Best Value!' : undefined
        }))
        setPricingPlans(mappedPlans)
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error)
        // Fallback to empty or error state
      } finally {
        setPlansLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleSubscribe = async () => {
    if (!selectedPlan) return
    if (!user) {
      toast.error('Please login to subscribe')
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    try {
      const returnUrl = window.location.origin + '/dashboard?tab=earnings'
      await SubscriptionService.subscribe(selectedPlan, returnUrl)
      // Redirect happens in the service
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment')
    } finally {
      setIsLoading(false)
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
        {plansLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Fetching best deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer p-6 flex flex-col ${plan.popular
                  ? 'border-primary bg-gradient-to-b from-primary/10 via-primary/5 to-transparent shadow-[0_0_40px_-8px] shadow-primary/30 md:scale-105 z-10 ring-1 ring-primary/20'
                  : ''
                  } ${selectedPlan === plan.id
                    ? 'border-primary bg-primary/5'
                    : plan.popular
                      ? ''
                      : 'border-border hover:border-primary/50'
                  }`}
                onClick={() => setSelectedPlan(plan.id as 'weekly' | 'monthly' | 'yearly')}
              >

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-primary' : ''}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-4xl font-black ${plan.popular ? 'text-primary' : ''}`}>{plan.price}</span>
                    <span className="text-muted-foreground">{plan.currency}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.period}</p>
                  {plan.savings && (
                    <p className="text-sm text-primary font-bold mt-2">{plan.savings}</p>
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
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${selectedPlan === plan.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                >
                  {selectedPlan === plan.id ? '✓ Selected' : plan.popular ? 'Get Started' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Continue Button */}
        {selectedPlan && (
          <div className="flex justify-center mb-12">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Initializing...' : 'Continue to Checkout'}
            </button>
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
