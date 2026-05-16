'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminDashboardService, type AdminUserDto } from '@/app/services/admin-dashboard.service'
import { useAuthStore } from '@/app/store/authstore'
import { extractApiErrorMessage } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'

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
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800">
        <div className="w-full px-6 py-8">
          <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-primary transition-all hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-black uppercase tracking-widest">Back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Users</h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{users.length} platform members</p>
            {error && <p className="mt-2 text-sm font-bold text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-12">
        {/* Search Section */}
        <div className="mb-12 space-y-4">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white py-4 pl-12 pr-4 text-base transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-neutral-500 dark:text-neutral-400">
              Showing <span className="font-bold text-neutral-900 dark:text-white">{filteredUsers.length}</span> of <span className="font-bold text-neutral-900 dark:text-white">{users.length}</span> users
            </p>
            {error && <p className="font-bold text-red-500">{error}</p>}
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((entry) => (
              <div
                key={entry.id}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
              >
                {/* Header with avatar and delete button */}
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
                    onClick={() => void handleDeleteUser(entry.id)}
                    className="rounded-xl p-2.5 text-neutral-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    title="Delete user"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="mt-6 space-y-2 min-w-0">
                  <h3 className="font-bold truncate text-lg text-neutral-900 dark:text-white">
                    {entry.name}
                  </h3>
                  <p className="text-sm font-bold truncate text-primary/80">
                    {entry.email || 'No email'}
                  </p>
                  <p className="text-sm line-clamp-2 min-h-[2.5rem] text-neutral-500 dark:text-neutral-400">
                    {entry.bio || 'No bio provided'}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    <span>Member Since</span>
                    <span className="text-neutral-500 dark:text-neutral-300">
                      {new Date(entry.joinDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-200 py-32 text-center dark:border-neutral-800">
            <div className="space-y-3">
              <p className="text-2xl font-black text-neutral-900 dark:text-white">No users found</p>
              <p className="text-neutral-500 dark:text-neutral-400">Try adjusting your search filters or check your connection.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
