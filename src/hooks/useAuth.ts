'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) { router.push('/login'); return null }
        return res.json()
      })
      .then(data => { if (data) setUser(data.user) })
      .finally(() => setLoading(false))
  }, [router])

  return { user, loading }
}
