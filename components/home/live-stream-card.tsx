'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, ShoppingBag, CheckCircle } from 'lucide-react'
import { formatViewers, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface LiveStreamCardProps {
  stream: {
    id: string
    title: string
    streamer: {
      name: string
      avatar: string
      verified: boolean
    }
    thumbnail: string
    viewers: number
    category: string
    isLive: boolean
    products: Array<{
      id: string
      name: string
      price: number
      discount?: number
    }>
  }
  onCardClick: () => void
}

export function LiveStreamCard({ stream, onCardClick }: LiveStreamCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation()
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.discount ? Math.round(product.price / (1 - product.discount / 100)) : undefined,
      image: stream.thumbnail,
      sellerId: stream.id,
      sellerName: stream.streamer.name,
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group product-card">
      <div className="relative" onClick={onCardClick}>
        {/* Thumbnail */}
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Live Indicator */}
          {stream.isLive && (
            <div className="absolute top-3 left-3 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              <div className="w-2 h-2 bg-white rounded-full live-pulse" />
              <span>LIVE</span>
            </div>
          )}
          
          {/* Viewers */}
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            <Eye className="w-3 h-3" />
            <span>{formatViewers(stream.viewers)}</span>
          </div>
          
          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs">
              {stream.category}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Streamer Info */}
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={stream.streamer.avatar}
            alt={stream.streamer.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">{stream.streamer.name}</span>
            {stream.streamer.verified && (
              <CheckCircle className="w-4 h-4 text-primary" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-3 line-clamp-2 leading-relaxed">
          {stream.title}
        </h3>

        {/* Featured Products */}
        {stream.products.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">注目商品:</p>
            <div className="space-y-2">
              {stream.products.slice(0, 2).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <div className="flex items-center space-x-2">
                      {product.discount && (
                        <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded font-bold">
                          -{product.discount}%
                        </span>
                      )}
                      <span className="text-xs font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 h-6 px-2 text-xs"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingBag className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}