import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CATEGORIES, UNITS } from '@/lib/constants'
import { useCreateProduct, useUpdateProduct } from '../hooks/useMutateProduct'
import type { ApiProduct } from '@/api/types'

const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  category: z.string().min(1, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  price: z.number({ error: 'Price must be a valid number' }).min(0, 'Price must be 0 or more'),
  stock: z
    .number({ error: 'Stock must be a valid number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock must be 0 or more'),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  product?: ApiProduct
}

export function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const isEdit = Boolean(product)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          unit: product.unit,
          price: product.price,
          stock: product.stock,
        }
      : { name: '', category: '', unit: '', price: 0, stock: 0 },
  })

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct(product?.id ?? '')
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        category: product.category,
        unit: product.unit,
        price: product.price,
        stock: product.stock,
      })
    } else if (open && !product) {
      reset({ name: '', category: '', unit: '', price: 0, stock: 0 })
    }
  }, [open, product, reset])

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync(data)
        toast.success('Product updated successfully')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Product created successfully')
      }
      onClose()
    } catch {
      toast.error(isEdit ? 'Failed to update product' : 'Failed to create product')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Product Name{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Whole Milk, Large Eggs"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p id="name-error" role="alert" className="text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">
                Category{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              </Label>
              <Select
                value={watch('category')}
                onValueChange={(v) => setValue('category', v, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="category"
                  aria-required="true"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p id="category-error" role="alert" className="text-xs text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="unit">
                Unit{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              </Label>
              <Select
                value={watch('unit')}
                onValueChange={(v) => setValue('unit', v, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="unit"
                  aria-required="true"
                  aria-invalid={Boolean(errors.unit)}
                  aria-describedby={errors.unit ? 'unit-error' : undefined}
                >
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p id="unit-error" role="alert" className="text-xs text-red-600">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">
                Price (USD){' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7"
                  placeholder="0.00"
                  aria-required="true"
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? 'price-error' : undefined}
                  {...register('price', { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <p id="price-error" role="alert" className="text-xs text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock">
                Stock Quantity{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                aria-required="true"
                aria-invalid={Boolean(errors.stock)}
                aria-describedby={errors.stock ? 'stock-error' : undefined}
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && (
                <p id="stock-error" role="alert" className="text-xs text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
