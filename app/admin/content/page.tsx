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
  const [chapters, setChapters] = useState<AdminContentDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'success' | 'warning' | 'fail'>('success')
  const [selectedChapter, setSelectedChapter] = useState<AdminContentDto | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        chapter.workTitle.toLowerCase().includes(needle) ||
        chapter.content.toLowerCase().includes(needle)

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

  const handleDeleteChapter = async (chapterId: string) => {
    const confirmed = window.confirm('Delete this chapter?')
    if (!confirmed) return

    try {
      await AdminDashboardService.deleteContent(chapterId)
      setChapters((prev) => prev.filter((entry) => entry.id !== chapterId))
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null)
      }
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
          entry.id === chapterId ? { ...entry, status: 'success' as const } : entry,
        ),
      )
      setSelectedChapter((prev) =>
        prev && prev.id === chapterId ? { ...prev, status: 'success' } : prev,
      )
      toast.success('Chapter published')
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to publish chapter'))
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
        <div className="w-full px-6 py-6">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition-colors hover:text-red-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-950">Content</h1>
            <p className="mt-1 text-sm text-neutral-600">{chapters.length} total chapters</p>
            {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        <div className="mb-10 flex flex-col gap-5">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search chapters, works, authors, or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 text-base text-neutral-950 outline-none transition-all focus:border-red-700 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              ['success', 'Published'],
              ['warning', 'Pending'],
              ['fail', 'Failed'],
            ] as const).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTab === status
                    ? 'bg-red-700 text-white'
                    : 'border border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-red-200 hover:bg-white'
                }`}
              >
                {label} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {filteredChapters.length > 0 ? (
          <div className="space-y-3">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition-all hover:border-red-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-bold text-neutral-950">{chapter.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          chapter.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : chapter.status === 'warning'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {chapter.status === 'success'
                          ? 'Published'
                          : chapter.status === 'warning'
                            ? 'Pending'
                            : 'Failed'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">
                      <span className="font-semibold text-red-700">{chapter.workTitle}</span> by{' '}
                      {chapter.author}
                    </p>
                    <p className="mt-2 text-xs text-neutral-500">
                      Updated {new Date(chapter.publishedAt).toLocaleString()}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm text-neutral-700">
                      {chapter.content || 'No chapter text available.'}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => setSelectedChapter(chapter)}
                      className="rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-700 transition-colors hover:border-red-200 hover:text-red-700"
                      title="Read chapter"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {chapter.status !== 'success' && (
                      <button
                        onClick={() => void handlePublishChapter(chapter.id)}
                        className="rounded-xl bg-red-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-800"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => void handleDeleteChapter(chapter.id)}
                      className="rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      title="Delete chapter"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 py-16 text-center">
            <p className="text-xl font-bold text-neutral-950">No chapters found</p>
            <p className="mt-1 text-neutral-600">Try adjusting your search or status filter.</p>
          </div>
        )}
      </div>

      {selectedChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">{selectedChapter.title}</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {selectedChapter.workTitle} by {selectedChapter.author}
                </p>
              </div>
              <button
                onClick={() => setSelectedChapter(null)}
                className="rounded-full px-3 py-1 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                Close
              </button>
            </div>
            <div className="max-h-[calc(85vh-88px)] overflow-y-auto px-6 py-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-800">
                {selectedChapter.content || 'No chapter text available.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
