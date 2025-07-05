'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { getCurrentUser } from '@/lib/auth-helpers'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setUser, logout } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // 初期認証状態をチェック
    getCurrentUser().then(user => {
      if (user) {
        setUser(user)
      }
    })

    // 認証状態の変化をリッスン
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await getCurrentUser()
        if (user) {
          setUser(user)
        }
      } else if (event === 'SIGNED_OUT') {
        logout()
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, setUser, logout])

  return <>{children}</>
}