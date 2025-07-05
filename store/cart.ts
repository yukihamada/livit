import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  variant?: {
    color?: string
    size?: string
  }
  sellerId: string
  sellerName: string
}

interface CartStore {
  items: CartItem[]
  total: number
  itemCount: number
  shipping: number
  tax: number
  discount: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, variant?: CartItem['variant']) => void
  updateQuantity: (productId: string, quantity: number, variant?: CartItem['variant']) => void
  clearCart: () => void
  applyDiscount: (amount: number) => void
  calculateTotals: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          i => i.productId === item.productId && 
          JSON.stringify(i.variant) === JSON.stringify(item.variant)
        )

        if (existingItem) {
          get().updateQuantity(
            item.productId, 
            existingItem.quantity + (item.quantity || 1),
            item.variant
          )
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] })
          get().calculateTotals()
        }
      },
      removeItem: (productId, variant) => {
        const items = get().items.filter(
          item => !(item.productId === productId && 
          JSON.stringify(item.variant) === JSON.stringify(variant))
        )
        set({ items })
        get().calculateTotals()
      },
      updateQuantity: (productId, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant)
          return
        }

        const items = get().items.map(item => 
          item.productId === productId && 
          JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity }
            : item
        )
        set({ items })
        get().calculateTotals()
      },
      clearCart: () => {
        set({ 
          items: [], 
          total: 0, 
          itemCount: 0, 
          shipping: 0, 
          tax: 0, 
          discount: 0 
        })
      },
      applyDiscount: (amount) => {
        set({ discount: amount })
        get().calculateTotals()
      },
      calculateTotals: () => {
        const { items, discount } = get()
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
        const tax = Math.round(subtotal * 0.1) // 10% tax
        const shipping = subtotal > 5000 ? 0 : 500 // Free shipping over ¥5000
        const total = subtotal + tax + shipping - discount

        set({ total, itemCount, tax, shipping })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)