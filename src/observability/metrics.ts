import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('the-shop-storefront')

export const pageViews = meter.createCounter('storefront.page_views.total', {
  description: 'Total page/route navigation events',
  unit: '{navigation}',
})

export const apiRequests = meter.createCounter('storefront.api_requests.total', {
  description: 'Total outbound API requests',
  unit: '{request}',
})

export const apiRequestDuration = meter.createHistogram('storefront.api_request.duration', {
  description: 'Duration of outbound API requests in milliseconds',
  unit: 'ms',
  advice: { explicitBucketBoundaries: [50, 100, 200, 500, 1000, 2000, 5000] },
})

export const cartOperations = meter.createCounter('storefront.cart_operations.total', {
  description: 'Total cart mutation operations',
  unit: '{operation}',
})

export const searchQueries = meter.createCounter('storefront.search_queries.total', {
  description: 'Total product search queries',
  unit: '{query}',
})
