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
    // 1. Authentication Check: Redirect to login if unauthenticated on protected paths
    const isProtectedPath = ['/home', '/explore', '/editor', '/library', '/dashboard', '/premium', '/profile'].some(
      path => pathname.startsWith(path)
    )

    if (!isLoading && !user && isProtectedPath) {
      console.warn('[RoleGuard] Unauthenticated access to protected path. Redirecting to login.')
      router.replace('/auth/login')
      return
    }

    if (!user) return

    const isChild = user.role === 'child'
    const isAdultPath = isProtectedPath // Reuse the mapping
    const isChildrenPath = pathname.startsWith('/children')

    // 2. Safety: Redirect children away from adult pages
    if (isChild && isAdultPath) {
      console.warn('[RoleGuard] Child attempted to access adult content. Redirecting to Kids Mode.')
      router.replace('/children')
    }

    // 3. Optimization: Redirect adults away from children pages
    if (!isChild && isChildrenPath && user.role !== 'parent') {
      router.replace('/home')
    }
  }, [user, pathname, router, isLoading])

  return null
}
