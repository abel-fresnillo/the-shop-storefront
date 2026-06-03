# The Shop — Storefront

A React + TypeScript + Vite storefront with a product catalog, shopping cart, and admin panel. Deployed on Vercel with full OpenTelemetry observability shipped to Grafana Cloud.

## Tech stack

| Layer         | Library                                                   |
| ------------- | --------------------------------------------------------- |
| UI            | React 19, Tailwind CSS v4, Radix UI, shadcn/ui primitives |
| Routing       | React Router v7 (lazy-loaded routes)                      |
| Data fetching | TanStack Query v5                                         |
| HTTP client   | Ky v2                                                     |
| State         | Zustand v5 (cart, persisted to `localStorage`)            |
| Forms         | React Hook Form + Zod                                     |
| Observability | OpenTelemetry (traces, metrics, logs) → Grafana Cloud     |
| Testing       | Vitest, Testing Library, MSW v2, Playwright               |
| CI/CD         | GitHub Actions → Vercel                                   |

## Features

**Storefront**

- Product catalog with category sidebar and search
- Stock badge with out-of-stock state
- Product detail page
- Persistent shopping cart (drawer, survives page reloads)

**Admin** (`/admin`)

- Products table with create, edit, and delete
- Form validation with Zod schemas

## Project structure

```
src/
  api/           # Ky client, typed API calls (products, orders)
  config/        # Environment variable validation (throws at startup if VITE_PRODUCT_API_URL is missing)
  features/
    cart/        # Zustand store + cart components
    catalog/     # Product grid, category sidebar, search
    product-detail/
    admin/products/
  observability/ # OTel tracer, logger, and metric instruments
  components/    # Shared layout and UI primitives
  routes/        # createBrowserRouter definition
  mocks/         # MSW handlers and browser/server setup
  instrumentation.ts  # OTel SDK bootstrap (skipped in test env)
api/
  otlp/v1/[signal].ts  # Vercel Edge Function — proxies OTLP to Grafana Cloud
```

## Getting started

```bash
npm install
cp .env.example .env   # fill in required vars (see below)
npm run dev
```

## Environment variables

| Variable                           | Required | Description                                                              |
| ---------------------------------- | -------- | ------------------------------------------------------------------------ |
| `VITE_PRODUCT_API_URL`             | Yes      | Base URL of the product API (`http://localhost:3000/api`)                |
| `VITE_ORDER_SERVICE_URL`           | No       | Base URL of the order service                                            |
| `VITE_ORDER_API_KEY`               | No       | API key sent as `x-api-key` to the order service                         |
| `VITE_PRODUCT_API_KEY`             | No       | API key sent as `x-api-key` to the product API                           |
| `VITE_APP_ENV`                     | No       | `development` \| `production` \| `test`                                  |
| `VITE_OTEL_EXPORTER_OTLP_ENDPOINT` | No       | Set to `/api/otlp` in production; leave blank locally for console export |
| `VITE_OTEL_SERVICE_NAME`           | No       | Defaults to `the-shop-storefront`                                        |

Server-only (Vercel dashboard, never in the JS bundle):

| Variable              | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `GRAFANA_INSTANCE_ID` | Grafana Cloud instance ID                                                |
| `GRAFANA_API_TOKEN`   | Service account token with `metrics:write`, `traces:write`, `logs:write` |

## Observability

`src/instrumentation.ts` boots the OTel SDK on startup (no-op in test environments). All three signals are exported via OTLP HTTP:

- **Traces** — auto-instrumented document load and fetch; manual spans on all API calls via the Ky hooks in `src/api/client.ts`
- **Metrics** — page views, API request counts and duration histograms, cart operations, search queries (exported every 30 s)
- **Logs** — structured logger in `src/observability/logger.ts` wrapping `@opentelemetry/api-logs`

In production, the browser sends OTLP to `/api/otlp`, which is a Vercel Edge Function that injects Grafana credentials server-side and forwards to the Grafana Cloud OTLP gateway. This avoids embedding credentials in the JS bundle and works around Grafana's CORS restrictions on direct browser requests.

## API client

`src/api/client.ts` wraps Ky with:

- Automatic retry on 408/429/5xx (GET only, 2 attempts)
- OTel span creation and metric recording per request
- `Authorization: Bearer <token>` from `sessionStorage` when present
- Typed `ApiError` thrown on non-2xx responses

## Testing

```bash
npm test              # Vitest watch
npm run test:ci       # Vitest with coverage (CI mode)
npm run test:e2e      # Playwright end-to-end
npm run test:e2e:ui   # Playwright with UI runner
```

Tests use MSW v2 for API mocking. The MSW server is started in `src/setupTests.ts`; `localStorage` is cleared between tests. The OTel SDK is skipped when `VITE_APP_ENV=test`.

## CI/CD

**CI** (`.github/workflows/ci.yml`) — runs on push to `development` and PRs to `main`:

1. ESLint (zero warnings)
2. TypeScript type check
3. Vitest with coverage
4. Vite production build

**Security** (`.github/workflows/ci.yml` `security` job):

- `npm audit` (high severity, prod deps only)
- Gitleaks secret detection
- Snyk SCA dependency scan
- Snyk SAST code analysis

**Deploy** (`.github/workflows/deploy.yml`) — runs on push to `main`, deploys to Vercel production via `vercel deploy --prod`.

## Security headers

`vercel.json` sets the following on every response:

- `Strict-Transport-Security` with preload
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricting camera, microphone, geolocation, and payment
- `Content-Security-Policy` (strict; OTLP endpoint whitelisted under `connect-src`)
- `Cache-Control: immutable` on hashed `/assets/*` files
