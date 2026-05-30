import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { CartDrawer } from '@/components/CartDrawer'
import { Toaster } from 'sonner'

export function StorefrontLayout() {
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
