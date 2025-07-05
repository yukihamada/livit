import { test, expect } from '@playwright/test';

test.describe('Live Streaming', () => {
  test.describe('Live Stream List', () => {
    test('should display live streams', async ({ page }) => {
      await page.goto('/live');
      
      // Check page title
      await expect(page.getByRole('heading', { name: 'ライブ配信中' })).toBeVisible();
      
      // Check search functionality
      await expect(page.getByPlaceholder('配信者や商品を検索...')).toBeVisible();
      
      // Check filter button
      await expect(page.getByRole('button', { name: 'フィルター' })).toBeVisible();
      
      // Check category filters
      await expect(page.getByRole('button', { name: 'すべて' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'コスメ' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'ファッション' })).toBeVisible();
      
      // Check if live stream cards are displayed
      const streamCards = page.locator('.product-card');
      await expect(streamCards).toHaveCount(4); // Based on mock data
    });

    test('should filter streams by category', async ({ page }) => {
      await page.goto('/live');
      
      // Click on コスメ category
      await page.getByRole('button', { name: 'コスメ' }).click();
      
      // Check that コスメ button is selected
      await expect(page.getByRole('button', { name: 'コスメ' })).toHaveClass(/bg-primary/);
    });

    test('should navigate to individual stream page', async ({ page }) => {
      await page.goto('/live');
      
      // Click on first stream card
      await page.locator('.product-card').first().click();
      
      // Should navigate to stream detail page
      await expect(page).toHaveURL(/\/live\/\d+/);
    });
  });

  test.describe('Live Stream Detail Page', () => {
    test('should display stream details', async ({ page }) => {
      await page.goto('/live/1');
      
      // Check video player
      await expect(page.locator('video')).toBeVisible();
      
      // Check stream info
      await expect(page.getByText('コスメ特価セール！限定商品あり')).toBeVisible();
      
      // Check streamer info
      await expect(page.getByText('あいか')).toBeVisible();
      await expect(page.getByRole('button', { name: 'フォロー' })).toBeVisible();
      
      // Check live indicator
      await expect(page.getByText('LIVE')).toBeVisible();
      
      // Check viewer count
      await expect(page.getByText(/2.8K/)).toBeVisible();
    });

    test('should display products section', async ({ page }) => {
      await page.goto('/live/1');
      
      // Check products header
      await expect(page.getByText('紹介中の商品')).toBeVisible();
      
      // Check product items
      await expect(page.getByText('リップティント 5色セット')).toBeVisible();
      await expect(page.getByText('アイシャドウパレット')).toBeVisible();
      
      // Check add to cart buttons
      const cartButtons = page.getByRole('button', { name: 'カートに追加' });
      await expect(cartButtons).toHaveCount(3);
    });

    test('should display and interact with chat', async ({ page }) => {
      await page.goto('/live/1');
      
      // Check chat section
      await expect(page.getByText('ライブチャット')).toBeVisible();
      
      // Check chat input
      const chatInput = page.getByPlaceholder('コメントを入力...');
      await expect(chatInput).toBeVisible();
      
      // Type a comment
      await chatInput.fill('素敵な商品ですね！');
      await page.getByRole('button', { name: /send/i }).click();
      
      // Check if comment appears
      await expect(page.getByText('素敵な商品ですね！')).toBeVisible();
    });

    test('should toggle favorite on stream', async ({ page }) => {
      await page.goto('/live/1');
      
      // Find heart button
      const heartButton = page.locator('button').filter({ has: page.locator('svg.lucide-heart') }).first();
      
      // Click to favorite
      await heartButton.click();
      
      // Check if heart is filled (has fill-red-500 class)
      await expect(heartButton.locator('svg')).toHaveClass(/fill-red-500/);
    });
  });
});