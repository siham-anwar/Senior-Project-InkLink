'use client'

import { Chapter } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Plus, FileText, ChevronRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChapterListProps {
  chapters: Chapter[]
  selectedChapterId: string | null
  onSelectChapter: (chapterId: string) => void
  onAddChapter: () => void
  onDeleteChapter: (chapterId: string) => void
}

export function ChapterList({
  chapters,
  selectedChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
}: ChapterListProps) {
  const getChapterId = (chapter: Chapter) => chapter.id || chapter._id || ''

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Chapters</span>
        <Button variant="ghost" size="sm" onClick={onAddChapter} className="h-8 px-2">
          <Plus className="mr-1 h-4 w-4" />
          Add Chapter
        </Button>
      </div>
      
      <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-2">
        {chapters.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No chapters yet. Add your first chapter to get started.
          </p>
        ) : (
          chapters.map((chapter, index) => (
            <div
              key={getChapterId(chapter)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
                selectedChapterId === getChapterId(chapter)
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <button
                onClick={() => onSelectChapter(getChapterId(chapter))}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    Chapter {index + 1}: {chapter.title || 'Untitled'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(chapter.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChapter(getChapterId(chapter))
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete chapter</span>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
