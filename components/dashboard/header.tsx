'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/app/store/authstore'

export function DashboardHeader() {
  const role = useAuthStore((s) => s.user?.role)

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <h1 className="text-xl font-semibold text-primary">InkLink</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {role === 'admin' && (
          <Button variant="outline" asChild>
            <Link href="/admin/moderation">
              <Shield className="mr-2 h-4 w-4" />
              Moderation
            </Link>
          </Button>
        )}
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
