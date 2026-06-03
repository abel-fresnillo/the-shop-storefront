export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const grafanaPath = url.pathname.replace('/api/otlp', '/otlp')
  const targetUrl = `https://otlp-gateway-prod-us-east-3.grafana.net${grafanaPath}`

  const instanceId = process.env.GRAFANA_INSTANCE_ID
  const apiToken = process.env.GRAFANA_API_TOKEN

  const headers = new Headers(request.headers)
  headers.delete('host')
  if (instanceId && apiToken) {
    headers.set('Authorization', `Basic ${btoa(`${instanceId}:${apiToken}`)}`)
  }

  const body =
    request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined

  return fetch(targetUrl, { method: request.method, headers, body })
}
