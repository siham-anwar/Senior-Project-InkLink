'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

function SuccessContent() {
  const searchParams = useSearchParams()
  const authorUsername = searchParams.get('author') || 'the Author'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20"
          >
            <CheckCircle2 size={48} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-green-500/20 rounded-full -z-10"
          />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
        >
          Donation Successful!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-lg mb-10"
        >
          Thank you so much! Your support means the world to <span className="text-foreground font-bold">@{authorUsername}</span> and helps them keep writing.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4"
        >
          <Link
            href="/home"
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Back to Home Feed
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest">
            <Sparkles size={14} className="text-amber-500" />
            InkLink Community
            <Heart size={14} className="text-primary fill-current" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
