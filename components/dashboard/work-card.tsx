'use client'

import Link from 'next/link'
import { Work } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, BookOpen, Trash2 } from 'lucide-react'

interface WorkCardProps {
  work: Work
  onDelete: (workId: string) => void
}

export function WorkCard({ work, onDelete }: WorkCardProps) {
  const chapterCount = work.chapters?.length || 0

  return (
    <Card className="group flex flex-col overflow-hidden bg-card transition-colors hover:border-primary">
      {/* Cover Image */}
      {work.coverImage && (
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={work.coverImage}
            alt={`Cover of ${work.title}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className={work.coverImage ? 'pt-3' : ''}>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-lg font-medium text-foreground">
            {work.title}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>
              {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
            </span>
          </div>
        </div>
        {work.summary && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{work.summary}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/editor?id=${work.id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(work.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete work</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
