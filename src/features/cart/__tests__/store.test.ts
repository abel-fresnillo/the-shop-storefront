import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../store'
import type { ApiProduct } from '@/api/types'

const milk: ApiProduct = {
  id: '1',
  name: 'Whole Milk',
  category: 'dairy',
  price: 3.49,
  unit: 'gallon',
  stock: 10,
}
const eggs: ApiProduct = {
  id: '2',
  name: 'Large Eggs',
  category: 'produce',
  price: 4.99,
  unit: 'dozen',
  stock: 5,
}

function getStore() {
  return useCartStore.getState()
}

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false })
})

describe('cart store', () => {
  it('starts empty', () => {
    expect(getStore().items).toHaveLength(0)
    expect(getStore().totalItems()).toBe(0)
    expect(getStore().subtotal()).toBe(0)
  })

  it('adds an item', () => {
    getStore().addItem(milk)
    expect(getStore().items).toHaveLength(1)
    expect(getStore().items[0].quantity).toBe(1)
    expect(getStore().totalItems()).toBe(1)
  })

  it('adds item with custom quantity', () => {
    getStore().addItem(milk, 3)
    expect(getStore().items[0].quantity).toBe(3)
  })

  it('increments quantity when same product added again', () => {
    getStore().addItem(milk, 2)
    getStore().addItem(milk, 3)
    expect(getStore().items).toHaveLength(1)
    expect(getStore().items[0].quantity).toBe(5)
  })

  it('does not exceed stock when adding', () => {
    getStore().addItem(milk, 100)
    expect(getStore().items[0].quantity).toBe(milk.stock)
  })

  it('does not add out-of-stock product', () => {
    const noStock: ApiProduct = { ...milk, stock: 0 }
    getStore().addItem(noStock)
    expect(getStore().items).toHaveLength(0)
  })

  it('calculates correct subtotal', () => {
    getStore().addItem(milk, 2)
    getStore().addItem(eggs, 1)
    expect(getStore().subtotal()).toBeCloseTo(milk.price * 2 + eggs.price)
  })

  it('removes an item', () => {
    getStore().addItem(milk)
    getStore().addItem(eggs)
    getStore().removeItem(milk.id)
    expect(getStore().items).toHaveLength(1)
    expect(getStore().items[0].product.id).toBe(eggs.id)
  })

  it('removes item when updateQuantity is called with 0', () => {
    getStore().addItem(milk)
    getStore().updateQuantity(milk.id, 0)
    expect(getStore().items).toHaveLength(0)
  })

  it('updates quantity', () => {
    getStore().addItem(milk, 3)
    getStore().updateQuantity(milk.id, 7)
    expect(getStore().items[0].quantity).toBe(7)
  })

  it('does not exceed stock when updating quantity', () => {
    getStore().addItem(milk)
    getStore().updateQuantity(milk.id, 100)
    expect(getStore().items[0].quantity).toBe(milk.stock)
  })

  it('clears the cart', () => {
    getStore().addItem(milk)
    getStore().addItem(eggs)
    getStore().clearCart()
    expect(getStore().items).toHaveLength(0)
    expect(getStore().totalItems()).toBe(0)
  })

  it('opens and closes the cart drawer', () => {
    expect(getStore().isOpen).toBe(false)
    getStore().openCart()
    expect(getStore().isOpen).toBe(true)
    getStore().closeCart()
    expect(getStore().isOpen).toBe(false)
  })
})
