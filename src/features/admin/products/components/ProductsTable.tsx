import { useState, useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlertCircle,
  Package,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatPrice } from '@/lib/formatters'
import { StockBadge } from '@/features/catalog/components/StockBadge'
import type { ApiProduct } from '@/api/types'

const col = createColumnHelper<ApiProduct>()

interface ProductsTableProps {
  products: ApiProduct[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onEdit: (product: ApiProduct) => void
  onDelete: (product: ApiProduct) => void
}

export function ProductsTable({
  products,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      col.accessor('name', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
            onClick={() => column.toggleSorting()}
            aria-sort={
              column.getIsSorted() === 'asc'
                ? 'ascending'
                : column.getIsSorted() === 'desc'
                  ? 'descending'
                  : 'none'
            }
          >
            Name <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: (info) => <span className="font-medium text-neutral-900">{info.getValue()}</span>,
      }),
      col.accessor('category', {
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Category
          </span>
        ),
        cell: (info) => <span className="capitalize text-neutral-600">{info.getValue()}</span>,
      }),
      col.accessor('price', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
            onClick={() => column.toggleSorting()}
            aria-sort={
              column.getIsSorted() === 'asc'
                ? 'ascending'
                : column.getIsSorted() === 'desc'
                  ? 'descending'
                  : 'none'
            }
          >
            Price <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono text-sm text-neutral-900">{formatPrice(info.getValue())}</span>
        ),
      }),
      col.accessor('unit', {
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Unit
          </span>
        ),
        cell: (info) => <span className="text-neutral-600">{info.getValue()}</span>,
      }),
      col.accessor('stock', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
            onClick={() => column.toggleSorting()}
            aria-sort={
              column.getIsSorted() === 'asc'
                ? 'ascending'
                : column.getIsSorted() === 'desc'
                  ? 'descending'
                  : 'none'
            }
          >
            Stock <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="tabular-nums text-sm">{info.getValue()}</span>
            <StockBadge stock={info.getValue()} />
          </div>
        ),
      }),
      col.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={`Actions for ${row.original.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="gap-2 cursor-pointer"
              >
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [onEdit, onDelete],
  )

  const table = useReactTable({
    data: products ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <p className="font-medium text-neutral-900">Failed to load products</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-10 w-10 text-neutral-300 mb-3" />
        <p className="font-medium text-neutral-900">No products yet</p>
        <p className="text-sm text-neutral-500 mt-1">Add your first product to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-sm" aria-label="Products">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left first:pl-6 last:pr-6">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-neutral-50 transition-colors ${row.original.stock === 0 ? 'bg-red-50/50' : row.original.stock <= 5 ? 'bg-amber-50/50' : ''}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 first:pl-6 last:pr-6">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
