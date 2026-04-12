'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowRight } from 'lucide-react'

export default function WarningPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/20">
          <AlertTriangle className="h-10 w-10 text-warning" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          Needs further inspection
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your story has been submitted but requires additional review before it can be published.
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
