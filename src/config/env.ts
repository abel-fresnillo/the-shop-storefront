const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is required but not set')
}

if (import.meta.env.PROD && !apiBaseUrl.startsWith('https://')) {
  throw new Error('VITE_API_BASE_URL must use HTTPS in production')
}

export const config = {
  apiBaseUrl: apiBaseUrl.replace(/\/$/, ''), // strip trailing slash
  appEnv: (import.meta.env.VITE_APP_ENV ?? 'development') as string,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
