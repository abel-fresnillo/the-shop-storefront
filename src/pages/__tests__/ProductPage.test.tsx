import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { resetProductStore } from '@/mocks/handlers/products'
import { render } from '@/test-utils'
import { ProductPage } from '../ProductPage'
import { useCartStore } from '@/features/cart/store'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useParams: vi.fn(() => ({ id: '1' })) }
})

import { useParams } from 'react-router-dom'
const mockUseParams = vi.mocked(useParams)

beforeEach(() => {
  resetProductStore()
  useCartStore.setState({ items: [], isOpen: false })
  mockUseParams.mockReturnValue({ id: '1' })
})

describe('ProductPage', () => {
  it('renders product details after loading', async () => {
    render(<ProductPage />)
    await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    expect(screen.getByText(/dairy/i)).toBeInTheDocument()
    expect(screen.getByText('$3.49')).toBeInTheDocument()
  })

  it('shows 404 message when product does not exist', async () => {
    mockUseParams.mockReturnValue({ id: '999' })
    render(<ProductPage />)
    await screen.findByText('Product not found', {}, { timeout: 5000 })
    expect(screen.getByRole('link', { name: /browse products/i })).toBeInTheDocument()
  })

  it('shows error message on 500 from API', async () => {
    server.use(http.get('*/products/:id', () => new HttpResponse(null, { status: 500 })))
    render(<ProductPage />)
    await screen.findByText('Failed to load product', {}, { timeout: 5000 })
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows out-of-stock message for stock=0 product', async () => {
    mockUseParams.mockReturnValue({ id: '3' }) // Fuji Apples, stock: 0
    render(<ProductPage />)
    await screen.findByText('Fuji Apples', {}, { timeout: 5000 })
    expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument()
    expect(screen.getByText(/currently out of stock/i)).toBeInTheDocument()
  })

  it('add to cart adds product to cart store', async () => {
    const user = userEvent.setup()
    render(<ProductPage />)
    await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(useCartStore.getState().totalItems()).toBe(1)
    expect(useCartStore.getState().items[0].product.name).toBe('Whole Milk')
  })

  it('increase quantity button disables at stock limit', async () => {
    mockUseParams.mockReturnValue({ id: '4' }) // Sourdough Bread, stock: 3
    const user = userEvent.setup()
    render(<ProductPage />)
    await screen.findByText('Sourdough Bread', {}, { timeout: 5000 })
    const increaseBtn = screen.getByRole('button', { name: /increase quantity/i })
    await user.click(increaseBtn) // 2
    await user.click(increaseBtn) // 3
    expect(increaseBtn).toBeDisabled()
  })

  it('has a back link to the product list', async () => {
    render(<ProductPage />)
    await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    expect(screen.getByRole('link', { name: /back to products/i })).toBeInTheDocument()
  })
})
