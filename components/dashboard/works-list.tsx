'use client'

import { Work } from '../../lib/types'
import { WorkCard } from './work-card'
import { EmptyState } from './empty-state'

interface WorksListProps {
  works: Work[]
  onDeleteWork: (workId: string) => void
}

export function WorksList({ works, onDeleteWork }: WorksListProps) {
  if (works.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} onDelete={onDeleteWork} />
      ))}
    </div>
  )
}
