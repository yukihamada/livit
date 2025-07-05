'use client'

import { useState, useEffect } from 'react'
import { LiveStreamCard } from '@/components/home/live-stream-card'
import { CategoryFilter } from '@/components/home/category-filter'
import { SearchBar } from '@/components/home/search-bar'
import { Button } from '@/components/ui/button'
import { RefreshCw, Filter, Loader2 } from 'lucide-react'
import { getLiveStreams } from '@/lib/api/streams'
import type { Stream } from '@/types/common'

// Stream型を拡張して必要な属性を追加
interface ExtendedStream extends Stream {
  products?: Array<{
    id: string
    name: string
    price: number
    image_urls?: string[]
    specialPrice?: number
    soldCount?: number
  }>
}

const categories = ['すべて', 'コスメ', 'ファッション', 'グルメ', '雑貨', 'テック']

export default function HomePage() {
  const [liveStreams, setLiveStreams] = useState<ExtendedStream[]>([])
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  const fetchStreams = async () => {
    try {
      setError(null)
      const data = await getLiveStreams()
      setLiveStreams(data as ExtendedStream[])
    } catch (err) {
      console.error('Failed to fetch streams:', err)
      setError('ライブ配信の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStreams()
  }, [])

  const filteredStreams = liveStreams.filter(stream => {
    const matchesCategory = selectedCategory === 'すべて' || stream.category === selectedCategory
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.streamerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStreams()
    setIsRefreshing(false)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">ライブ配信中</h1>
            <p className="text-muted-foreground">
              {filteredStreams.length}件のライブ配信
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="配信者名や商品を検索..."
          className="mb-4"
        />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">エラーが発生しました</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh}>
            再試行
          </Button>
        </div>
      )}

      {/* Live Streams Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStreams.map((stream) => (
            <LiveStreamCard
              key={stream.id}
              stream={{
                id: stream.id,
                title: stream.title,
                streamer: {
                  name: stream.streamerName,
                  avatar: stream.streamerAvatar || 'https://via.placeholder.com/100x100',
                  verified: false // DBスキーマに該当フィールドがないため、一旦falseに設定
                },
                thumbnail: stream.thumbnailUrl || 'https://via.placeholder.com/400x600',
                viewers: stream.viewerCount,
                category: stream.category,
                isLive: stream.isLive,
                products: stream.products?.map(p => ({
                  id: p.id,
                  name: p.name,
                  price: p.specialPrice || p.price || 0,
                  discount: p.specialPrice && p.price ? Math.round((1 - p.specialPrice / p.price) * 100) : undefined
                })) || []
              }}
              onCardClick={() => {
                window.location.href = `/live/${stream.id}`
              }}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredStreams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold mb-2">配信が見つかりませんでした</h3>
          <p className="text-muted-foreground mb-4">
            {liveStreams.length === 0 
              ? '現在配信中のライブはありません' 
              : '検索条件を変更するか、他のカテゴリーをお試しください'
            }
          </p>
          {liveStreams.length > 0 && (
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('すべて')
            }}>
              フィルターをリセット
            </Button>
          )}
        </div>
      )}
    </div>
  )
}