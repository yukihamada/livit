import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the landing page with correct elements', async ({ page }) => {
    await page.goto('/');
    
    // Check the main heading
    await expect(page.getByRole('heading', { name: 'Livit' })).toBeVisible();
    
    // Check the tagline
    await expect(page.getByText('ライブで買い物する新体験')).toBeVisible();
    
    // Check feature sections
    await expect(page.getByText('リアルタイムライブ配信')).toBeVisible();
    await expect(page.getByText('AIパーソナライズ')).toBeVisible();
    await expect(page.getByText('ワンタップ購入')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: 'アカウント作成' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ログイン' })).toBeVisible();
  });

  test('should navigate to signup page when clicking signup button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'アカウント作成' }).click();
    
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: 'アカウント作成' })).toBeVisible();
  });

  test('should navigate to login page when clicking login button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'ログイン' }).click();
    
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
  });

  test('should auto-redirect to home page after 3 seconds', async ({ page }) => {
    await page.goto('/');
    
    // Wait for auto-redirect
    await page.waitForURL('/home', { timeout: 4000 });
    
    // Check if we're on the home page
    await expect(page).toHaveURL('/home');
  });
});