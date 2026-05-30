import { Button } from './ui/button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-neutral-300">{icon}</div>
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}
