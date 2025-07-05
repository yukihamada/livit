'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Grid3x3, 
  List,
  Star,
  Heart
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'リップティント 5色セット',
    price: 2980,
    originalPrice: 3980,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 342,
    seller: 'BeautyShop Tokyo',
    category: 'コスメ'
  },
  {
    id: '2',
    name: 'アイシャドウパレット 12色',
    price: 3480,
    originalPrice: 4980,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 523,
    seller: 'BeautyShop Tokyo',
    category: 'コスメ'
  },
  {
    id: '3',
    name: 'オーバーサイズニット',
    price: 4980,
    originalPrice: 6980,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 156,
    seller: 'Fashion Store',
    category: 'ファッション'
  },
  {
    id: '4',
    name: 'ワイヤレスイヤホン',
    price: 12800,
    originalPrice: 15800,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 892,
    seller: 'Tech Plus',
    category: 'テック'
  },
  {
    id: '5',
    name: 'フェイスマスク 10枚セット',
    price: 1980,
    originalPrice: 2480,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 234,
    seller: 'BeautyShop Tokyo',
    category: 'コスメ'
  },
  {
    id: '6',
    name: 'レザートートバッグ',
    price: 8900,
    originalPrice: 12800,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 445,
    seller: 'Fashion Store',
    category: 'ファッション'
  }
]

const categories = ['すべて', 'コスメ', 'ファッション', '雑貨', 'テック', 'フード']
const sortOptions = [
  { value: 'popular', label: '人気順' },
  { value: 'newest', label: '新着順' },
  { value: 'price-low', label: '価格が安い順' },
  { value: 'price-high', label: '価格が高い順' },
  { value: 'discount', label: '割引率順' }
]

export default function ShopPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [favorites, setFavorites] = useState<string[]>([])
  const addItem = useCartStore((state) => state.addItem)

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'すべて' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sellerId: product.seller,
      sellerName: product.seller,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">ショップ</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="商品や店舗を検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md border bg-background"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex rounded-md border bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-muted' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                フィルター
              </Button>
            </div>
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

        {/* Products Grid/List */}
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            viewMode === 'grid' ? (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div 
                  className="relative aspect-square"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      -{product.discount}%
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(product.id)
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : ''
                      }`} 
                    />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{product.seller}</p>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                    >
                      カート
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => router.push(`/products/${product.id}`)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.seller}</p>
                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviewCount}件)</span>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart 
                            className={`w-5 h-5 ${
                              favorites.includes(product.id) 
                                ? 'fill-red-500 text-red-500' 
                                : ''
                            }`} 
                          />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline space-x-2">
                          {product.discount && (
                            <Badge className="bg-red-500">
                              -{product.discount}%
                            </Badge>
                          )}
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <Button onClick={() => handleAddToCart(product)}>
                          カートに追加
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">商品が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}