'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import { useAuthStore } from '@/store/auth'
import { getCurrentUser } from '@/lib/auth-helpers'
import { useRouter } from 'next/navigation'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ 
  children,
  session
}: { 
  children: React.ReactNode
  session: User | null
}) {
  const [user, setUser] = useState<User | null>(session)
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const { setUser: setAuthUser, logout } = useAuthStore()

  useEffect(() => {
    // 初期認証状態をチェック
    getCurrentUser().then(user => {
      if (user) {
        setAuthUser(user)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        const user = await getCurrentUser()
        if (user) {
          setAuthUser(user)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        logout()
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, setAuthUser, logout, router])

  return (
    <Context.Provider value={{ supabase, user }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}