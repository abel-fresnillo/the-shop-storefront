import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useDeleteProduct } from '../hooks/useMutateProduct'
import type { ApiProduct } from '@/api/types'

interface DeleteProductDialogProps {
  product: ApiProduct | null
  onClose: () => void
}

export function DeleteProductDialog({ product, onClose }: DeleteProductDialogProps) {
  const deleteMutation = useDeleteProduct()

  const handleConfirm = async () => {
    if (!product) return
    try {
      await deleteMutation.mutateAsync(product.id)
      toast.success(`"${product.name}" deleted`)
      onClose()
    } catch {
      toast.error('Failed to delete product. Please try again.')
    }
  }

  return (
    <AlertDialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>&ldquo;{product?.name}&rdquo;</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
