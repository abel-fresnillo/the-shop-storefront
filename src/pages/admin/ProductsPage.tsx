import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/features/admin/products/components/ProductsTable'
import { ProductFormModal } from '@/features/admin/products/components/ProductFormModal'
import { DeleteProductDialog } from '@/features/admin/products/components/DeleteProductDialog'
import { useProducts } from '@/features/catalog/hooks/useProducts'
import type { ApiProduct } from '@/api/types'

type FormState = { open: false } | { open: true; product: ApiProduct | undefined }

export function AdminProductsPage() {
  const { data: products, isLoading, isError, refetch } = useProducts()
  const [formState, setFormState] = useState<FormState>({ open: false })
  const [deleteProduct, setDeleteProduct] = useState<ApiProduct | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Products</h1>
          {!isLoading && !isError && products && (
            <p className="text-sm text-neutral-500 mt-0.5">
              {products.length} product{products.length !== 1 ? 's' : ''} in inventory
            </p>
          )}
        </div>
        <Button onClick={() => setFormState({ open: true, product: undefined })} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductsTable
        products={products}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onEdit={(p) => setFormState({ open: true, product: p })}
        onDelete={(p) => setDeleteProduct(p)}
      />

      <ProductFormModal
        open={formState.open}
        onClose={() => setFormState({ open: false })}
        product={formState.open ? formState.product : undefined}
      />

      <DeleteProductDialog product={deleteProduct} onClose={() => setDeleteProduct(null)} />
    </div>
  )
}
