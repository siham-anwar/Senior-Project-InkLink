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

  const getStatusBadge = () => {
    switch (work.status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Published</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Rejected</Badge>
      case 'needs_admin_review':
      case 'pending_moderation':
        return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Waiting Approval</Badge>
      case 'approved':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Approved</Badge>
      default:
        return <Badge variant="secondary">Draft</Badge>
    }
  }

  return (
    <Card className="group flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Cover Image */}
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {work.coverImage ? (
          <img
            src={work.coverImage}
            alt={`Cover of ${work.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <BookOpen className="h-10 w-10 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>
      
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="line-clamp-1 text-lg font-bold tracking-tight text-foreground">
            {work.title}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{chapterCount}</span>
          </div>
        </div>
        {work.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">{work.summary}</p>
        )}
      </CardHeader>

      <CardContent className="px-5 py-2">
        <div className="flex flex-wrap gap-1.5">
          {work.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-accent/50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-accent-foreground">
              {tag}
            </span>
          ))}
          {work.tags?.length > 3 && (
            <span className="text-[10px] font-medium text-muted-foreground self-center">+{work.tags.length - 3} more</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex gap-2 p-5 pt-4">
        <Button asChild variant="secondary" className="h-9 flex-1 font-semibold transition-all hover:bg-primary hover:text-white">
          <Link href={`/editor?id=${work.id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(work.id)}
        >
          <Trash2 className="h-4.5 w-4.5" />
          <span className="sr-only">Delete work</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
