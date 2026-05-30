import { test, expect } from '@playwright/test'

// Note: These tests require a running API at VITE_API_BASE_URL.
// In CI they run against a staging API; locally they show the error state.

test.describe('Storefront', () => {
  test('home page loads with header and category sidebar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByText('The Shop')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Category filter' })).toBeVisible()
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('skip-to-content link is focusable', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toBeFocused()
  })

  test('cart drawer opens and closes', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /open cart/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Your Cart')).toBeVisible()
    await page.getByRole('button', { name: /close cart/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('category filter updates URL', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Dairy', exact: true }).first().click()
    await expect(page).toHaveURL(/category=dairy/)
  })

  test('admin page loads with sidebar and Add Product button', async ({ page }) => {
    await page.goto('/admin/products')
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible()
    await expect(page.getByRole('button', { name: /add product/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /the shop/i })).toBeVisible()
  })

  test('admin Add Product button opens modal', async ({ page }) => {
    await page.goto('/admin/products')
    await page.getByRole('button', { name: /add product/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Add Product' })).toBeVisible()
    // Close with Escape
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('404 page renders for unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByRole('link', { name: /back to store/i })).toBeVisible()
  })
})
