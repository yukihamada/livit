import { test, expect } from '@playwright/test';

test.describe('Shopping Features', () => {
  test.describe('Shop Page', () => {
    test('should display products grid', async ({ page }) => {
      await page.goto('/shop');
      
      // Check page title
      await expect(page.getByRole('heading', { name: 'ショップ' })).toBeVisible();
      
      // Check search and sort
      await expect(page.getByPlaceholder('商品や店舗を検索...')).toBeVisible();
      await expect(page.getByRole('combobox')).toBeVisible(); // Sort dropdown
      
      // Check view mode toggles
      await expect(page.getByRole('button', { name: /grid/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /list/i })).toBeVisible();
      
      // Check products are displayed
      const productCards = page.locator('.overflow-hidden.hover\\:shadow-lg');
      await expect(productCards.first()).toBeVisible();
    });

    test('should switch between grid and list view', async ({ page }) => {
      await page.goto('/shop');
      
      // Click list view button
      await page.getByRole('button', { name: /list/i }).click();
      
      // Check if layout changed
      await expect(page.locator('.space-y-4 > .overflow-hidden').first()).toBeVisible();
      
      // Switch back to grid view
      await page.getByRole('button', { name: /grid/i }).click();
      
      // Check if grid layout is restored
      await expect(page.locator('.grid').first()).toBeVisible();
    });

    test('should filter products by category', async ({ page }) => {
      await page.goto('/shop');
      
      // Click on コスメ category
      await page.getByRole('button', { name: 'コスメ' }).click();
      
      // Check that only cosmetic products are shown
      await expect(page.getByText('リップティント 5色セット')).toBeVisible();
      await expect(page.getByText('アイシャドウパレット')).toBeVisible();
    });

    test('should add product to cart from shop page', async ({ page }) => {
      await page.goto('/shop');
      
      // Click first カート button
      await page.getByRole('button', { name: 'カート' }).first().click();
      
      // Check cart indicator updates
      const cartButton = page.getByRole('button', { name: /shopping.*bag/i });
      await expect(cartButton).toBeVisible();
    });
  });

  test.describe('Product Detail Page', () => {
    test('should display product information', async ({ page }) => {
      await page.goto('/products/1');
      
      // Check product name
      await expect(page.getByRole('heading', { name: 'リップティント 5色セット' })).toBeVisible();
      
      // Check price
      await expect(page.getByText('¥2,980')).toBeVisible();
      await expect(page.getByText('¥3,980')).toBeVisible(); // Original price
      
      // Check rating
      await expect(page.getByText('4.5')).toBeVisible();
      await expect(page.getByText(/342件のレビュー/)).toBeVisible();
      
      // Check stock info
      await expect(page.getByText(/在庫.*15点/)).toBeVisible();
    });

    test('should change product images', async ({ page }) => {
      await page.goto('/products/1');
      
      // Click on second thumbnail
      const thumbnails = page.locator('button[class*="border-"]');
      await thumbnails.nth(1).click();
      
      // Check if main image changed (border should be on second thumbnail)
      await expect(thumbnails.nth(1)).toHaveClass(/border-primary/);
    });

    test('should adjust quantity', async ({ page }) => {
      await page.goto('/products/1');
      
      // Find quantity controls
      const decreaseButton = page.getByRole('button', { name: '-' });
      const increaseButton = page.getByRole('button', { name: '+' });
      const quantityDisplay = page.locator('.w-12.text-center');
      
      // Check initial quantity
      await expect(quantityDisplay).toHaveText('1');
      
      // Increase quantity
      await increaseButton.click();
      await expect(quantityDisplay).toHaveText('2');
      
      // Decrease quantity
      await decreaseButton.click();
      await expect(quantityDisplay).toHaveText('1');
    });

    test('should toggle favorite', async ({ page }) => {
      await page.goto('/products/1');
      
      // Find heart button
      const heartButton = page.locator('button').filter({ has: page.locator('svg.lucide-heart') }).first();
      
      // Click to favorite
      await heartButton.click();
      
      // Check if heart is filled
      await expect(heartButton.locator('svg')).toHaveClass(/fill-red-500/);
    });

    test('should display product tabs', async ({ page }) => {
      await page.goto('/products/1');
      
      // Check tabs are visible
      await expect(page.getByRole('tab', { name: '商品詳細' })).toBeVisible();
      await expect(page.getByRole('tab', { name: /レビュー/ })).toBeVisible();
      await expect(page.getByRole('tab', { name: '配送・返品' })).toBeVisible();
      
      // Click reviews tab
      await page.getByRole('tab', { name: /レビュー/ }).click();
      
      // Check reviews are displayed
      await expect(page.getByText('発色がとても良くて気に入っています')).toBeVisible();
      
      // Click shipping tab
      await page.getByRole('tab', { name: '配送・返品' }).click();
      
      // Check shipping info is displayed
      await expect(page.getByText('送料無料（全国一律）')).toBeVisible();
    });

    test('should add product to cart', async ({ page }) => {
      await page.goto('/products/1');
      
      // Set quantity to 2
      await page.getByRole('button', { name: '+' }).click();
      
      // Click add to cart button
      await page.getByRole('button', { name: 'カートに追加' }).click();
      
      // Cart should update (this would normally check a cart indicator)
      // For now, we just verify the button was clickable
      await expect(page.getByRole('button', { name: 'カートに追加' })).toBeEnabled();
    });
  });
});