import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

const StorePage = lazy(() => import('@/pages/StorePage').then((m) => ({ default: m.StorePage })))
const ProductPage = lazy(() =>
  import('@/pages/ProductPage').then((m) => ({ default: m.ProductPage })),
)
const AdminProductsPage = lazy(() =>
  import('@/pages/admin/ProductsPage').then((m) => ({ default: m.AdminProductsPage })),
)

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <StorefrontLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <StorePage />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <ProductPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <AdminProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminProductsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
        <p className="text-neutral-500 mb-6">Page not found.</p>
        <a href="/" className="text-green-600 hover:underline font-medium">
          Back to store
        </a>
      </div>
    ),
  },
])
