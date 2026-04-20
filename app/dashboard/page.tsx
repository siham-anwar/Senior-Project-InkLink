'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { WorksList } from '@/components/dashboard/works-list'
import { useWorksStore } from '@/app/store/worksStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { works, fetchWorks, deleteWork, isLoading } = useWorksStore()

  useEffect(() => {
    fetchWorks()
  }, [fetchWorks])

  const handleDeleteWork = useCallback(async (workId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this work? This action cannot be undone.')
    if (!confirmed) return

    try {
      await deleteWork(workId)
      toast.success('Work deleted successfully')
    } catch (err) {
      toast.error('Failed to delete work')
    }
  }, [deleteWork])

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              Dashboard
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Manage your stories, view moderation status, and create new works.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Link href="/editor">
              <Plus className="mr-2 h-5 w-5" />
              Create New Work
            </Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search your works..." 
              className="pl-10 h-11 border-border/50 bg-card/30 backdrop-blur-sm"
            />
          </div>
          <Button variant="outline" className="h-11 border-border/50 bg-card/30 backdrop-blur-sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 w-full animate-pulse rounded-2xl bg-muted/50" />
              ))}
            </div>
          ) : (
            <WorksList works={works as any} onDeleteWork={handleDeleteWork} />
          )}
        </div>
      </main>
    </div>
  )
}
