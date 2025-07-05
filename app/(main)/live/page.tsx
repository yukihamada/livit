'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Eye, CheckCircle } from 'lucide-react'
import { formatViewers } from '@/lib/utils'
import { LiveStreamCard } from '@/components/home/live-stream-card'

// Mock data
const mockStreams = [
  {
    id: '1',
    title: 'コスメ特価セール！限定商品あり',
    streamer: {
      name: 'あいか',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    viewers: 2847,
    category: 'コスメ',
    isLive: true,
    products: [
      { id: 'p1', name: 'リップティント 5色セット', price: 2980, discount: 25 },
      { id: 'p2', name: 'アイシャドウパレット', price: 3480, discount: 30 }
    ]
  },
  {
    id: '2',
    title: 'アルファッション秋コーデ特集',
    streamer: {
      name: 'りな',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    viewers: 1342,
    category: 'ファッション',
    isLive: true,
    products: [
      { id: 'p3', name: 'オーバーサイズニット', price: 4980, discount: 20 }
    ]
  },
  {
    id: '3',
    title: 'アクセサリー教室 今なら材料付き！',
    streamer: {
      name: 'みゆき',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      verified: false
    },
    thumbnail: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=600&fit=crop',
    viewers: 892,
    category: '雑貨',
    isLive: true,
    products: []
  },
  {
    id: '4',
    title: '最新ガジェットレビュー＆開封',
    streamer: {
      name: 'たく',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop',
    viewers: 3214,
    category: 'テック',
    isLive: true,
    products: [
      { id: 'p4', name: 'ワイヤレスイヤホン', price: 12800, discount: 15 },
      { id: 'p5', name: 'スマートウォッチ', price: 24800, discount: 10 }
    ]
  }
]

const categories = ['すべて', 'コスメ', 'ファッション', '雑貨', 'テック', 'フード', 'その他']

export default function LiveListPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStreams = mockStreams.filter(stream => {
    const matchesCategory = selectedCategory === 'すべて' || stream.category === selectedCategory
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.streamer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleStreamClick = (streamId: string) => {
    router.push(`/live/${streamId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">ライブ配信中</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="配信者や商品を検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              フィルター
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Live Streams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStreams.map((stream) => (
            <LiveStreamCard
              key={stream.id}
              stream={stream}
              onCardClick={() => handleStreamClick(stream.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">配信が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}