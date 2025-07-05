'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  ShoppingBag,
  Star,
  Play,
  CheckCircle,
  Flame,
  Award
} from 'lucide-react'
import { formatViewers, formatPrice } from '@/lib/utils'
import { LiveStreamCard } from '@/components/home/live-stream-card'
import { useCartStore } from '@/store/cart'

// Mock data
const trendingStreams = [
  {
    id: '1',
    title: '【限定】新作コスメ先行販売！',
    streamer: {
      name: 'あいか',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    viewers: 5234,
    category: 'コスメ',
    isLive: true,
    rank: 1,
    products: [
      { id: 'p1', name: 'リップティント限定色', price: 3280, discount: 15 }
    ]
  },
  {
    id: '2',
    title: '秋冬トレンドファッション特集',
    streamer: {
      name: 'りな',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    viewers: 3892,
    category: 'ファッション',
    isLive: true,
    rank: 2,
    products: []
  },
  {
    id: '3',
    title: '最新ガジェット徹底レビュー',
    streamer: {
      name: 'たく',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      verified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop',
    viewers: 3456,
    category: 'テック',
    isLive: true,
    rank: 3,
    products: [
      { id: 'p2', name: 'スマートウォッチ', price: 24800, discount: 20 }
    ]
  }
]

const trendingProducts = [
  {
    id: '1',
    name: 'ビタミンC美容液',
    price: 4980,
    originalPrice: 6980,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop',
    soldCount: 1523,
    rating: 4.8,
    trend: '+125%'
  },
  {
    id: '2',
    name: 'ミニショルダーバッグ',
    price: 3980,
    originalPrice: 5980,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    soldCount: 892,
    rating: 4.6,
    trend: '+87%'
  },
  {
    id: '3',
    name: 'ワイヤレス充電器',
    price: 2980,
    image: 'https://images.unsplash.com/photo-1615526675063-61c2b6ec4d56?w=400&h=400&fit=crop',
    soldCount: 756,
    rating: 4.5,
    trend: '+65%'
  }
]

const topStreamers = [
  {
    id: '1',
    name: 'あいか',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    verified: true,
    followers: 45200,
    category: 'コスメ',
    monthlyViewers: 234500
  },
  {
    id: '2',
    name: 'りな',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    verified: true,
    followers: 38900,
    category: 'ファッション',
    monthlyViewers: 189300
  },
  {
    id: '3',
    name: 'ゆうた',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    verified: true,
    followers: 32100,
    category: 'テック',
    monthlyViewers: 156700
  }
]

export default function TrendingPage() {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: any) => {
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sellerId: 'trending',
      sellerName: 'Trending Store',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-primary" />
            トレンド
          </h1>
          <p className="text-muted-foreground">
            今最も注目されている配信者と商品をチェック
          </p>
        </div>

        <Tabs defaultValue="streams" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="streams">人気配信</TabsTrigger>
            <TabsTrigger value="products">急上昇商品</TabsTrigger>
            <TabsTrigger value="streamers">トップ配信者</TabsTrigger>
          </TabsList>

          {/* Trending Streams */}
          <TabsContent value="streams" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingStreams.map((stream) => (
                <div key={stream.id} className="relative">
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      stream.rank === 1 ? 'bg-yellow-500' :
                      stream.rank === 2 ? 'bg-gray-400' :
                      'bg-orange-600'
                    }`}>
                      {stream.rank === 1 && <Award className="w-6 h-6" />}
                      {stream.rank > 1 && stream.rank}
                    </div>
                  </div>
                  <LiveStreamCard
                    stream={stream}
                    onCardClick={() => router.push(`/live/${stream.id}`)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Trending Products */}
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div 
                    className="relative aspect-square"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Trend Badge */}
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Flame className="w-3 h-3 mr-1" />
                      {product.trend}
                    </div>
                    {/* Rank */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {product.soldCount.toLocaleString()}個販売
                      </span>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        カート
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Streamers */}
          <TabsContent value="streamers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStreamers.map((streamer, index) => (
                <Card key={streamer.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={streamer.avatar}
                            alt={streamer.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {index < 3 && (
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              'bg-orange-600'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <h3 className="font-semibold">{streamer.name}</h3>
                            {streamer.verified && (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {streamer.category}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">
                        フォロー
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">フォロワー</span>
                        <span className="font-semibold">
                          {streamer.followers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">月間視聴者</span>
                        <span className="font-semibold">
                          {formatViewers(streamer.monthlyViewers)}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => router.push(`/streamers/${streamer.id}`)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      配信を見る
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}