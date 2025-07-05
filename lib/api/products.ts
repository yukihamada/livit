import { createClient } from '@/lib/supabase'
import type { Product } from '@/types/common'

export async function getProducts(limit = 20) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!seller_id(
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    salePrice: item.discount_percentage ? Number(item.price) : undefined,
    imageUrl: item.image_urls?.[0] || '',
    category: item.category_id || 'other',
    brand: item.seller?.display_name || item.seller?.username || '',
    inStock: item.stock_quantity > 0,
    tags: [],
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    salesCount: 0
  })) as Product[]
}

export async function getProductById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!seller_id(
        id,
        username,
        display_name,
        avatar_url,
        bio
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price),
    originalPrice: data.original_price ? Number(data.original_price) : undefined,
    salePrice: data.discount_percentage ? Number(data.price) : undefined,
    imageUrl: data.image_urls?.[0] || '',
    category: data.category_id || 'other',
    brand: data.seller?.display_name || data.seller?.username || '',
    inStock: data.stock_quantity > 0,
    tags: [],
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    salesCount: 0,
    seller: data.seller
  }
}

export async function getProductsByCategory(category: string, limit = 20) {
  const supabase = createClient()
  
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category)
    .single()

  if (categoryError || !categoryData) {
    console.error('Error fetching category:', categoryError)
    return []
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!seller_id(
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('is_active', true)
    .eq('category_id', categoryData.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    salePrice: item.discount_percentage ? Number(item.price) : undefined,
    imageUrl: item.image_urls?.[0] || '',
    category: category,
    brand: item.seller?.display_name || item.seller?.username || '',
    inStock: item.stock_quantity > 0,
    tags: [],
    rating: 4.5,
    reviewCount: Math.floor(Math.random() * 100) + 10,
    salesCount: 0
  })) as Product[]
}