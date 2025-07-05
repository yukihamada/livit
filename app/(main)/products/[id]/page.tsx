'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Star, 
  CheckCircle,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

// Mock data
const mockProduct = {
  id: '1',
  name: 'リップティント 5色セット',
  price: 2980,
  originalPrice: 3980,
  discount: 25,
  images: [
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571741140674-8949ca7df2a7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591051696671-21e9f2623f6f?w=800&h=800&fit=crop',
  ],
  description: '発色が良く長持ちする人気のリップティント5色セット。デイリー使いにぴったりな色をセレクトしました。',
  details: [
    '5色セット（ピンク、コーラル、レッド、オレンジ、ローズ）',
    '高発色で長時間キープ',
    'うるおい成分配合',
    '無香料・パラベンフリー',
  ],
  seller: {
    id: 'seller1',
    name: 'BeautyShop Tokyo',
    avatar: 'https://images.unsplash.com/photo-1560731186-02fdb1f284d4?w=200&h=200&fit=crop',
    verified: true,
    rating: 4.8,
    reviewCount: 1523,
  },
  stock: 15,
  soldCount: 892,
  rating: 4.5,
  reviewCount: 342,
  shipping: {
    fee: 0,
    estimation: '2-3営業日',
  },
  relatedProducts: [
    {
      id: '2',
      name: 'アイシャドウパレット 12色',
      price: 3480,
      originalPrice: 4980,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'フェイスマスク 10枚セット',
      price: 1980,
      originalPrice: 2480,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    },
  ]
}

const mockReviews = [
  {
    id: '1',
    user: 'みゆき',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-15',
    comment: '発色がとても良くて気に入っています！長持ちするのも嬉しい。',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop'],
  },
  {
    id: '2',
    user: 'さくら',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 4,
    date: '2024-01-10',
    comment: '色味が可愛くて使いやすいです。少し乾燥するかも？',
    images: [],
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: Date.now().toString() + i,
        productId: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        originalPrice: mockProduct.originalPrice,
        image: mockProduct.images[0],
        sellerId: mockProduct.seller.id,
        sellerName: mockProduct.seller.name,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => router.push('/home')} className="hover:text-foreground">
            ホーム
          </button>
          <span>/</span>
          <button onClick={() => router.push('/products')} className="hover:text-foreground">
            商品一覧
          </button>
          <span>/</span>
          <span className="text-foreground">{mockProduct.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              <button
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : mockProduct.images.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImage(prev => prev < mockProduct.images.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Discount Badge */}
              {mockProduct.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{mockProduct.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${mockProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{mockProduct.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(mockProduct.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{mockProduct.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({mockProduct.reviewCount}件のレビュー)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(mockProduct.price)}
                </span>
                {mockProduct.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(mockProduct.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{mockProduct.description}</p>

            {/* Stock Info */}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-muted-foreground">
                在庫: <span className="text-foreground font-medium">{mockProduct.stock}点</span>
              </span>
              <span className="text-muted-foreground">
                販売数: <span className="text-foreground font-medium">{mockProduct.soldCount}個</span>
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">数量:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  カートに追加
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={mockProduct.seller.avatar}
                      alt={mockProduct.seller.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <h3 className="font-semibold">{mockProduct.seller.name}</h3>
                        {mockProduct.seller.verified && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{mockProduct.seller.rating}</span>
                        </div>
                        <span>({mockProduct.seller.reviewCount}件)</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    ショップを見る
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Truck className="w-8 h-8 mx-auto text-primary" />
                <p className="text-sm font-medium">送料無料</p>
                <p className="text-xs text-muted-foreground">{mockProduct.shipping.estimation}</p>
              </div>
              <div className="space-y-2">
                <Shield className="w-8 h-8 mx-auto text-primary" />
                <p className="text-sm font-medium">品質保証</p>
                <p className="text-xs text-muted-foreground">30日間返品可能</p>
              </div>
              <div className="space-y-2">
                <RefreshCw className="w-8 h-8 mx-auto text-primary" />
                <p className="text-sm font-medium">交換無料</p>
                <p className="text-xs text-muted-foreground">サイズ・色交換OK</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">商品詳細</TabsTrigger>
              <TabsTrigger value="reviews">レビュー ({mockProduct.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">配送・返品</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">商品の特徴</h3>
                  <ul className="space-y-2">
                    {mockProduct.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.user}</h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review ${index + 1}`}
                                  className="w-16 h-16 rounded object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">配送について</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 送料無料（全国一律）</li>
                      <li>• 通常2-3営業日以内に発送</li>
                      <li>• 追跡番号あり</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">返品・交換について</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• 商品到着後30日以内なら返品可能</li>
                      <li>• 未使用・未開封の商品に限る</li>
                      <li>• サイズ・色の交換は無料</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">関連商品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockProduct.relatedProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <div className="aspect-square relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}