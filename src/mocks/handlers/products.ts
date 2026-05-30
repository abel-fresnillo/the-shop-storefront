import { http, HttpResponse } from 'msw'
import type { ApiProduct } from '@/api/types'

let nextId = 100

export function resetProductStore() {
  store.clear()
  nextId = 100
  seedData.forEach((p) => store.set(p.id, p))
}

const seedData: ApiProduct[] = [
  { id: '1', name: 'Whole Milk', category: 'dairy', price: 3.49, unit: 'gallon', stock: 50 },
  { id: '2', name: 'Large Eggs', category: 'produce', price: 4.99, unit: 'dozen', stock: 12 },
  { id: '3', name: 'Fuji Apples', category: 'produce', price: 1.29, unit: 'lb', stock: 0 },
  { id: '4', name: 'Sourdough Bread', category: 'bakery', price: 5.99, unit: 'each', stock: 3 },
  { id: '5', name: 'Orange Juice', category: 'beverages', price: 3.99, unit: 'gallon', stock: 20 },
]

const store = new Map<string, ApiProduct>(seedData.map((p) => [p.id, p]))

export const productHandlers = [
  http.get('*/products', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const q = url.searchParams.get('q')?.toLowerCase()
    let items = Array.from(store.values())
    if (category) items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    if (q)
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      )
    return HttpResponse.json(items)
  }),

  http.get('*/products/:id', ({ params }) => {
    const product = store.get(params.id as string)
    if (!product) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(product)
  }),

  http.post('*/products', async ({ request }) => {
    const body = (await request.json()) as Omit<ApiProduct, 'id'>
    const id = String(++nextId)
    const product: ApiProduct = { ...body, id }
    store.set(id, product)
    return HttpResponse.json(product, { status: 201 })
  }),

  http.patch('*/products/:id', async ({ params, request }) => {
    const existing = store.get(params.id as string)
    if (!existing) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as Partial<ApiProduct>
    const updated = { ...existing, ...body, id: existing.id }
    store.set(existing.id, updated)
    return HttpResponse.json(updated)
  }),

  http.delete('*/products/:id', ({ params }) => {
    const existed = store.delete(params.id as string)
    if (!existed) return new HttpResponse(null, { status: 404 })
    return new HttpResponse(null, { status: 204 })
  }),
]
