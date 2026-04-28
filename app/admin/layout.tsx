
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
        <div className="flex min-h-screen items-center justify-center px-6 py-12" style={{ backgroundColor: '#ffffff' }}>
          <div className="w-full max-w-xl rounded-lg border p-8" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
            <p className="text-sm font-bold uppercase tracking-[0.24em]" style={{ color: '#8b0000' }}>
              Loading
            </p>
            <h1 className="mt-3 text-3xl font-bold" style={{ color: '#0a0a0a' }}>Admin Workspace</h1>
            <p className="mt-3" style={{ color: '#525252' }}>
              Checking your session and preparing the management pages.
            </p>
          </div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12" style={{ backgroundColor: '#ffffff' }}>
          <div className="w-full max-w-xl rounded-lg border p-8" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
            <p className="text-sm font-bold uppercase tracking-[0.24em]" style={{ color: '#8b0000' }}>
              Access Required
            </p>
            <h1 className="mt-3 text-3xl font-bold" style={{ color: '#0a0a0a' }}>Sign in to continue</h1>
            <p className="mt-3" style={{ color: '#525252' }}>
              Admin access is required to manage users, authors, content, premium plans, and more.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="inline-flex rounded-lg px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#8b0000' }}
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
        <div className="flex min-h-screen items-center justify-center px-6 py-12" style={{ backgroundColor: '#ffffff' }}>
          <div className="w-full max-w-xl rounded-lg border p-8" style={{ backgroundColor: '#fafafa', borderColor: '#e5e5e5' }}>
            <p className="text-sm font-bold uppercase tracking-[0.24em]" style={{ color: '#8b0000' }}>
              Access Restricted
            </p>
            <h1 className="mt-3 text-3xl font-bold" style={{ color: '#0a0a0a' }}>Admin only</h1>
            <p className="mt-3" style={{ color: '#525252' }}>
              This section is reserved for administrators. Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )
    }

    return children
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col lg:flex-row">
        <div className="lg:w-[280px] lg:flex-none border-r" style={{ borderColor: '#e5e5e5' }}>
          <AdminSidebar />
        </div>
        <div className="min-w-0 flex-1">{renderContent()}</div>
      </div>
    </div>
  )
}
