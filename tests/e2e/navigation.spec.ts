import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page first
    await page.goto('/home');
  });

  test('should display navigation menu on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Check side navigation is visible
    const sideNav = page.locator('aside');
    await expect(sideNav).toBeVisible();
    
    // Check navigation items
    await expect(page.getByRole('link', { name: 'ホーム' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ライブ' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ショップ' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'トレンド' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'プロフィール' })).toBeVisible();
  });

  test('should display bottom navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check bottom navigation is visible
    const bottomNav = page.locator('nav.fixed.bottom-0');
    await expect(bottomNav).toBeVisible();
    
    // Check navigation items
    await expect(bottomNav.getByText('ホーム')).toBeVisible();
    await expect(bottomNav.getByText('ライブ')).toBeVisible();
    await expect(bottomNav.getByText('ショップ')).toBeVisible();
    await expect(bottomNav.getByText('トレンド')).toBeVisible();
    await expect(bottomNav.getByText('プロフィール')).toBeVisible();
  });

  test('should navigate to live page', async ({ page }) => {
    await page.getByRole('link', { name: 'ライブ' }).first().click();
    await expect(page).toHaveURL('/live');
    await expect(page.getByRole('heading', { name: 'ライブ配信中' })).toBeVisible();
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.getByRole('link', { name: 'ショップ' }).first().click();
    await expect(page).toHaveURL('/shop');
    await expect(page.getByRole('heading', { name: 'ショップ' })).toBeVisible();
  });

  test('should navigate to trending page', async ({ page }) => {
    await page.getByRole('link', { name: 'トレンド' }).first().click();
    await expect(page).toHaveURL('/trending');
    await expect(page.getByRole('heading', { name: 'トレンド' })).toBeVisible();
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.getByRole('link', { name: 'プロフィール' }).first().click();
    await expect(page).toHaveURL('/profile');
  });
});