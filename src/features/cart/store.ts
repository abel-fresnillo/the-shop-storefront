import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ApiProduct } from '@/api/types'
import type { CartItem } from './types'
import { cartOperations } from '@/observability/metrics'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: ApiProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        cartOperations.add(1, { operation: 'add' })
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, product.stock)
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: newQty } : i,
              ),
            }
          }
          const safeQty = Math.min(quantity, product.stock)
          if (safeQty <= 0) return state
          return { items: [...state.items, { product, quantity: safeQty }] }
        })
      },

      removeItem: (productId) => {
        cartOperations.add(1, { operation: 'remove' })
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        cartOperations.add(1, { operation: 'update_quantity' })
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, i.product.stock) }
              : i,
          ),
        }))
      },

      clearCart: () => {
        cartOperations.add(1, { operation: 'clear' })
        set({ items: [] })
      },
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'the-shop-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
