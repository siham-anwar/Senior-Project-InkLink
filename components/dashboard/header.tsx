'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <h1 className="text-xl font-semibold text-primary">InkLink</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button asChild>
          <Link href="/editor">
            <Plus className="mr-2 h-4 w-4" />
            New
          </Link>
        </Button>
      </div>
    </header>
  )
}
