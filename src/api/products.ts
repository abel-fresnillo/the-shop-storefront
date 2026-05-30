import { apiClient } from './client'
import type { ApiProduct } from './types'

export interface ProductFilters {
  category?: string
  q?: string
}

export const productsApi = {
  list: (filters: ProductFilters = {}) => {
    const params: Record<string, string> = {}
    if (filters.category) params.category = filters.category
    if (filters.q) params.q = filters.q
    return apiClient.get('products', { searchParams: params }).json<ApiProduct[]>()
  },

  get: (id: string) => apiClient.get(`products/${id}`).json<ApiProduct>(),

  create: (data: Omit<ApiProduct, 'id'>) =>
    apiClient.post('products', { json: data }).json<ApiProduct>(),

  update: (id: string, data: Partial<Omit<ApiProduct, 'id'>>) =>
    apiClient.patch(`products/${id}`, { json: data }).json<ApiProduct>(),

  delete: (id: string) => apiClient.delete(`products/${id}`).then(() => undefined),
}
