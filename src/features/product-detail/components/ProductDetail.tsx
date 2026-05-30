import { useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatPricePerUnit } from '@/lib/formatters'
import { getCategoryEmoji, LOW_STOCK_THRESHOLD } from '@/lib/constants'
import { useCart } from '@/features/cart/hooks/useCart'
import { StockBadge } from '@/features/catalog/components/StockBadge'
import { toast } from 'sonner'
import type { ApiProduct } from '@/api/types'

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-5 w-32 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetail({ product }: { product: ApiProduct }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const isOutOfStock = product.stock === 0
  const isLowStock = !isOutOfStock && product.stock <= LOW_STOCK_THRESHOLD

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${quantity} × ${product.name} added to cart`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div
          className={`aspect-square rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-8xl ${isOutOfStock ? 'opacity-60' : ''}`}
          aria-hidden="true"
        >
          {getCategoryEmoji(product.category)}
        </div>

        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit capitalize mb-3">
            {product.category}
          </Badge>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-neutral-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-neutral-500 text-base">per {product.unit}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <StockBadge stock={product.stock} />
            {isLowStock && (
              <span className="text-sm text-amber-600 font-medium">
                Only {product.stock} remaining
              </span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    min={1}
                    max={product.stock}
                    onChange={(e) => {
                      const v = parseInt(e.target.value)
                      if (!isNaN(v)) setQuantity(Math.min(Math.max(1, v), product.stock))
                    }}
                    className="w-16 text-center border border-neutral-200 rounded-md h-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-neutral-500">of {product.stock} available</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-neutral-500 mb-3">
                  Subtotal:{' '}
                  <span className="font-semibold font-mono text-neutral-900">
                    {formatPricePerUnit(product.price * quantity, 'total')}
                  </span>
                </p>
                <Button onClick={handleAddToCart} size="lg" className="w-full gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <p className="text-neutral-600 font-medium">This item is currently out of stock.</p>
              <p className="text-sm text-neutral-400 mt-1">
                Check back soon or browse other products.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
