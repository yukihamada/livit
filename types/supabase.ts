export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          follower_count: number
          following_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          follower_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          follower_count?: number
          following_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      live_streams: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          stream_url: string | null
          stream_key: string | null
          host_id: string
          category: string
          viewer_count: number
          like_count: number
          status: 'scheduled' | 'live' | 'ended'
          scheduled_start: string | null
          actual_start: string | null
          actual_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          stream_url?: string | null
          stream_key?: string | null
          host_id: string
          category: string
          viewer_count?: number
          like_count?: number
          status?: 'scheduled' | 'live' | 'ended'
          scheduled_start?: string | null
          actual_start?: string | null
          actual_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          stream_url?: string | null
          stream_key?: string | null
          host_id?: string
          category?: string
          viewer_count?: number
          like_count?: number
          status?: 'scheduled' | 'live' | 'ended'
          scheduled_start?: string | null
          actual_start?: string | null
          actual_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          sale_price: number | null
          image_urls: string[]
          category: string
          brand: string | null
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          sale_price?: number | null
          image_urls: string[]
          category: string
          brand?: string | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          image_urls?: string[]
          category?: string
          brand?: string | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      stream_products: {
        Row: {
          id: string
          stream_id: string
          product_id: string
          display_order: number
          featured_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          stream_id: string
          product_id: string
          display_order?: number
          featured_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          stream_id?: string
          product_id?: string
          display_order?: number
          featured_at?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          stream_id: string
          user_id: string
          message: string
          is_pinned: boolean
          created_at: string
        }
        Insert: {
          id?: string
          stream_id: string
          user_id: string
          message: string
          is_pinned?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          stream_id?: string
          user_id?: string
          message?: string
          is_pinned?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          stream_id: string | null
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json
          payment_method: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stream_id?: string | null
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Json
          payment_method: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stream_id?: string | null
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: Json
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}