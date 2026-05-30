import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/features/cart/components/CartItem'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { useCart } from '@/features/cart/hooks/useCart'
import { submitOrder } from '@/api/orders'
import { ApiError } from '@/api/types'

export function CartDrawer() {
  const { items, isOpen, closeCart, openCart, clearCart, totalItems, subtotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleCheckout() {
    setIsCheckingOut(true)
    setCheckoutError(null)
    try {
      await submitOrder(items)
      clearCart()
      closeCart()
    } catch (err) {
      console.error('[checkout]', err, err instanceof ApiError ? err.body : null)
      if (err instanceof ApiError) {
        setCheckoutError(err.message)
      } else {
        setCheckoutError('Something went wrong. Please try again.')
      }
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent aria-describedby="cart-desc">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription id="cart-desc">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingCart className="h-12 w-12 text-neutral-200 mb-4" />
              <p className="font-medium text-neutral-700">Your cart is empty</p>
              <p className="text-sm text-neutral-400 mt-1">Add some products to get started</p>
              <Button variant="outline" className="mt-6" onClick={closeCart}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <CartSummary
            subtotal={subtotal}
            totalItems={totalItems}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
            checkoutError={checkoutError}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
