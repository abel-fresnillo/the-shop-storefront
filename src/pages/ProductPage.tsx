import { Link, useParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ProductDetail,
  ProductDetailSkeleton,
} from '@/features/product-detail/components/ProductDetail'
import { useProduct } from '@/features/catalog/hooks/useProducts'
import { ApiError } from '@/api/types'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError, error, refetch } = useProduct(id ?? '')

  if (isLoading) return <ProductDetailSkeleton />

  if (isError) {
    const is404 = error instanceof ApiError && error.isNotFound()
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-neutral-900">
          {is404 ? 'Product not found' : 'Failed to load product'}
        </h1>
        <p className="text-neutral-500 mt-2">
          {is404
            ? 'This product may have been removed or does not exist.'
            : 'Something went wrong. Please try again.'}
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link to="/">
            <Button variant="outline">Browse Products</Button>
          </Link>
          {!is404 && <Button onClick={() => refetch()}>Try Again</Button>}
        </div>
      </div>
    )
  }

  if (!product) return null

  return <ProductDetail product={product} />
}
