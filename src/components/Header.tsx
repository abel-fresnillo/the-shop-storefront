import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Store } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useCart } from '@/features/cart/hooks/useCart'
import { CATEGORIES } from '@/lib/constants'

export function Header() {
  const { totalItems, openCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Controlled input so it stays in sync when URL params change externally
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '')
  }, [searchParams])

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams)
        if (value) {
          params.set('q', value)
          params.delete('category') // search is global — clear any active category
        } else {
          params.delete('q')
        }
        navigate({ pathname: '/', search: params.toString() }, { replace: true })
      }, 300)
    },
    [searchParams, navigate],
  )

  const currentCategory = searchParams.get('category') ?? ''

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-900 text-white shadow-lg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-green-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 font-bold text-lg hover:text-green-400 transition-colors"
          >
            <Store className="h-6 w-6 text-green-400" />
            The Shop
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1">
            <Button
              variant={!currentCategory ? 'secondary' : 'ghost'}
              size="sm"
              className={
                !currentCategory
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.delete('category')
                setSearchParams(params, { replace: true })
              }}
            >
              All
            </Button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                className={
                  currentCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.set('category', cat.toLowerCase())
                  params.delete('q') // category browsing replaces search
                  setSearchParams(params, { replace: true })
                  navigate({ pathname: '/', search: params.toString() })
                }}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex-1 md:flex-none md:w-64">
            <Input
              type="search"
              placeholder="Search products…"
              value={searchValue}
              onChange={handleSearch}
              aria-label="Search products"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative text-neutral-300 hover:text-white hover:bg-neutral-800 shrink-0 h-11 w-11 touch-manipulation"
            aria-label={`Open cart, ${totalItems} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-[11px] font-bold flex items-center justify-center text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
