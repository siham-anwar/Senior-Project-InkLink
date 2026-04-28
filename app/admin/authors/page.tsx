
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
    <main style={{ backgroundColor: '#ffffff' }} className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b" style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff' }}>
        <div className="w-full px-6 py-6">
          <Link href="/admin" className="mb-4 inline-flex items-center gap-2 transition-colors hover:text-opacity-80" style={{ color: '#8b0000' }}>
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-semibold">Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#0a0a0a' }}>Authors</h1>
            <p className="mt-1 text-sm" style={{ color: '#525252' }}>{authors.length} creators on the platform</p>
            {error && <p className="mt-2 text-sm" style={{ color: '#8b0000' }}>{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full max-w-full px-6 py-12">
        {/* Search & Filter */}
        <div className="mb-12 space-y-5">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#525252' }} />
            <input
              type="text"
              placeholder="Search by name, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border py-3 pl-12 pr-4 text-base transition-all outline-none"
              style={{
                backgroundColor: '#fafafa',
                borderColor: '#e5e5e5',
                color: '#0a0a0a'
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.borderColor = '#8b0000'
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa'
                e.currentTarget.style.borderColor = '#e5e5e5'
              }}
            />
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('monetized')}
              className="px-6 py-3 font-bold text-sm rounded-lg transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'monetized' ? '#8b0000' : '#fafafa',
                color: activeTab === 'monetized' ? '#ffffff' : '#0a0a0a',
                border: activeTab === 'monetized' ? 'none' : '1px solid #e5e5e5'
              }}
            >
              Monetized ({monetizedCount})
            </button>
            <button
              onClick={() => setActiveTab('non-monetized')}
              className="px-6 py-3 font-bold text-sm rounded-lg transition-all duration-300"
              style={{
                backgroundColor: activeTab === 'non-monetized' ? '#8b0000' : '#fafafa',
                color: activeTab === 'non-monetized' ? '#ffffff' : '#0a0a0a',
                border: activeTab === 'non-monetized' ? 'none' : '1px solid #e5e5e5'
              }}
            >
              Non-Monetized ({nonMonetizedCount})
            </button>
          </div>
        </div>

        {/* Authors Grid */}
        {filteredAuthors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAuthors.map((entry) => (
              <div
                key={entry.id}
                className="relative overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-md p-5 space-y-4"
                style={{
                  backgroundColor: '#fafafa',
                  borderColor: '#e5e5e5'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.borderColor = '#8b0000'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa'
                  e.currentTarget.style.borderColor = '#e5e5e5'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-shrink-0">
                    {entry.profileImage ? (
                      <img
                        src={entry.profileImage}
                        alt={entry.name}
                        className="h-14 w-14 rounded-lg border-2 object-cover"
                        style={{ borderColor: '#e5e5e5' }}
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 text-base font-bold" style={{ borderColor: '#e5e5e5', backgroundColor: '#fafafa', color: '#8b0000' }}>
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => void handleDeleteAuthor(entry.id)}
                    className="rounded-lg p-2 transition-colors hover:bg-red-100"
                    title="Delete author"
                  >
                    <Trash2 className="h-5 w-5" style={{ color: '#525252' }} />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-2 min-w-0">
                  <h3 className="font-bold truncate text-base" style={{ color: '#0a0a0a' }}>{entry.name}</h3>
                  <p className="text-sm font-semibold truncate" style={{ color: '#8b0000' }}>@{entry.username}</p>
                  <p className="text-xs line-clamp-2 min-h-[2.5rem]" style={{ color: '#525252' }}>
                    {entry.bio || 'No bio'}
                  </p>
                </div>

                {/* Stats */}
                <div className="pt-2 border-t" style={{ borderColor: '#e5e5e5' }}>
                  <p className="text-xs font-semibold" style={{ color: '#525252' }}>
                    {(entry.followers || 0).toLocaleString()} followers
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => void handleMonetization(entry.id, !entry.isMonetized)}
                  className="w-full py-2 px-3 rounded-lg font-bold text-xs transition-all duration-300"
                  style={{
                    backgroundColor: entry.isMonetized ? '#8b0000' : '#ffffff',
                    color: entry.isMonetized ? '#ffffff' : '#8b0000',
                    border: entry.isMonetized ? 'none' : '1px solid #8b0000'
                  }}
                >
                  {entry.isMonetized ? 'Demonetize' : 'Monetize'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border py-20 text-center" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
            <p className="text-2xl font-bold" style={{ color: '#0a0a0a' }}>No authors found</p>
            <p style={{ color: '#525252' }} className="mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  )
}
