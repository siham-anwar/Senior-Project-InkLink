'use client'

import { useEffect, useState, useCallback } from 'react'
import { DashboardHeader } from '@/components/dashboard/header'
import { WorksList } from '@/components/dashboard/works-list'
import { Work } from '@/lib/types'

export default function DashboardPage() {
  const [works, setWorks] = useState<Work[]>([])

  useEffect(() => {
    // Load works from localStorage on mount
    const savedWorks = localStorage.getItem('inklink-works')
    if (savedWorks) {
      try {
        const parsed = JSON.parse(savedWorks)
        // Convert date strings back to Date objects and ensure chapters array exists
        const worksWithDates = parsed.map((w: Work) => ({
          ...w,
          chapters: w.chapters || [],
          createdAt: new Date(w.createdAt),
          updatedAt: new Date(w.updatedAt),
        }))
        setWorks(worksWithDates)
      } catch (e) {
        console.error('Failed to parse saved works:', e)
      }
    }
  }, [])

  const handleDeleteWork = useCallback((workId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this work? This cannot be undone.')
    if (!confirmed) return

    setWorks((prev) => {
      const updated = prev.filter((w) => w.id !== workId)
      localStorage.setItem('inklink-works', JSON.stringify(updated))
      return updated
    })
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
        <WorksList works={works} onDeleteWork={handleDeleteWork} />
      </main>
    </div>
  )
}
