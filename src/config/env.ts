const productApiUrl = import.meta.env.VITE_PRODUCT_API_URL as string | undefined

if (!productApiUrl) {
  throw new Error('VITE_PRODUCT_API_URL is required but not set')
}

if (import.meta.env.PROD && !productApiUrl.startsWith('https://')) {
  throw new Error('VITE_PRODUCT_API_URL must use HTTPS in production')
}

export const config = {
  productApiUrl: productApiUrl.replace(/\/$/, ''), // strip trailing slash
  appEnv: (import.meta.env.VITE_APP_ENV ?? 'development') as string,
  orderServiceUrl: ((import.meta.env.VITE_ORDER_SERVICE_URL as string | undefined) ?? '').replace(
    /\/$/,
    '',
  ),
  orderApiKey: (import.meta.env.VITE_ORDER_API_KEY as string | undefined) ?? '',
  productApiKey: (import.meta.env.VITE_PRODUCT_API_KEY as string | undefined) ?? '',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
