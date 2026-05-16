
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminAuthorDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'

export default function AdminAuthorsPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [authors, setAuthors] = useState<AdminAuthorDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'monetized' | 'non-monetized'>('monetized')
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
        setAuthors(await AdminDashboardService.getAuthors())
      } catch (e) {
        setError(extractApiErrorMessage(e, 'Failed to load authors'))
      }
    }

    void run()
  }, [user?.role])

  const filteredAuthors = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    const source = authors.filter((entry) =>
      activeTab === 'monetized' ? entry.isMonetized : !entry.isMonetized,
    )
    if (!needle) return source

    return source.filter(
      (entry) =>
        entry.name.toLowerCase().includes(needle) ||
        entry.username.toLowerCase().includes(needle) ||
        entry.bio.toLowerCase().includes(needle),
    )
  }, [activeTab, authors, searchTerm])

  const handleMonetization = async (authorId: string, isMonetized: boolean) => {
    try {
      await AdminDashboardService.updateAuthorMonetization(authorId, isMonetized)
      setAuthors((prev) =>
        prev.map((entry) =>
          entry.id === authorId ? { ...entry, isMonetized } : entry,
        ),
      )
      toast.success(isMonetized ? 'Author monetized' : 'Author demonetized')
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to update author'))
    }
  }

  const handleDeleteAuthor = async (authorId: string) => {
    const confirmed = window.confirm('Delete this author account?')
    if (!confirmed) return

    try {
      await AdminDashboardService.deleteAuthor(authorId)
      setAuthors((prev) => prev.filter((entry) => entry.id !== authorId))
      toast.success('Author deleted')
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to delete author'))
    }
  }

  if (!user || user.role !== 'admin') return null

  const monetizedCount = authors.filter((entry) => entry.isMonetized).length
  const nonMonetizedCount = authors.length - monetizedCount

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800">
        <div className="w-full px-6 py-8">
          <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-primary transition-all hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-black uppercase tracking-widest">Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Authors</h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{authors.length} creators on the platform</p>
            {error && <p className="mt-2 text-sm font-bold text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        {/* Search & Filter */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white py-4 pl-12 pr-4 text-base transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 p-1 w-fit rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50">
            <button
              onClick={() => setActiveTab('monetized')}
              className={cn(
                "px-8 py-2.5 font-bold text-xs rounded-xl transition-all duration-300 uppercase tracking-widest",
                activeTab === 'monetized' 
                  ? "bg-white dark:bg-neutral-700 text-primary shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              )}
            >
              Monetized ({monetizedCount})
            </button>
            <button
              onClick={() => setActiveTab('non-monetized')}
              className={cn(
                "px-8 py-2.5 font-bold text-xs rounded-xl transition-all duration-300 uppercase tracking-widest",
                activeTab === 'non-monetized' 
                  ? "bg-white dark:bg-neutral-700 text-primary shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
              )}
            >
              Pending ({nonMonetizedCount})
            </button>
          </div>
        </div>

        {/* Authors Grid */}
        {filteredAuthors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAuthors.map((entry) => (
              <div
                key={entry.id}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-shrink-0">
                    {entry.profileImage ? (
                      <img
                        src={entry.profileImage}
                        alt={entry.name}
                        className="h-16 w-16 rounded-2xl border-2 border-neutral-100 object-cover dark:border-neutral-800"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-xl font-black text-primary">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => void handleDeleteAuthor(entry.id)}
                    className="rounded-xl p-2.5 text-neutral-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    title="Delete author"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-6 space-y-2 min-w-0">
                  <h3 className="font-bold truncate text-lg text-neutral-900 dark:text-white">{entry.name}</h3>
                  <p className="text-sm font-black text-primary/80">@{entry.username}</p>
                  <p className="text-sm line-clamp-2 min-h-[2.5rem] text-neutral-500 dark:text-neutral-400">
                    {entry.bio || 'No bio provided for this creator.'}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {(entry.followers || 0).toLocaleString()} followers
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                      {entry.worksCount || 0} Published Works
                    </p>
                  </div>
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    entry.isMonetized ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-neutral-300 dark:bg-neutral-700"
                  )} />
                </div>

                {/* Action */}
                <button
                  onClick={() => void handleMonetization(entry.id, !entry.isMonetized)}
                  className={cn(
                    "mt-6 w-full py-3 px-4 rounded-xl font-black text-xs transition-all duration-300 uppercase tracking-widest",
                    entry.isMonetized 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400" 
                      : "bg-primary text-white hover:shadow-lg hover:shadow-primary/20"
                  )}
                >
                  {entry.isMonetized ? 'Demonetize' : 'Approve Monetization'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-200 py-32 text-center dark:border-neutral-800">
            <p className="text-2xl font-black text-neutral-900 dark:text-white">No authors found</p>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">Try adjusting your filters or check pending requests.</p>
          </div>
        )}
      </div>
    </main>
  )
}
