import { useQuery } from '@tanstack/react-query'
import { productsApi, type ProductFilters } from '@/api/products'

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
}

export function useProducts(filters: ProductFilters = {}) {
  const { category, q } = filters

  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      // Both filters active: search by name, then filter client-side by category
      if (q && category) {
        const results = await productsApi.search(q)
        return results.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      }
      if (q) return productsApi.search(q)
      if (category) return productsApi.listByCategory(category)
      return productsApi.list()
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.get(id),
    enabled: Boolean(id),
  })
}
