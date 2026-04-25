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
    const protectedPaths = ['/home', '/explore', '/editor', '/library', '/dashboard', '/premium', '/profile'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    if (!isLoading && !user && isProtectedPath) {
      console.warn('[RoleGuard] Unauthenticated access to protected path. Redirecting to login.')
      router.replace('/auth/login')
      return
    }

    if (!user) return

    const isChild = user.role === 'child'
    const isChildrenPath = pathname.startsWith('/children')
    
    // Paths that are safe for children to visit (even if they are protected/adult paths for others)
    const isChildAllowedOnAdultPath = pathname.startsWith('/profile')
    
    const isAdultPathOnly = isProtectedPath && !isChildAllowedOnAdultPath

    // 2. Safety: Redirect children away from adult-only pages
    if (isChild && isAdultPathOnly) {
      console.warn('[RoleGuard] Child attempted to access restricted content. Redirecting to Kids Mode.')
      router.replace('/children')
    }

    // 3. Optimization: Redirect adults away from children pages
    if (!isChild && isChildrenPath && user.role !== 'parent') {
      router.replace('/home')
    }
  }, [user, pathname, router, isLoading])

  return null
}
