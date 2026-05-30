import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/formatters'

interface CartSummaryProps {
  subtotal: number
  totalItems: number
}

export function CartSummary({ subtotal, totalItems }: CartSummaryProps) {
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
      <Button className="w-full" size="lg" disabled title="Checkout coming soon">
        <ShoppingBag className="h-4 w-4" />
        Checkout (Coming Soon)
      </Button>
      <p className="text-xs text-center text-neutral-400">
        Online checkout is not yet available. Visit us in store!
      </p>
    </div>
  )
}
