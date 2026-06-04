import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPricePerUnit } from '@/lib/formatters'
import { getCategoryEmoji, LOW_STOCK_THRESHOLD } from '@/lib/constants'
import { useCart } from '@/features/cart/hooks/useCart'
import { toast } from 'sonner'
import type { ApiProduct } from '@/api/types'

export function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart()
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group block bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${isOutOfStock ? 'opacity-60' : ''}`}
    >
      <div className="aspect-square bg-neutral-50 flex items-center justify-center text-6xl border-b border-neutral-100">
        {getCategoryEmoji(product.category)}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-neutral-900 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="text-xs text-neutral-500 capitalize mb-2">{product.category}</p>
        <p className="font-mono font-semibold text-neutral-900 text-base mb-3">
          {formatPricePerUnit(product.price, product.unit)}
        </p>
        {isLowStock && (
          <p className="text-xs text-amber-600 font-medium mb-2">Only {product.stock} left</p>
        )}
        <Button
          className="w-full h-11 sm:h-9 touch-manipulation"
          size="sm"
          variant={isOutOfStock ? 'outline' : 'default'}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          aria-label={
            isOutOfStock ? `${product.name} — out of stock` : `Add ${product.name} to cart`
          }
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </Link>
  )
}
