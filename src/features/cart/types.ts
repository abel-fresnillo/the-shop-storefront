import type { ApiProduct } from '@/api/types'

export interface CartItem {
  product: ApiProduct
  quantity: number
}
