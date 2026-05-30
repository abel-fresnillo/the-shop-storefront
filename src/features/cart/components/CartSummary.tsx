import { Loader2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/formatters'

interface CartSummaryProps {
  subtotal: number
  totalItems: number
  onCheckout: () => void
  isCheckingOut: boolean
  checkoutError: string | null
}

export function CartSummary({
  subtotal,
  totalItems,
  onCheckout,
  isCheckingOut,
  checkoutError,
}: CartSummaryProps) {
  return (
    <div className="border-t border-neutral-200 p-6 space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-500">
          Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
        </span>
        <span className="font-semibold font-mono text-neutral-900">{formatPrice(subtotal)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span className="font-mono text-lg">{formatPrice(subtotal)}</span>
      </div>
      {checkoutError && <p className="text-sm text-red-600">{checkoutError}</p>}
      <Button className="w-full" size="lg" onClick={onCheckout} disabled={isCheckingOut}>
        {isCheckingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}
        {isCheckingOut ? 'Placing order…' : 'Checkout'}
      </Button>
    </div>
  )
}
