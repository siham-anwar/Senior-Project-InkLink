'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowRight } from 'lucide-react'

export default function FailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          Story not published
        </h1>
        <p className="mt-3 text-muted-foreground">
          Unfortunately, your story could not be published at this time. Please try again later.
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
