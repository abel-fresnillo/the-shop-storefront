import { AlertCircle, Package, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from './ProductCard'
import type { ApiProduct } from '@/api/types'

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}

interface ProductGridProps {
  products: ApiProduct[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  hasFilters: boolean
  onClearFilters: () => void
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  hasFilters,
  onClearFilters,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900">Failed to load products</h3>
        <p className="text-sm text-neutral-500 mt-1">Something went wrong. Please try again.</p>
        <Button onClick={onRetry} variant="outline" className="mt-6 gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (!products || products.length === 0) {
    if (hasFilters) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="h-12 w-12 text-neutral-300 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900">No products found</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Try adjusting your search or clearing filters
          </p>
          <Button onClick={onClearFilters} variant="outline" className="mt-6">
            Clear Filters
          </Button>
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="h-12 w-12 text-neutral-300 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900">No products yet</h3>
        <p className="text-sm text-neutral-500 mt-1">
          Products will appear here once added to the store.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      aria-label={`${products.length} products`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
