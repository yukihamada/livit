'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Star,
  ChevronRight,
  Camera
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { signOut } from '@/lib/auth-helpers'

// Mock data
const mockUser = {
  id: '1',
  username: 'demo_user',
  email: 'demo@livit.jp',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  joinDate: '2024年1月',
  stats: {
    orders: 23,
    reviews: 15,
    favorites: 42,
    following: 127
  }
}

const mockOrders = [
  {
    id: 'order1',
    date: '2024-01-20',
    status: 'delivered',
    total: 8940,
    items: [
      {
        name: 'リップティント 5色セット',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop',
        price: 2980,
        quantity: 1
      },
      {
        name: 'アイシャドウパレット',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100&h=100&fit=crop',
        price: 3480,
        quantity: 1
      }
    ]
  },
  {
    id: 'order2',
    date: '2024-01-15',
    status: 'shipping',
    total: 4980,
    items: [
      {
        name: 'オーバーサイズニット',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop',
        price: 4980,
        quantity: 1
      }
    ]
  }
]

const mockFavorites = [
  {
    id: '1',
    name: 'ワイヤレスイヤホン',
    price: 12800,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop',
    rating: 4.6
  },
  {
    id: '2',
    name: 'レザートートバッグ',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=200&h=200&fit=crop',
    rating: 4.7
  }
]

const statusMap = {
  pending: { label: '処理中', color: 'bg-yellow-500' },
  shipping: { label: '配送中', color: 'bg-blue-500' },
  delivered: { label: '配送完了', color: 'bg-green-500' },
  cancelled: { label: 'キャンセル', color: 'bg-red-500' }
}

export default function ProfilePage() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.username}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{mockUser.username}</h1>
                  <p className="text-muted-foreground">{mockUser.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockUser.joinDate}から利用
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                設定
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{mockUser.stats.orders}</p>
                <p className="text-sm text-muted-foreground">注文</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mockUser.stats.reviews}</p>
                <p className="text-sm text-muted-foreground">レビュー</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mockUser.stats.favorites}</p>
                <p className="text-sm text-muted-foreground">お気に入り</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mockUser.stats.following}</p>
                <p className="text-sm text-muted-foreground">フォロー</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">注文履歴</TabsTrigger>
            <TabsTrigger value="favorites">お気に入り</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">注文番号: {order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge 
                      className={`${statusMap[order.status as keyof typeof statusMap].color} text-white`}
                    >
                      {statusMap[order.status as keyof typeof statusMap].label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="font-semibold">
                      合計: {formatPrice(order.total)}
                    </p>
                    <Button variant="outline" size="sm">
                      詳細を見る
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockFavorites.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <div className="aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>アカウント設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    プロフィール編集
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    配送先住所
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    通知設定
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      ログアウト中...
                    </div>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      ログアウト
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}