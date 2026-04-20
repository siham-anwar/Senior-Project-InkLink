'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/app/store/authstore'

export function AuthSessionBootstrap() {
  const bootstrapSession = useAuthStore((state) => state.bootstrapSession)

  useEffect(() => {
    bootstrapSession()
  }, [bootstrapSession])

  return null
}
