'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Share2, Flag, MoreVertical, Eye, BookOpen, ArrowLeft,
  Bookmark, Loader2, AlertCircle, Lock, Crown,
} from 'lucide-react'
import { EditorWorksService, WorkDto } from '@/app/services/editor-works.service'
import { libraryService, Library } from '@/app/services/library.service'
import { RatingsService, RatingResponse } from '@/app/services/ratings.service'
import { ChatService } from '@/app/services/chat.service'
import { ProfileService } from '@/app/services/profile.service'
import { StarRating } from '@/components/star-rating'
import { useAuthStore } from '@/app/store/authstore'
import { toast } from 'sonner'
import { MessageSquare, UserPlus } from 'lucide-react'

// ─── helpers ────────────────────────────────────────────────────────────────

function pluralise(n: number, word: string) {
  return `${n} ${word}${n !== 1 ? 's' : ''}`
}

// ─── component ──────────────────────────────────────────────────────────────

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [work, setWork] = useState<WorkDto | null>(null)
  const [library, setLibrary] = useState<Library | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'parts'>('summary')
  const [showMenu, setShowMenu] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [ratingData, setRatingData] = useState<RatingResponse | null>(null)
  const { user } = useAuthStore()

  // ── fetch work + library in parallel ──────────────────────────────────────

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [workData, lib, rating] = await Promise.all([
        EditorWorksService.getById(id),
        libraryService.getLibrary().catch(() => null),       // non-critical
        RatingsService.getWorkRating(id, user?.sub || user?.id || user?._id).catch(() => null),
      ])
      setWork(workData)
      setLibrary(lib)
      setRatingData(rating)

      try {
        await libraryService.updateProgress(id, 0);
      } catch (e) {
        // silently ignore
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load book')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  // ── derived state ──────────────────────────────────────────────────────────

  const isBookmarked = library?.bookmarked?.some(
    (b: any) => (b._id ?? b) === id
  ) ?? false

  const chapters: any[] = work?.chapters ?? []
  const firstChapterId = chapters[0]?.id ?? chapters[0]?._id

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (bookmarkLoading) return
    try {
      setBookmarkLoading(true)
      const updatedLib = await libraryService.toggleBookmark(id)
      setLibrary(updatedLib)
    } catch {
      // silently ignore
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handleMessageAuthor = async () => {
    if (!user) {
      toast.error('Please log in to message the author')
      router.push('/auth/login')
      return
    }

    const authorId = (work as any).authorId
    if (!authorId) {
      toast.error('Author information not available')
      return
    }

    if (authorId === (user.sub || user.id || user._id)) {
      toast.error("You can't message yourself")
      return
    }

    try {
      const room = await ChatService.getOrCreateDirectRoom(authorId)
      router.push(`/dashboard?tab=dm&roomId=${room._id || room.id}`)
    } catch (error) {
      console.error('Failed to initiate chat:', error)
      toast.error('Failed to start conversation')
    }
  }

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please log in to follow authors')
      router.push('/auth/login')
      return
    }

    const authorId = (work as any).authorId
    if (!authorId) return

    if (authorId === (user.sub || user.id || user._id)) {
      toast.error("You can't follow yourself")
      return
    }

    try {
      await ProfileService.followUser(authorId)
      toast.success('Following author')
    } catch (error) {
      console.error('Follow failed:', error)
      toast.error('Failed to follow author')
    }
  }

  // ── loading / error states ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm">Loading book…</p>
        </div>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-lg font-semibold text-foreground">Could not load book</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-2 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const workId = work.id ?? (work as any)._id ?? id
  const authorUsername = (work as any).authorUsername ?? work.authorId ?? ''
  const coverImage = work.coverImage ?? 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=450&fit=crop'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>

            <Link href="/" className="text-2xl font-bold text-primary absolute left-1/2 -translate-x-1/2">
              InkLink
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMenu(v => !v)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); setShowMenu(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors text-foreground text-left"
                  >
                    <Share2 size={16} /> Share
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors text-foreground text-left">
                    <Flag size={16} /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Book Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          {/* Cover */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <img
              src={coverImage}
              alt={work.title}
              className="w-44 h-64 sm:w-48 sm:h-72 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">{work.title}</h1>

            {authorUsername && (
              <p className="text-muted-foreground text-sm mb-5">
                by{' '}
                <span className="font-medium text-foreground hover:text-primary transition-colors">
                  @{authorUsername}
                </span>
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-5 mb-5">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen size={16} />
                <span>{pluralise(chapters.length, 'chapter')}</span>
              </div>
              {work.tags && work.tags.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye size={16} />
                  <span>{work.tags.join(', ')}</span>
                </div>
              )}
              {ratingData && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <StarRating initialRating={Math.round(ratingData.averageRating)} readonly size={16} />
                    <span className="ml-1">{ratingData.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">({ratingData.ratingsCount} {pluralise(ratingData.ratingsCount, 'rating')})</span>
                </div>
              )}
            </div>

            {/* Status badge */}
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                work.status === 'published'
                  ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {work.status ?? 'draft'}
              </span>
              {work.childSafe && (
                <span className="ml-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  Child Safe
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {firstChapterId ? (
                <Link
                  href={`/book/${workId}/chapter/${firstChapterId}`}
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <BookOpen size={16} />
                  Start Reading
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed"
                >
                  No chapters yet
                </button>
              )}

              <button
                onClick={handleMessageAuthor}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
              >
                <MessageSquare size={16} />
                Message Author
              </button>

              <button
                onClick={handleFollow}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/20 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
              >
                <UserPlus size={16} />
                Follow
              </button>

              <button
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
                className={`p-2.5 rounded-lg border transition-all ${
                  isBookmarked
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {bookmarkLoading
                  ? <Loader2 size={20} className="animate-spin" />
                  : <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex gap-8 border-b border-border">
            {(['summary', 'parts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'parts' ? `Chapters (${chapters.length})` : 'Summary'}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                {work.tags && work.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Synopsis</h3>
                  <p className="text-foreground leading-relaxed">
                    {work.summary || 'No synopsis provided.'}
                  </p>
                </div>
              </div>
            )}

            {/* Chapters Tab */}
            {activeTab === 'parts' && (
              <div className="space-y-2">
                {chapters.length > 0 ? (
                  chapters.map((chapter, index) => {
                    const chapterId = chapter.id ?? chapter._id
                    const chapterPrice = chapter.price || 0
                    return (
                      <Link
                        key={chapterId}
                        href={`/book/${workId}/chapter/${chapterId}`}
                        className="flex items-center justify-between p-4 hover:bg-secondary transition-colors rounded-lg border border-border group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {chapter.title ?? `Chapter ${index + 1}`}
                            </h4>
                            {chapterPrice > 0 && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                                <Lock size={9} />
                                {chapterPrice} ETB
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {chapter.createdAt
                              ? new Date(chapter.createdAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })
                              : ''}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            chapter.moderationStatus === 'approved'
                              ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {chapter.moderationStatus ?? 'draft'}
                          </span>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                    <p>No chapters published yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} InkLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
