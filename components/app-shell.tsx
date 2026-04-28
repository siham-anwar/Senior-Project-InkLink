'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
