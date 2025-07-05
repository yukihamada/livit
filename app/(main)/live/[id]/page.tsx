'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  ShoppingBag, 
  Share2, 
  CheckCircle,
  Send,
  Gift,
  Star
} from 'lucide-react'
import { formatViewers, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { LiveChat } from '@/components/stream/live-chat'

// Mock data for development
const mockStream = {
  id: '1',
  title: 'コスメ特価セール！限定商品あり',
  streamer: {
    id: 'streamer1',
    name: 'あいか',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    verified: true,
    followers: 28500
  },
  thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  viewers: 2847,
  likes: 1523,
  category: 'コスメ',
  isLive: true,
  startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
  description: '今日は新作コスメを中心に紹介します！限定セットもあるよ〜💄',
  products: [
    {
      id: 'p1',
      name: 'リップティント 5色セット',
      price: 2980,
      originalPrice: 3980,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      stock: 15,
      soldCount: 42
    },
    {
      id: 'p2',
      name: 'アイシャドウパレット 12色',
      price: 3480,
      originalPrice: 4980,
      discount: 30,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
      stock: 8,
      soldCount: 67
    },
    {
      id: 'p3',
      name: 'フェイスマスク 10枚セット',
      price: 1980,
      originalPrice: 2480,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      stock: 25,
      soldCount: 89
    }
  ]
}


export default function LiveStreamPage() {
  const params = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: any) => {
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sellerId: mockStream.streamer.id,
      sellerName: mockStream.streamer.name,
    })
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Container */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay
              src={mockStream.videoUrl}
            />
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>
              <div className="flex items-center space-x-1 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                <Eye className="w-4 h-4" />
                <span>{formatViewers(mockStream.viewers)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/70 hover:bg-black/80 text-white"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/70 hover:bg-black/80 text-white"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stream Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{mockStream.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{mockStream.category}</Badge>
                    <span>•</span>
                    <span>{mockStream.likes.toLocaleString()} いいね</span>
                  </div>
                </div>
              </div>

              {/* Streamer Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={mockStream.streamer.avatar}
                    alt={mockStream.streamer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold">{mockStream.streamer.name}</h3>
                      {mockStream.streamer.verified && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mockStream.streamer.followers.toLocaleString()} フォロワー
                    </p>
                  </div>
                </div>
                <Button>フォロー</Button>
              </div>

              {/* Description */}
              <p className="mt-4 text-muted-foreground">{mockStream.description}</p>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                紹介中の商品
              </h2>
              <div className="space-y-4">
                {mockStream.products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.discount && (
                          <span className="text-sm bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                            -{product.discount}%
                          </span>
                        )}
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>在庫: {product.stock}</span>
                        <span>売上: {product.soldCount}個</span>
                      </div>
                    </div>
                    <Button
                      className="ml-auto"
                      onClick={() => handleAddToCart(product)}
                    >
                      カートに追加
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Section */}
        <div className="space-y-4">
          <LiveChat 
            streamId={Array.isArray(params.id) ? params.id[0] : params.id} 
            className="h-[600px]"
          />

          {/* Gift Section */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <Gift className="w-4 h-4 mr-2" />
                ギフトを送る
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {['100', '500', '1000', '5000'].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center p-2"
                  >
                    <Star className="w-4 h-4 mb-1 text-yellow-500" />
                    <span className="text-xs">¥{amount}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}