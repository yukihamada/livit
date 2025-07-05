// 共通型定義

export interface Product {
  id: string
  name: string
  description?: string
  price?: number
  originalPrice?: number
  salePrice?: number
  imageUrl: string
  category: 'clothing' | 'accessories' | 'makeup'
  brand: string
  inStock?: boolean
  tags: string[]
  rating?: number
  reviewCount?: number
  salesCount?: number
  colors?: string[]
}

export interface User {
  id: string
  email: string
  username: string
  avatar?: string | null
  role?: 'user' | 'streamer' | 'admin'
}

export interface Stream {
  id: string
  title: string
  description: string
  streamerId: string
  streamerName: string
  streamerAvatar: string
  thumbnailUrl: string
  isLive: boolean
  viewerCount: number
  category: string
  startTime: string
  tags: string[]
}

export interface Creator {
  id: string
  username: string
  displayName: string
  avatar: string
  followerCount: number
  isVerified: boolean
  bio: string
  socialLinks: {
    instagram?: string
    tiktok?: string
    youtube?: string
  }
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
  streamId?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: Address
}

export interface Address {
  name: string
  phone: string
  postalCode: string
  prefecture: string
  city: string
  addressLine1: string
  addressLine2?: string
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  endTime: string
  isActive: boolean
}

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar?: string
  message: string
  timestamp: string
  isSystem?: boolean
}

export interface Notification {
  id: string
  type: 'stream_start' | 'product_sale' | 'follow' | 'comment' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}