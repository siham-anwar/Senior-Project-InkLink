'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          Story has been published
        </h1>
        <p className="mt-3 text-muted-foreground">
          Congratulations! Your story is now live and available for readers to enjoy.
        </p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">
            Return to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
