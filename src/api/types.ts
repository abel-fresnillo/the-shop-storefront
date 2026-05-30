export interface ApiProduct {
  id: string
  name: string
  category: string
  price: number
  unit: string
  stock: number
}

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }

  isNotFound() {
    return this.status === 404
  }
  isUnauthorized() {
    return this.status === 401
  }
  isValidation() {
    return this.status === 422
  }
}
