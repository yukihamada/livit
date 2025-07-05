'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { SupabaseProvider } from './supabase-provider'
import { User } from '@supabase/supabase-js'

export function Providers({ 
  children,
  session 
}: { 
  children: React.ReactNode
  session: User | null
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <SupabaseProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SupabaseProvider>
  )
}