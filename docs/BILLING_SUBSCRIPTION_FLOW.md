# Arsitektur & Cara Kerja: Billing & Subscription Flow

Dokumen ini membedah alur transaksi keuangan, siklus penagihan (Billing), dan manajemen masa aktif fitur Premium (Subscription) di platform Portfobe, yang terintegrasi dengan Payment Gateway **Duitku**.

---

## 1. Konsep & Tantangan Bisnis
Mengelola pembayaran (*subscription*) bukan sekadar mengubah status dari "Gratis" menjadi "Pro". Tantangan utamanya adalah:
- Mencegah peretas memalsukan status pembayaran (Spoofing).
- Menangani skenario di mana pengguna membeli paket langganan saat paket lamanya belum habis.
- Memastikan UI di *Dashboard* langsung berubah tanpa harus memaksa pengguna *login/logout*.

---

## 2. Alur Pembayaran (Checkout Flow)

1. **Pemilihan Paket (Dashboard):** Pengguna memilih paket `PRO` atau `SUPREME` di halaman Billing.
2. **Pembuatan Transaksi Internal:** Sistem membuat baris di tabel `Transaction` (Prisma) dengan status `PENDING`. Sistem mencatat `durationDays` (misal 30 hari).
3. **Generasi Signature MD5:** Untuk menjamin keamanan, sistem membuat kode rahasia (`signature`) dari kombinasi `merchantCode + amount + merchantOrderId + DUITKU_API_KEY`.
4. **Permintaan ke Duitku:** Portfobe mengirimkan payload ke API Duitku untuk menghasilkan `paymentUrl`.
5. **Redirect:** Pengguna diarahkan ke halaman pembayaran Duitku untuk memilih metode (QRIS, VA, E-Wallet).

---

## 3. Webhook Keamanan (The Callback)

Inilah titik paling krusial. File eksekusi utama berada di `app/api/callbacks/duitku/route.ts`.

### 1. Verifikasi Data (Security Check)
Saat pembayaran berhasil (atau kedaluwarsa), server Duitku mengirim POST request (Callback) ke Portfobe.
- Sistem tidak langsung percaya. Sistem mengekstrak payload dari Duitku.
- Sistem merekonstruksi ulang `signature` menggunakan `DUITKU_API_KEY` rahasia yang ada di `.env`.
- Jika hasil MD5 dari sistem **tidak cocok** dengan yang dikirim Duitku, permintaan ditolak (`400 Bad Signature`).

### 2. Penumpukan Masa Aktif (Stacking Logic)
Inilah logika cerdas dari sistem *subscription* Portfobe.
- Sistem mencari ID pengguna yang bertransaksi.
- Sistem mengecek *Expired Date* (`planExpiredAt`) milik pengguna saat ini.
- **Logika:** Jika pengguna **sudah memiliki paket yang sama** (misal PRO) dan masa berlakunya masih aktif (belum *expired*), maka sistem **TIDAK me-reset** tanggalnya ke hari ini. Sebaliknya, sistem akan **menambahkan** durasi (misal +30 hari) ke sisa hari yang lama.
- Jika pengguna men-*downgrade* atau men-*upgrade* ke paket yang berbeda (Gratis -> Supreme), barulah masa aktif dihitung ulang dari waktu sekarang (`new Date()`).

### 3. Pembersihan Status Lama
Sistem mencari semua *record* `Subscription` lama pengguna yang bersatus `ACTIVE` dan mengubahnya menjadi `CANCELLED`. Kemudian, sistem membuat *record* `Subscription` baru yang menjadi bukti mutlak (*Source of Truth*) yang tercatat resmi: "Purchased via Duitku".

---

## 4. Reaktivitas Dashboard & Komunikasi Email

Bagaimana cara membuat *Dashboard* pengguna langsung sadar bahwa mereka sudah menjadi akun PRO dalam hitungan detik setelah bayar?

### 1. Pembersihan Cache (Redis Invalidation)
Informasi *Dashboard* (seperti statistik Traffic Hub) sering kali di-*cache* di dalam Redis. Di dalam *script* Callback Duitku, terdapat logika:
```typescript
await redis.del(`dashboard:sync:${user.id}:7d`);
await redis.del(`dashboard:sync:${user.id}:all`);
```
Dengan menghapus kunci *cache* spesifik milik pengguna ini, permintaan berikutnya ke Dashboard akan dipaksa mengambil ulang data segar (termasuk status paket baru) dari MariaDB.

### 2. Pengiriman Kuitansi Elektronik (Resend)
Sebagai penutup alur, server mengeksekusi integrasi **Resend API**.
- Sistem menggunakan *template* HTML khusus berwarna gelap (*Noir theme*).
- Email dikirim ke alamat yang terdaftar (dari pengirim: `hellocreator@mail.ritions.com`), berisi detail total bayar, paket berlangganan, dan ID Kuitansi (*Invoice No*).

---

## 5. Skenario Pemutusan (Expiration)

Sistem juga harus mencabut fitur Pro saat masa aktif habis.
- Hal ini ditangani oleh URL Cron Job `/api/cron/subscription-check`.
- Setiap tengah malam, penjadwal eksternal mengeksekusi URL ini. Sistem menarik (*query*) semua *user* dengan `planExpiredAt` di bawah `new Date()`.
- Untuk pengguna tersebut, status `plan` dikembalikan menjadi `FREE`, dan *record* berlangganannya di-*update* menjadi `EXPIRED`.
