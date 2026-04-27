'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminContentDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminContentPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession)
  const [chapters, setChapters] = useState<AdminContentDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'success' | 'warning' | 'fail'>('success')
  const [selectedChapter, setSelectedChapter] = useState<AdminContentDto | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void bootstrapSession()
  }, [bootstrapSession])

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [router, user])

  useEffect(() => {
    if (user?.role !== 'admin') return

    const run = async () => {
      try {
        setError(null)
        setChapters(await AdminDashboardService.getContent())
      } catch (e) {
        setError(extractApiErrorMessage(e, 'Failed to load content'))
      }
    }

    void run()
  }, [user?.role])

  const filteredChapters = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    return chapters.filter((chapter) => {
      const matchesSearch =
        !needle ||
        chapter.title.toLowerCase().includes(needle) ||
        chapter.author.toLowerCase().includes(needle) ||
        chapter.workTitle.toLowerCase().includes(needle)
      return matchesSearch && chapter.status === activeTab
    })
  }, [activeTab, chapters, searchTerm])

  const statusCounts = useMemo(
    () => ({
      success: chapters.filter((entry) => entry.status === 'success').length,
      warning: chapters.filter((entry) => entry.status === 'warning').length,
      fail: chapters.filter((entry) => entry.status === 'fail').length,
    }),
    [chapters],
  )

  const getStatusStyles = (status: string) => {
    if (status === 'success') return 'border-l-4 border-l-green-500 bg-green-500/10'
    if (status === 'warning') return 'border-l-4 border-l-yellow-500 bg-yellow-500/10'
    return 'border-l-4 border-l-red-500 bg-red-500/10'
  }

  const handleDeleteChapter = async (chapterId: string) => {
    const confirmed = window.confirm('Delete this chapter?')
    if (!confirmed) return

    try {
      await AdminDashboardService.deleteContent(chapterId)
      setChapters((prev) => prev.filter((entry) => entry.id !== chapterId))
      toast.success('Chapter deleted')
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to delete chapter'))
    }
  }

  const handlePublishChapter = async (chapterId: string) => {
    try {
      await AdminDashboardService.publishContent(chapterId)
      setChapters((prev) =>
        prev.map((entry) =>
          entry.id === chapterId ? { ...entry, status: 'success' } : entry,
        ),
      )
      toast.success('Chapter approved')
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to approve chapter'))
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="w-full max-w-full px-6 py-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Published Content</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage chapters and publications</p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <div className="w-full max-w-full px-6 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by chapter name or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('success')}
            className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
              activeTab === 'success'
                ? 'bg-green-500 text-background'
                : 'border border-border bg-card text-foreground hover:border-green-500/70'
            }`}
          >
            Success ({statusCounts.success})
          </button>
          <button
            onClick={() => setActiveTab('warning')}
            className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
              activeTab === 'warning'
                ? 'bg-yellow-500 text-background'
                : 'border border-border bg-card text-foreground hover:border-yellow-500/70'
            }`}
          >
            Warning ({statusCounts.warning})
          </button>
          <button
            onClick={() => setActiveTab('fail')}
            className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
              activeTab === 'fail'
                ? 'bg-red-500 text-background'
                : 'border border-border bg-card text-foreground hover:border-red-500/70'
            }`}
          >
            Fail ({statusCounts.fail})
          </button>
        </div>

        <div className="space-y-4">
          {filteredChapters.length > 0 ? (
            filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`rounded-xl border border-border p-6 ${getStatusStyles(chapter.status)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-foreground">{chapter.title}</h3>
                      <p className="mb-1 text-sm text-muted-foreground">
                        {chapter.author} • {chapter.workTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(chapter.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => setSelectedChapter(chapter)}
                      className="flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 font-medium text-accent transition-colors hover:bg-accent/20"
                    >
                      <Eye className="h-4 w-4" />
                      Read
                    </button>

                    {(chapter.status === 'warning' || chapter.status === 'fail') && (
                      <button
                        onClick={() => void handlePublishChapter(chapter.id)}
                        className="rounded-lg bg-green-500/10 px-4 py-2 font-medium text-green-500 transition-colors hover:bg-green-500/20"
                      >
                        Publish
                      </button>
                    )}

                    <button
                      onClick={() => void handleDeleteChapter(chapter.id)}
                      className="rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-accent hover:bg-destructive/10 hover:text-accent"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No chapters found in this section matching your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedChapter.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">by {selectedChapter.author}</p>
              </div>
              <button
                onClick={() => setSelectedChapter(null)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                x
              </button>
            </div>
            <div className="p-6">
              <p className="leading-relaxed text-foreground">{selectedChapter.content}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
