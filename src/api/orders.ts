import ky from 'ky'
import { config } from '@/config/env'
import { ApiError } from './types'
import type { CartItem } from '@/features/cart/types'

const orderClient = ky.create({
  timeout: 10_000,
  headers: { 'x-api-key': config.orderApiKey },
  hooks: {
    afterResponse: [
      async ({ response }) => {
        if (!response.ok) {
          let message = `Request failed with status ${response.status}`
          let body: unknown = null
          try {
            body = await response.clone().json()
            const b = body as Record<string, unknown>
            if ('message' in b) message = String(b.message)
            else if ('error' in b) message = String(b.error)
          } catch {
            // non-JSON body
          }
          throw new ApiError(response.status, message, body)
        }
      },
    ],
  },
})

export interface OrderPayload {
  items: Array<{ name: string; quantity: number; price: number }>
}

export interface OrderResponse {
  orderId: string
  status: string
}

export async function submitOrder(cartItems: CartItem[]): Promise<OrderResponse> {
  const payload: OrderPayload = {
    items: cartItems.map(({ product, quantity }) => ({
      name: product.name,
      quantity,
      price: product.price,
    })),
  }

  return orderClient
    .post(`${config.orderServiceUrl}/orders`, { json: payload })
    .json<OrderResponse>()
}
