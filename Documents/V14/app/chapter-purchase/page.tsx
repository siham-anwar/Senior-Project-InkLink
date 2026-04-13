'use client'

import { use, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Check } from 'lucide-react'

function ChapterPurchaseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookId = searchParams.get('bookId') || ''
  const chapterId = searchParams.get('chapterId') || ''
  const price = searchParams.get('price') || '0'
  const chapterTitle = `Chapter ${chapterId}: The Lost Kingdom`
  
  const [bankAccount, setBankAccount] = useState('')
  const [amount, setAmount] = useState(price)
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState('')

  const handleConfirmPayment = async () => {
    if (!bankAccount || !amount || !pin || bankAccount.length !== 13 || pin.length !== 4) {
      alert('Please fill in all fields correctly. Bank account must be 13 digits, amount must be provided, and PIN must be 4 digits.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const id = `TXN-${Date.now()}`
      setTransactionId(id)
      setSuccess(true)
      setLoading(false)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-primary/10 border-2 border-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Purchase Successful!</h1>
          <p className="text-muted-foreground mb-6">You now have access to this chapter.</p>
          
          <div className="bg-secondary/50 border border-border rounded-lg p-6 mb-6 text-left space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Chapter</p>
              <p className="font-semibold">{chapterTitle}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Amount Paid</p>
              <p className="font-semibold">{amount} ETB</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{transactionId}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/home" className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
              Back to Books
            </Link>
            <button
              onClick={() => router.push(`/book/${bookId}/chapter/${chapterId}`)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Read Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={20} />
          Back
        </Link>

        <div className="bg-secondary/30 border border-border rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Purchase Chapter</h1>
          <p className="text-muted-foreground">Complete your payment to unlock this chapter</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/30 border border-border rounded-lg p-6 sticky top-8">
              <h2 className="font-bold text-lg mb-4">Chapter Details</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Chapter</span>
                  <span className="font-medium text-sm">{chapterTitle}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price</span>
                    <span className="text-2xl font-bold">{amount} ETB</span>
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
                {/* Bank Account */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    placeholder="0000000000000"
                    maxLength={13}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">13-digit account number required</p>
                </div>

                {/* Amount - Read Only */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Pay (ETB)</label>
                  <div className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground">
                    {amount} ETB
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Chapter purchase amount</p>
                </div>

                {/* PIN */}
                <div>
                  <label className="block text-sm font-medium mb-2">PIN</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="0000"
                      maxLength={4}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">4-digit PIN required</p>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmPayment}
                  disabled={loading || !bankAccount || !pin || bankAccount.length !== 13 || pin.length !== 4}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Complete Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChapterPurchasePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ChapterPurchaseContent />
    </Suspense>
  )
}
