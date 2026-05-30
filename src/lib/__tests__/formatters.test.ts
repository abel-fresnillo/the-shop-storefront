import { describe, it, expect } from 'vitest'
import { formatPrice, formatUnit, formatPricePerUnit } from '../formatters'

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats a whole number as USD currency', () => {
      expect(formatPrice(3)).toBe('$3.00')
    })

    it('formats a decimal as USD currency', () => {
      expect(formatPrice(3.49)).toBe('$3.49')
    })

    it('formats zero', () => {
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('formats large numbers with commas', () => {
      expect(formatPrice(1234.56)).toBe('$1,234.56')
    })
  })

  describe('formatUnit', () => {
    it('lowercases the unit', () => {
      expect(formatUnit('Gallon')).toBe('gallon')
    })

    it('keeps lowercase as-is', () => {
      expect(formatUnit('lb')).toBe('lb')
    })
  })

  describe('formatPricePerUnit', () => {
    it('combines price and unit', () => {
      expect(formatPricePerUnit(3.49, 'gallon')).toBe('$3.49 / gallon')
    })
  })
})
