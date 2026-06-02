import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { CartDrawer } from '@/components/CartDrawer'
import { Toaster } from 'sonner'
import { pageViews } from '@/observability/metrics'

export function StorefrontLayout() {
  const location = useLocation()
  useEffect(() => {
    pageViews.add(1, { route: location.pathname })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <CartDrawer />
      <main id="main-content" className="pt-16">
        <Outlet />
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
