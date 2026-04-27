'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminAuthorDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminAuthorsPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession)
  const [authors, setAuthors] = useState<AdminAuthorDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'monetized' | 'non-monetized'>('monetized')
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
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="w-full px-6 py-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-accent transition-colors hover:text-accent/80"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Manage Authors</h1>
          <p className="mt-2 text-sm text-muted-foreground">Total authors: {authors.length}</p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <div className="w-full max-w-full px-6 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, username, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('monetized')}
            className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
              activeTab === 'monetized'
                ? 'bg-accent text-background'
                : 'border border-border bg-card hover:border-accent/70'
            }`}
          >
            Monetized Authors ({monetizedCount})
          </button>
          <button
            onClick={() => setActiveTab('non-monetized')}
            className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
              activeTab === 'non-monetized'
                ? 'bg-accent text-background'
                : 'border border-border bg-card hover:border-accent/70'
            }`}
          >
            Non-Monetized Authors ({nonMonetizedCount})
          </button>
        </div>

        <div className="space-y-4">
          {filteredAuthors.length > 0 ? (
            filteredAuthors.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 gap-4">
                    <div className="flex-shrink-0">
                      {entry.profileImage ? (
                        <img
                          src={entry.profileImage}
                          alt={entry.name}
                          className="h-16 w-16 rounded-lg border border-border object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted text-xl font-semibold">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-foreground">{entry.name}</h3>
                      <p className="mb-2 text-sm font-medium text-accent">@{entry.username}</p>
                      <p className="mb-3 text-sm text-muted-foreground">{entry.bio || 'No bio provided.'}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {(entry.followers || 0).toLocaleString()} followers
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    {entry.isMonetized ? (
                      <button
                        onClick={() => void handleMonetization(entry.id, false)}
                        className="whitespace-nowrap rounded-lg bg-accent/10 px-4 py-2 font-medium text-accent transition-colors hover:bg-accent/20"
                      >
                        Demonetize
                      </button>
                    ) : (
                      <button
                        onClick={() => void handleMonetization(entry.id, true)}
                        className="whitespace-nowrap rounded-lg bg-accent/10 px-4 py-2 font-medium text-accent transition-colors hover:bg-accent/20"
                      >
                        Monetize
                      </button>
                    )}
                    <button
                      onClick={() => void handleDeleteAuthor(entry.id)}
                      className="rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-accent hover:bg-destructive/10 hover:text-accent"
                      title="Delete author"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border bg-card py-16 text-center">
              <p className="text-lg text-muted-foreground">No authors found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
