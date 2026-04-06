'use client'

import { useEffect, useCallback } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { WorksList } from '@/components/dashboard/works-list'
import { useWorksStore } from '@/app/store/worksStore'

export default function DashboardPage() {
  const { works, fetchWorks, isLoading } = useWorksStore()

  useEffect(() => {
    fetchWorks()
  }, [fetchWorks])

  const handleDeleteWork = useCallback((workId: string) => {
    // Note: Backend might not support deletion yet based on provided Swagger.
    // For now, we will just show a message or keep it as is if it's local only.
    // However, if the user really wants to delete, we'd need an endpoint.
    const confirmed = window.confirm('Are you sure you want to delete this work? (Local UI removal only as backend DELETE is missing from specs)')
    if (!confirmed) return

    // Since delete endpoint is missing, we just log it or handle it if implemented
    console.warn('Delete endpoint not found in Swagger specs')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Your Works</h2>
          <p className="mt-1 text-muted-foreground">
            Manage and edit your published stories
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20">Loading your works...</div>
        ) : (
          <WorksList works={works as any} onDeleteWork={handleDeleteWork} />
        )}
      </main>
    </div>
  )
}
