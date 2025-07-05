import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Livit - 次世代ライブコマースプラットフォーム',
  description: 'AIとインタラクティブ機能を活用した新しいライブショッピング体験。インフルエンサーと一緒にリアルタイムで楽しくお買い物。',
  keywords: ['ライブコマース', 'ライブストリーミング', 'ショッピング', 'インフルエンサー', 'AI', 'AR試着'],
  authors: [{ name: 'Livit Team' }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="ja" className="dark">
      <body className={inter.className}>
        <Providers session={user}>
          {children}
        </Providers>
      </body>
    </html>
  )
}