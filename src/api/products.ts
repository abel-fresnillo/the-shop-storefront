import { apiClient } from './client'
import type { ApiProduct } from './types'

export interface ProductFilters {
  category?: string
  q?: string
}

export const productsApi = {
  list: () => apiClient.get('products').json<ApiProduct[]>(),

  search: (name: string) =>
    apiClient.get('products/search', { searchParams: { name } }).json<ApiProduct[]>(),

  listByCategory: (category: string) =>
    apiClient.get(`products/category/${encodeURIComponent(category)}`).json<ApiProduct[]>(),

  get: (id: string) => apiClient.get(`products/${id}`).json<ApiProduct>(),

  create: (data: Omit<ApiProduct, 'id'>) =>
    apiClient.post('products', { json: data }).json<ApiProduct>(),

  update: (id: string, data: Partial<Omit<ApiProduct, 'id'>>) =>
    apiClient.patch(`products/${id}`, { json: data }).json<ApiProduct>(),

  delete: (id: string) => apiClient.delete(`products/${id}`).then(() => undefined),
}
