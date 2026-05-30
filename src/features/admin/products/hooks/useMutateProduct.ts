import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/api/products'
import { productKeys } from '@/features/catalog/hooks/useProducts'
import type { ApiProduct } from '@/api/types'

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<ApiProduct, 'id'>) => productsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Omit<ApiProduct, 'id'>>) => productsApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      qc.setQueryData(productKeys.detail(id), updated)
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  })
}
