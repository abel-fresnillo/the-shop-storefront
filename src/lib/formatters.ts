export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatUnit(unit: string): string {
  return unit.toLowerCase()
}

export function formatPricePerUnit(price: number, unit: string): string {
  return `${formatPrice(price)} / ${formatUnit(unit)}`
}
