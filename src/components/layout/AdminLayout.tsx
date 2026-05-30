import { NavLink, Outlet } from 'react-router-dom'
import { Package, Store } from 'lucide-react'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'

const navItems = [{ to: '/admin/products', label: 'Products', icon: Package }]

export function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="fixed inset-y-0 left-0 z-40 w-60 bg-neutral-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-white hover:text-green-400 transition-colors"
          >
            <Store className="h-5 w-5 text-green-400" />
            The Shop
          </a>
        </div>
        <p className="px-6 pt-4 pb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Admin
        </p>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-neutral-800 text-white border-l-2 border-green-500 pl-[10px]'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <a href="/" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
            ← Back to Storefront
          </a>
        </div>
      </aside>
      <div className="ml-60 flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
