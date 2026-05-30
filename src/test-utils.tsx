import { type ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface WrapperProps {
  children: ReactNode
  initialEntries?: string[]
}

function AllProviders({ children, initialEntries = ['/'] }: WrapperProps) {
  const qc = makeQueryClient()
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] },
) {
  const { initialEntries, ...rest } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...rest,
  })
}

export * from '@testing-library/react'
export { customRender as render }
