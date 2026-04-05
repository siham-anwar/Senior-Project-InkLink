'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-medium text-foreground">No published works yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Start your writing journey by creating your first story. Your published works will appear here.
      </p>
      <Button asChild className="mt-6">
        <Link href="/editor">
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Story
        </Link>
      </Button>
    </div>
  )
}
