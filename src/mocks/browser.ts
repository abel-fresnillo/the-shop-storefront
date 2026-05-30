import { setupWorker } from 'msw/browser'
import { productHandlers } from './handlers/products'

export const worker = setupWorker(...productHandlers)
