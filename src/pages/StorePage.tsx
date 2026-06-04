import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import { ProductGrid } from '@/features/catalog/components/ProductGrid'
import { CategorySidebar } from '@/features/catalog/components/CategorySidebar'
import { CategoryPillBar } from '@/features/catalog/components/CategoryPillBar'

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? undefined
  const q = searchParams.get('q') ?? undefined
  const hasFilters = Boolean(category || q)

  const { data: products, isLoading, isError, refetch } = useProducts({ category, q })

  const clearFilters = () => {
    setSearchParams({}, { replace: true })
  }

  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : q
      ? `Results for "${q}"`
      : 'All Products'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <CategorySidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">{title}</h1>
              {!isLoading && !isError && products && (
                <p className="text-sm text-neutral-500 mt-0.5">
                  {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <CategoryPillBar />
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  )
}
