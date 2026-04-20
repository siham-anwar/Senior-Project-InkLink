'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react'
import { PRICING_PLANS } from '../../config/pricing'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  
  const plan = PRICING_PLANS.find(p => p.id === planId)
  const [bankAccount, setBankAccount] = useState('')
  const [pin, setPin] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirmPayment = async () => {
    if (!bankAccount || !pin || bankAccount.length !== 13 || pin.length !== 4) {
      alert('Please fill in all fields correctly. Bank account must be 13 digits and PIN must be 4 digits.')
      return
    }

    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)
    }, 1500)
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <Link href="/premium" className="text-primary hover:underline">
            Back to Premium
          </Link>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={64} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-2">Your {plan.name} subscription is now active.</p>
          <p className="text-sm text-muted-foreground mb-6">You will be charged {plan.price} {plan.currency} {plan.period}</p>
          <div className="bg-secondary/50 border border-border rounded-lg p-4 mb-6">
            <p className="text-sm font-medium mb-2">Transaction Details</p>
            <p className="text-xs text-muted-foreground mb-1">Bank Account: ****{bankAccount.slice(-4)}</p>
            <p className="text-xs text-muted-foreground">Amount: {plan.price} {plan.currency}</p>
            <p className="text-xs text-muted-foreground mt-2">Transaction ID: TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <div className="space-y-3">
            <Link href="/home" className="block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Back to Home
            </Link>
            <Link href="/profile" className="block px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/premium" className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        {/* Order Summary */}
        <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 pb-4 border-b border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{plan.name} Plan</span>
              <span className="font-semibold">{plan.price} {plan.currency}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Billing Period</span>
              <span>{plan.period}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{plan.price} {plan.currency}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bank Account Number</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, '').slice(0, 13))}
              placeholder="0000000000000"
              maxLength={13}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">13-digit account number</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="px-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm font-medium">
              {plan.price} {plan.currency}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Auto-filled based on selected plan</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PIN</label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">4-digit PIN required</p>
          </div>

          <button
            onClick={handleConfirmPayment}
            disabled={loading || !bankAccount || !pin || bankAccount.length !== 13 || pin.length !== 4}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            This is a payment simulation. No actual charges will be made.
          </p>
        </div>
      </div>
    </div>
  )
}
