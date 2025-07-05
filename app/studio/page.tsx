'use client'

import { Suspense } from 'react'
import { LiveStudio } from '@/components/stream/live-studio'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StudioPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/studio')
    }
  }, [isAuthenticated, router])

  const handleStreamStart = (streamData: any) => {
    console.log('配信開始:', streamData)
    // 配信開始後の処理（オプション）
  }

  const handleStreamEnd = () => {
    console.log('配信終了')
    // 配信終了後の処理（オプション）
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              ログインが必要です...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                配信スタジオ
              </h1>
              <p className="text-gray-600">
                ようこそ {user?.username} さん
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      }>
        <LiveStudio 
          onStreamStart={handleStreamStart}
          onStreamEnd={handleStreamEnd}
        />
      </Suspense>
    </div>
  )
}