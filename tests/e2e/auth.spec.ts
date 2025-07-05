import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('should display login form with all required fields', async ({ page }) => {
      await page.goto('/login');
      
      // Check form elements
      await expect(page.getByLabel('メールアドレス')).toBeVisible();
      await expect(page.getByLabel('パスワード')).toBeVisible();
      await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
      
      // Check links
      await expect(page.getByRole('link', { name: 'パスワードを忘れた場合' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'アカウント作成' })).toBeVisible();
    });

    test('should show/hide password when clicking eye icon', async ({ page }) => {
      await page.goto('/login');
      
      const passwordInput = page.getByLabel('パスワード');
      
      // Initially password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click eye icon to show password
      await page.getByRole('button', { name: /eye/i }).first().click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide password
      await page.getByRole('button', { name: /eye/i }).first().click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should fill demo credentials when clicking demo button', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByRole('button', { name: 'デモアカウントを使用' }).click();
      
      await expect(page.getByLabel('メールアドレス')).toHaveValue('demo@livit.jp');
      await expect(page.getByLabel('パスワード')).toHaveValue('demo123');
    });

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByRole('link', { name: 'アカウント作成' }).click();
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Signup Page', () => {
    test('should display signup form with all required fields', async ({ page }) => {
      await page.goto('/signup');
      
      // Check form elements
      await expect(page.getByLabel('ユーザー名')).toBeVisible();
      await expect(page.getByLabel('メールアドレス')).toBeVisible();
      await expect(page.getByLabel('パスワード')).toBeVisible();
      await expect(page.getByLabel('パスワード確認')).toBeVisible();
      await expect(page.getByRole('button', { name: 'アカウント作成' })).toBeVisible();
    });

    test('should validate password confirmation', async ({ page }) => {
      await page.goto('/signup');
      
      // Fill form with mismatched passwords
      await page.getByLabel('ユーザー名').fill('testuser');
      await page.getByLabel('メールアドレス').fill('test@example.com');
      await page.getByLabel('パスワード').fill('password123');
      await page.getByLabel('パスワード確認').fill('password456');
      
      await page.getByRole('button', { name: 'アカウント作成' }).click();
      
      // Should show error message
      await expect(page.getByText('パスワードが一致しません')).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await page.goto('/signup');
      
      await page.getByRole('link', { name: 'ログイン' }).click();
      await expect(page).toHaveURL('/login');
    });
  });
});