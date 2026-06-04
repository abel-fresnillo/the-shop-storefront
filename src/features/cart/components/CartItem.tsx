import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/formatters'
import { useCart } from '../hooks/useCart'
import type { CartItem as CartItemType } from '../types'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart()
  const { product, quantity } = item
  const lineTotal = product.price * quantity

  return (
    <div className="flex items-start gap-3 py-4 border-b border-neutral-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {formatPrice(product.price)} / {product.unit}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 touch-manipulation"
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium tabular-nums">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 touch-manipulation"
          onClick={() => updateQuantity(product.id, quantity + 1)}
          disabled={quantity >= product.stock}
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex items-center gap-2 min-w-[72px] justify-end">
        <span className="text-sm font-medium font-mono text-neutral-900">
          {formatPrice(lineTotal)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-neutral-400 hover:text-red-600 touch-manipulation"
          onClick={() => removeItem(product.id)}
          aria-label={`Remove ${product.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
