import { useSearchParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { CATEGORIES, getCategoryEmoji } from '@/lib/constants'

export function CategoryPillBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')?.toLowerCase() ?? ''

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    params.delete('q')
    setSearchParams(params, { replace: true })
  }

  const items = [
    { label: 'All', value: '', emoji: null },
    ...CATEGORIES.map((c) => ({ label: c, value: c.toLowerCase(), emoji: getCategoryEmoji(c) })),
  ]

  return (
    <div className="md:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto snap-x snap-mandatory mb-4">
      <div className="flex gap-2 pb-3 w-max">
        {items.map(({ label, value, emoji }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            aria-current={currentCategory === value ? 'true' : undefined}
            className={cn(
              'flex items-center gap-1.5 px-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] snap-start touch-manipulation',
              currentCategory === value
                ? 'bg-green-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-green-400 hover:text-green-700',
            )}
          >
            {emoji && <span aria-hidden="true">{emoji}</span>}
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
