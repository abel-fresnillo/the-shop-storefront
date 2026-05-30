import { setupServer } from 'msw/node'
import { productHandlers } from './handlers/products'

export const server = setupServer(...productHandlers)
