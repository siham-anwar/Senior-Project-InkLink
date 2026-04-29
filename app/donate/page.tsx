'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Check } from 'lucide-react'

import { SubscriptionService } from '@/app/services/subscription.service'
import { toast } from 'sonner'

function DonateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authorId = searchParams.get('author') || ''
  const authorUsername = searchParams.get('username') || 'Author'
  
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleConfirmPayment = async () => {
    if (!authorId || authorId === 'undefined') {
      toast.error('Recipient author not specified. Please go back to the book page.')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please provide a valid positive donation amount.')
      return
    }

    setLoading(true)
    try {
      const returnUrl = window.location.origin + `/donate/success?author=${authorUsername}`
      await SubscriptionService.donate(authorId, parseFloat(amount), returnUrl)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Donation initialization failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={20} />
          Back
        </Link>

        <div className="bg-secondary/30 border border-border rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Support an Author</h1>
          <p className="text-muted-foreground">Donate to {authorUsername} using Chapa securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/30 border border-border rounded-lg p-6 sticky top-8">
              <h2 className="font-bold text-lg mb-4">Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium">{authorUsername}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Donation Amount</span>
                    <span className="text-2xl font-bold">{amount || '0'} ETB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-secondary/30 border border-border rounded-lg p-8">
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Donation Amount (ETB)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setAmount(val);
                        }
                      }}
                      placeholder="Enter amount (e.g. 50)"
                      className="w-full pl-4 pr-12 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">ETB</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Minimum 1 ETB</p>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={loading || !amount || parseFloat(amount) <= 0}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
                >
                  {loading ? 'Initializing...' : (
                    <>
                      <Lock size={16} />
                      Donate with Chapa
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  You will be redirected to Chapa's secure payment page
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DonateContent />
    </Suspense>
  )
}
