import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page, scroll slowly, open FAQs, and scroll to bottom', async ({ page }) => {
    // Tambahkan durasi timeout karena tes ini sengaja dibuat lambat (60 detik)
    test.setTimeout(60000);

    // 1. Navigasi ke halaman utama
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verifikasi judul halaman ada di dokumen
    await expect(page).toHaveTitle(/Portfo\.be/i);

    // Fungsi smooth scroll asli menggunakan mesin render browser (60fps)
    const smoothScrollToSelector = async (selector: string) => {
      await page.evaluate(async (sel) => {
        await new Promise<void>((resolve) => {
          // Cari elemen yang dituju
          const elements = Array.from(document.querySelectorAll('h2, h3, span'));
          const el = elements.find(e => e.textContent?.toLowerCase().includes(sel.toLowerCase())) || document.querySelector(sel);
          
          if (!el) { resolve(); return; }
          
          // Posisi yang dituju (kurangi 150px agar tidak tertutup navbar)
          const targetY = el.getBoundingClientRect().top + window.scrollY - 150;
          let currentY = window.scrollY;
          
          const step = () => {
            currentY += 6; // Kecepatan scroll perlahan (6px per frame)
            window.scrollTo(0, currentY);
            if (currentY < targetY) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          };
          requestAnimationFrame(step);
        });
      }, selector);
    };

    const smoothScrollToBottom = async () => {
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let currentY = window.scrollY;
          const targetY = document.body.scrollHeight - window.innerHeight;
          const step = () => {
            currentY += 6;
            window.scrollTo(0, currentY);
            if (currentY < targetY) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          };
          requestAnimationFrame(step);
        });
      });
    };

    // 2. Scroll mulus dari atas langsung menuju area FAQ
    await smoothScrollToSelector('FREQUENTLY ASKED');
    await page.waitForTimeout(1000); // Jeda santai untuk melihat bagian FAQ

    // 3. Buka semua pertanyaan FAQ satu per satu
    const faqButtons = page.locator('.wire-b-faq button');
    const faqCount = await faqButtons.count();
    
    for (let i = 0; i < faqCount; i++) {
      await faqButtons.nth(i).click();
      await page.waitForTimeout(400); // Jeda animasi
    }

    await page.waitForTimeout(1000);

    // 4. Lanjut scroll mulus sampai Footer bawah
    await smoothScrollToBottom();

    // Pastikan kita sudah di bawah (teks footer terlihat)
    const footerText = page.locator('text=/©/i').first();
    await expect(footerText).toBeVisible();
    
    await page.waitForTimeout(1500); // Jeda terakhir sebelum tes ditutup
  });
});

