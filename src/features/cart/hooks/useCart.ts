import { useCartStore } from '../store'

export function useCart() {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const openCart = useCartStore((s) => s.openCart)
  const closeCart = useCartStore((s) => s.closeCart)
  const totalItems = useCartStore((s) => s.totalItems())
  const subtotal = useCartStore((s) => s.subtotal())

  return {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    totalItems,
    subtotal,
  }
}
