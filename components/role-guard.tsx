'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/app/store/authstore'

/**
 * RoleGuard provides a safety layer to ensure children stay in the Kids Mode
 * and are protected from adult content on other pages.
 */
export function RoleGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    // Wait for auth to initialize
    if (!user) return

    const isChild = user.role === 'child'
    const isAdultPath = ['/home', '/explore', '/editor', '/library', '/dashboard', '/premium'].some(
      path => pathname.startsWith(path)
    )
    const isChildrenPath = pathname.startsWith('/children')

    // 1. Safety: Redirect children away from adult pages
    if (isChild && isAdultPath) {
      console.warn('[RoleGuard] Child attempted to access adult content. Redirecting to Kids Mode.')
      router.replace('/children')
    }

    // 2. Optimization: Redirect adults away from children pages (optional, but keeps things tidy)
    if (!isChild && isChildrenPath && user.role !== 'parent') {
      router.replace('/home')
    }
  }, [user, pathname, router])

  return null
}
