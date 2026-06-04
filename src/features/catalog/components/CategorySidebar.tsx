import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { CATEGORIES, getCategoryEmoji } from '@/lib/constants'

export function CategorySidebar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')?.toLowerCase() ?? ''

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('q') // category browsing replaces search
    setSearchParams(params, { replace: true })
  }

  const items = [
    { label: 'All Products', value: '' },
    ...CATEGORIES.map((c) => ({ label: c, value: c.toLowerCase() })),
  ]

  return (
    <aside className="hidden md:block w-52 shrink-0" aria-label="Category filter">
      <div className="bg-white rounded-xl border border-neutral-200 p-3 sticky top-24">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 mb-2">
          Categories
        </p>
        <nav className="space-y-0.5">
          {items.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left touch-manipulation',
                currentCategory === value
                  ? 'bg-green-50 text-green-700 font-medium border-l-2 border-green-600 pl-[10px]'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
              )}
              aria-current={currentCategory === value ? 'true' : undefined}
            >
              {value && <span aria-hidden="true">{getCategoryEmoji(value)}</span>}
              {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
