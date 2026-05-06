
'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAuthStore } from '@/app/store/authstore'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    if (!isLoading && user && user.role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [isLoading, router, user])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950 transition-colors">
          <div className="w-full max-w-xl rounded-lg border p-8 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8b0000]">
              Loading
            </p>
            <h1 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">Admin Workspace</h1>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Checking your session and preparing the management pages.
            </p>
          </div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950 transition-colors">
          <div className="w-full max-w-xl rounded-lg border p-8 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8b0000]">
              Access Required
            </p>
            <h1 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">Sign in to continue</h1>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Admin access is required to manage users, authors, content, premium plans, and more.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-flex rounded-lg px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg bg-[#8b0000] hover:bg-[#a00000]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )
    }

    if (user.role !== 'admin') {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950 transition-colors">
          <div className="w-full max-w-xl rounded-lg border p-8 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8b0000]">
              Access Restricted
            </p>
            <h1 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">Admin only</h1>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              This section is reserved for administrators. Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )
    }

    return children
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col lg:flex-row">
        <div className="lg:w-[280px] lg:flex-none border-r border-neutral-200 dark:border-neutral-800">
          <AdminSidebar />
        </div>
        <div className="min-w-0 flex-1">{renderContent()}</div>
      </div>
    </div>
  )
}
