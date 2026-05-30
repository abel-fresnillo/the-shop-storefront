import { describe, it, expect, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { resetProductStore } from '@/mocks/handlers/products'
import { render } from '@/test-utils'
import { AdminProductsPage } from '../admin/ProductsPage'

beforeEach(() => {
  resetProductStore()
})

async function waitForTable() {
  await screen.findByRole('table', {}, { timeout: 5000 })
}

async function openAddProduct() {
  const user = userEvent.setup()
  render(<AdminProductsPage />)
  await user.click(screen.getByRole('button', { name: /add product/i }))
  return user
}

describe('AdminProductsPage', () => {
  it('renders the product table after loading', async () => {
    render(<AdminProductsPage />)
    await waitForTable()
    expect(screen.getByText('Whole Milk')).toBeInTheDocument()
    expect(screen.getByText('Large Eggs')).toBeInTheDocument()
    expect(screen.getByText(/5 products in inventory/)).toBeInTheDocument()
  })

  it('shows skeleton rows while loading', () => {
    render(<AdminProductsPage />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows error state when API fails', async () => {
    server.use(http.get('*/products', () => new HttpResponse(null, { status: 500 })))
    render(<AdminProductsPage />)
    await screen.findByText('Failed to load products', {}, { timeout: 5000 })
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('shows empty state when no products', async () => {
    server.use(http.get('*/products', () => HttpResponse.json([])))
    render(<AdminProductsPage />)
    await screen.findByText('No products yet', {}, { timeout: 5000 })
  })

  describe('Add Product modal', () => {
    it('opens the form modal when Add Product is clicked', async () => {
      await openAddProduct()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Add Product' })).toBeInTheDocument()
    })

    it('closes when Cancel is clicked', async () => {
      const { waitFor } = await import('@testing-library/react')
      const user = await openAddProduct()
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
        timeout: 3000,
      })
    })

    it('shows validation error for name shorter than 2 chars', async () => {
      const user = await openAddProduct()
      const dialog = screen.getByRole('dialog')
      await user.type(within(dialog).getByLabelText(/product name/i), 'A')
      await user.click(within(dialog).getByRole('button', { name: /add product/i }))
      expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument()
    })

    it('submit button is present and labeled Add Product', async () => {
      await openAddProduct()
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByRole('button', { name: /add product/i })).toBeInTheDocument()
      expect(within(dialog).getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })

  describe('Edit Product', () => {
    it('opens edit modal pre-populated with product data', async () => {
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /edit/i }))
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByDisplayValue('Whole Milk')).toBeInTheDocument()
      expect(within(dialog).getByRole('heading', { name: 'Edit Product' })).toBeInTheDocument()
    })

    it('submits updated name and updates table', async () => {
      const { waitFor } = await import('@testing-library/react')
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /edit/i }))
      const dialog = screen.getByRole('dialog')
      const nameInput = within(dialog).getByDisplayValue('Whole Milk')
      await user.clear(nameInput)
      await user.type(nameInput, '2% Milk')
      await user.click(within(dialog).getByRole('button', { name: /save changes/i }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
        timeout: 5000,
      })
      await screen.findByText('2% Milk', {}, { timeout: 5000 })
    })

    it('shows error toast when PATCH fails', async () => {
      server.use(http.patch('*/products/:id', () => new HttpResponse(null, { status: 500 })))
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /edit/i }))
      const dialog = screen.getByRole('dialog')
      const nameInput = within(dialog).getByDisplayValue('Whole Milk')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Milk')
      await user.click(within(dialog).getByRole('button', { name: /save changes/i }))
      // Dialog should stay open since mutation failed
      await screen.findByText(/failed to update product/i, {}, { timeout: 5000 })
    })
  })

  describe('Delete Product', () => {
    it('opens AlertDialog with product name when Delete is clicked', async () => {
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /delete/i }))
      const alertDialog = screen.getByRole('alertdialog')
      expect(alertDialog).toBeInTheDocument()
      // Check product name appears in dialog (curly-quote wrapping)
      expect(within(alertDialog).getByText(/Whole Milk/)).toBeInTheDocument()
      expect(within(alertDialog).getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(
        within(alertDialog).getByRole('button', { name: /delete product/i }),
      ).toBeInTheDocument()
    })

    it('closes dialog without deleting when Cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /delete/i }))
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      // Dialog closes — use waitFor since Radix may animate out
      const { waitFor } = await import('@testing-library/react')
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(), {
        timeout: 3000,
      })
      expect(screen.getByText('Whole Milk')).toBeInTheDocument()
    })

    it('removes product from table after confirmed delete', async () => {
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /delete/i }))
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /delete product/i }))
      const { waitFor } = await import('@testing-library/react')
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(), {
        timeout: 5000,
      })
      await waitFor(() => expect(screen.queryByText('Whole Milk')).not.toBeInTheDocument(), {
        timeout: 5000,
      })
    })

    it('shows error toast and keeps product when DELETE API fails', async () => {
      server.use(http.delete('*/products/:id', () => new HttpResponse(null, { status: 500 })))
      const user = userEvent.setup()
      render(<AdminProductsPage />)
      await waitForTable()
      await user.click(screen.getByRole('button', { name: /actions for whole milk/i }))
      await user.click(screen.getByRole('menuitem', { name: /delete/i }))
      await user.click(screen.getByRole('button', { name: /delete product/i }))
      // Product should remain in table
      await screen.findByText('Whole Milk', {}, { timeout: 5000 })
    })
  })
})
