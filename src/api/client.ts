import ky from 'ky'
import { SpanStatusCode } from '@opentelemetry/api'
import { config } from '@/config/env'
import { ApiError } from './types'
import { getTracer } from '@/observability/tracer'
import { apiRequests, apiRequestDuration } from '@/observability/metrics'
import type { Span } from '@opentelemetry/api'

const inflightRequests = new Map<Request, { span: Span; startTime: number }>()

export const apiClient = ky.create({
  prefix: config.productApiUrl,
  timeout: 10_000,
  headers: config.productApiKey ? { 'x-api-key': config.productApiKey } : {},
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

        const url = new URL(request.url)
        const span = getTracer().startSpan(`HTTP ${request.method} ${url.pathname}`, {
          attributes: {
            'http.method': request.method,
            'http.url': request.url,
            'http.host': url.host,
            'http.scheme': url.protocol.replace(':', ''),
            'net.peer.name': url.hostname,
          },
        })
        inflightRequests.set(request, { span, startTime: Date.now() })
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        const entry = inflightRequests.get(request)
        if (entry) {
          const { span, startTime } = entry
          const duration = Date.now() - startTime
          const endpoint = new URL(request.url).pathname
          span.setAttribute('http.status_code', response.status)
          if (!response.ok) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: `HTTP ${response.status}` })
          }
          span.end()
          const attrs = { method: request.method, endpoint, status_code: String(response.status) }
          apiRequests.add(1, attrs)
          apiRequestDuration.record(duration, attrs)
          inflightRequests.delete(request)
        }

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
    beforeError: [
      ({ request, error }) => {
        const entry = inflightRequests.get(request)
        if (entry) {
          const { span, startTime } = entry
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
          span.recordException(error)
          apiRequestDuration.record(Date.now() - startTime, {
            method: request.method,
            endpoint: new URL(request.url).pathname,
            status_code: 'network_error',
          })
          span.end()
          inflightRequests.delete(request)
        }
        return error
      },
    ],
  },
})
