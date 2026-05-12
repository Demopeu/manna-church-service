import { test as setup } from '@playwright/test';
import { ADMIN_AUTH } from './utils/supabase';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('이메일').fill(ADMIN_AUTH.email);
  await page.getByPlaceholder('비밀번호').fill(ADMIN_AUTH.password);
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('**/', { timeout: 30000, waitUntil: 'networkidle' });
  await page.context().storageState({ path: authFile });
});
