import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from './mocks/server'

// Provide localStorage for Zustand persist middleware in jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
Object.defineProperty(window, 'sessionStorage', {
  value: { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn() },
})

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  localStorageMock.clear()
})
afterAll(() => server.close())
