import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { resetProductStore } from '@/mocks/handlers/products'
import { render } from '@/test-utils'
import { StorePage } from '../StorePage'
import { useCartStore } from '@/features/cart/store'

beforeEach(() => {
  resetProductStore()
  useCartStore.setState({ items: [], isOpen: false })
})

describe('StorePage', () => {
  it('shows skeleton loading state then product cards', async () => {
    render(<StorePage />)
    expect(screen.getByLabelText('Loading products')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByLabelText('Loading products'), {
      timeout: 5000,
    })
    expect(screen.getByText('Whole Milk')).toBeInTheDocument()
    expect(screen.getByText('Large Eggs')).toBeInTheDocument()
    expect(screen.getByText('Fuji Apples')).toBeInTheDocument()
  })

  it('shows product count after loading', async () => {
    render(<StorePage />)
    await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    expect(screen.getByText(/5 products/)).toBeInTheDocument()
  })

  it('shows empty state when no products exist', async () => {
    server.use(http.get('*/products', () => HttpResponse.json([])))
    render(<StorePage />)
    await screen.findByText('No products yet', {}, { timeout: 5000 })
  })

  it('shows error state and retry button when API fails', async () => {
    server.use(http.get('*/products', () => new HttpResponse(null, { status: 500 })))
    render(<StorePage />)
    await screen.findByText('Failed to load products', {}, { timeout: 5000 })
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows "no products found" when filters return empty', async () => {
    server.use(http.get('*/products', () => HttpResponse.json([])))
    render(<StorePage />, { initialEntries: ['/?q=xyz'] })
    await screen.findByText('No products found', {}, { timeout: 5000 })
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('shows category name in heading', async () => {
    render(<StorePage />, { initialEntries: ['/?category=dairy'] })
    await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    expect(screen.getByRole('heading', { name: 'Dairy' })).toBeInTheDocument()
  })

  it('shows search term in heading', async () => {
    render(<StorePage />, { initialEntries: ['/?q=milk'] })
    // Just check the heading — server-side filtering would happen via URL params
    expect(screen.getByRole('heading', { name: /Results for "milk"/ })).toBeInTheDocument()
  })

  it('out-of-stock product card has disabled button', async () => {
    render(<StorePage />)
    await screen.findByText('Fuji Apples', {}, { timeout: 5000 })
    const appleCard = screen.getByText('Fuji Apples').closest('a')!
    const btn = within(appleCard).getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveTextContent('Out of Stock')
  })

  it('clicking Add to Cart adds item to cart store', async () => {
    const user = userEvent.setup()
    render(<StorePage />)
    await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    const milkCard = screen.getByText('Whole Milk').closest('a')!
    const addBtn = within(milkCard).getByRole('button', { name: /add whole milk to cart/i })
    await user.click(addBtn)
    expect(useCartStore.getState().totalItems()).toBe(1)
    expect(useCartStore.getState().items[0].product.name).toBe('Whole Milk')
  })
})
