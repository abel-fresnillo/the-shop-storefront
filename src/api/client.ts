import ky from 'ky'
import { config } from '@/config/env'
import { ApiError } from './types'

export const apiClient = ky.create({
  prefix: config.apiBaseUrl,
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = sessionStorage.getItem('auth_token')
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      async ({ response }) => {
        if (!response.ok) {
          let message = `Request failed with status ${response.status}`
          let body: unknown = null
          try {
            body = await response.clone().json()
            if (body && typeof body === 'object' && 'message' in body) {
              message = String((body as Record<string, unknown>).message)
            }
          } catch {
            // non-JSON body
          }
          throw new ApiError(response.status, message, body)
        }
      },
    ],
  },
})
