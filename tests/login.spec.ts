import { test, expect } from '@playwright/test';

test.describe('Autentikasi & Navigasi', () => {
  test('Simulasi pengguna mengetik form login', async ({ page }) => {
    // 1. Pergi ke halaman login
    await page.goto('/login');

    // 2. Beri jeda 1 detik agar animasi halaman terlihat oleh manusia (biasanya tidak dibutuhkan di real testing)
    await page.waitForTimeout(1000); 

    // 3. Mengetik email seolah-olah ditekan oleh manusia
    const emailInput = page.locator('input[name="email"]').first();
    await emailInput.focus();
    await emailInput.pressSequentially('tester@portfo.be', { delay: 100 }); 

    // 4. Mengetik password
    const passInput = page.locator('input[name="password"]').first();
    await passInput.focus();
    await passInput.pressSequentially('rahasia123', { delay: 100 });

    await page.waitForTimeout(1000); 

    // 5. Cek apakah tombol Sign In ada (Kita tidak benar-benar klik agar tidak merusak database produksi)
    const loginBtn = page.locator('button[type="submit"]');
    await expect(loginBtn).toBeVisible();
    
    // Test Selesai!
  });
});
