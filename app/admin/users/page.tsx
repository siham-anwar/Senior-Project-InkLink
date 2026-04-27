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
  const bootstrapSession = useAuthStore((s) => s.bootstrapSession)
  const [users, setUsers] = useState<AdminUserDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
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
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-4 flex items-center gap-3">
            <Link href="/admin" className="rounded-lg p-2 transition-colors hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage all users on the InkLink platform</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>

        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((entry) => (
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
                      <p className="mb-2 text-sm font-medium text-accent">{entry.email || 'No email'}</p>
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {entry.bio || 'No bio provided.'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(entry.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => void handleDeleteUser(entry.id)}
                    className="flex-shrink-0 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-accent hover:bg-destructive/10 hover:text-accent"
                    title="Delete user"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
