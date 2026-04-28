'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminUserDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<AdminUserDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
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
        setUsers(await AdminDashboardService.getUsers())
      } catch (e) {
        setError(extractApiErrorMessage(e, 'Failed to load users'))
      }
    }

    void run()
  }, [user?.role])

  const filteredUsers = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    if (!needle) return users
    return users.filter(
      (entry) =>
        entry.name.toLowerCase().includes(needle) ||
        entry.email.toLowerCase().includes(needle) ||
        entry.bio.toLowerCase().includes(needle),
    )
  }, [searchTerm, users])

  const handleDeleteUser = async (userId: string) => {
    const confirmed = window.confirm('Delete this user account?')
    if (!confirmed) return

    try {
      await AdminDashboardService.deleteUser(userId)
      setUsers((prev) => prev.filter((entry) => entry.id !== userId))
      toast.success('User deleted')
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to delete user'))
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <main style={{ backgroundColor: '#ffffff' }} className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b" style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff' }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" style={{ color: '#8b0000' }} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#0a0a0a' }}>Users</h1>
              <p className="text-sm mt-0.5" style={{ color: '#525252' }}>{users.length} platform members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Search Section */}
        <div className="mb-12 space-y-4">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#525252' }} />
            <input
              type="text"
              placeholder="Search by name, email..."
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
          <div className="flex items-center justify-between text-sm">
            <p style={{ color: '#525252' }}>
              Showing <span className="font-bold" style={{ color: '#0a0a0a' }}>{filteredUsers.length}</span> of <span className="font-bold" style={{ color: '#0a0a0a' }}>{users.length}</span> users
            </p>
            {error && <p style={{ color: '#8b0000' }} className="font-medium">{error}</p>}
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((entry) => (
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
                {/* Header with avatar and delete button */}
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
                    onClick={() => void handleDeleteUser(entry.id)}
                    className="rounded-lg p-2 transition-colors hover:bg-red-100"
                    title="Delete user"
                  >
                    <Trash2 className="h-5 w-5" style={{ color: '#525252' }} />
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-2 min-w-0">
                  <h3 className="font-bold truncate text-base" style={{ color: '#0a0a0a' }}>
                    {entry.name}
                  </h3>
                  <p className="text-sm font-medium truncate" style={{ color: '#8b0000' }}>
                    {entry.email || 'No email'}
                  </p>
                  <p className="text-xs line-clamp-2 min-h-[2.5rem]" style={{ color: '#525252' }}>
                    {entry.bio || 'No bio provided'}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t" style={{ borderColor: '#e5e5e5' }}>
                  <p className="text-xs" style={{ color: '#525252' }}>
                    Joined {new Date(entry.joinDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border py-20 text-center" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
            <div className="space-y-3">
              <p className="text-2xl font-bold" style={{ color: '#0a0a0a' }}>No users found</p>
              <p style={{ color: '#525252' }}>Try adjusting your search filters</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
