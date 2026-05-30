export const CATEGORIES = [
  'Dairy',
  'Produce',
  'Bakery',
  'Beverages',
  'Snacks',
  'Frozen',
  'Meat',
  'Pantry',
  'Other',
] as const

export const UNITS = [
  'each',
  'lb',
  'kg',
  'oz',
  'gallon',
  'liter',
  'dozen',
  'pack',
  'bag',
  'box',
  'bottle',
  'can',
] as const

export const LOW_STOCK_THRESHOLD = 5

export const CATEGORY_EMOJIS: Record<string, string> = {
  dairy: '🥛',
  produce: '🥦',
  bakery: '🍞',
  beverages: '🥤',
  snacks: '🍿',
  frozen: '🧊',
  meat: '🥩',
  pantry: '🥫',
  other: '📦',
}

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? '📦'
}
