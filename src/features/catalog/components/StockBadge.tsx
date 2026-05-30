import { Badge } from '@/components/ui/badge'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants'

interface StockBadgeProps {
  stock: number
  showCount?: boolean
}

export function StockBadge({ stock, showCount = false }: StockBadgeProps) {
  if (stock === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <Badge variant="warning">{showCount ? `Only ${stock} left` : 'Low Stock'}</Badge>
  }
  return showCount ? null : <Badge>In Stock</Badge>
}
