# Portfobe - Comprehensive System Architecture & PRD (V2)

## 1. Executive Summary

**Portfobe** adalah platform pembuat portofolio dinamis (*portfolio builder*) kelas *enterprise*. Platform ini dirancang untuk desainer, developer, dan profesional kreatif. Tidak hanya berfokus pada fleksibilitas UI (dengan *Pageblock System* dan kustomisasi inline), Portfobe didukung oleh infrastruktur *heavy-duty* yang menggabungkan *edge caching*, pemrosesan aset 3D, mitigasi *spam*, dan analitik *real-time*.

### Core Tech Stack
- **Framework:** Next.js 16.2.4 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS 4, Framer Motion, GSAP, React Three Fiber (3D Engine)
- **Database Layer:** Prisma 5.21.1 (ORM), MariaDB (Storage), Redis (Caching & Rate Limiting)
- **Testing:** Playwright (E2E), Vitest (Unit)
- **Package Manager:** npm (dikelola oleh Nixpacks di server)

---

## 2. Peta Infrastruktur & Deployment (DevOps)

Portfobe tidak berjalan pada hosting konvensional, melainkan menggunakan arsitektur semi-distributed yang memanfaatkan berbagai layanan *Cloud*.

### A. Jaringan Publik & Edge (Cloudflare)
- **Cloudflare (DNS & Proxy):** Semua trafik masuk (`portfo.be` dan `www.portfo.be`) diarahkan melalui Cloudflare.
- **Fungsi Utama:** Menyediakan SSL otomatis, mitigasi DDoS dasar, dan *Edge Caching* untuk aset statis (HTML/CSS/JS bawaan Next.js) sehingga server terlindungi dari lonjakan *traffic* mendadak.

### B. Server Utama (Contabo & Coolify v4)
- **Host:** VPS Contabo Cloud (12GB RAM, 200GB SSD, Ubuntu).
- **Control Panel (PaaS):** Coolify v4 mengelola container Docker secara mandiri tanpa campur tangan manual.
- **Node.js Environment:** Dibangun menggunakan **Nixpacks** (dengan `NIXPACKS_NODE_VERSION=20` atau `24`) untuk memastikan kompatibilitas dengan Vite 8 dan React 19.
- **Internal Database:** MariaDB dan Redis berjalan sebagai container terpisah namun berada dalam satu *network* dengan aplikasi Next.js (berkomunikasi via URL Internal).

---

## 3. Ekosistem Integrasi Pihak Ketiga (Third-Party Services)

Kekuatan Portfobe terletak pada orkestrasi banyak layanan API eksternal yang diatur melalui *Environment Variables*.

### 1. Manajemen Media & Aset Berat (Bunny.net & Cloudinary)
Portfobe memisahkan penyimpanan aset berdasarkan jenis dan kebutuhannya:
- **Cloudinary (`NEXT_PUBLIC_CLOUDINARY_*`):** Digunakan untuk pemrosesan gambar profil dan *thumbnail* proyek. Cloudinary otomatis melakukan *resize*, kompresi (WebP), dan manipulasi gambar secara *on-the-fly*.
- **Bunny.net CDN & Storage (`BUNNY_API_KEY`, `BUNNY_STORAGE_NAME`):** Infrastruktur khusus untuk menampung dan mendistribusikan **Model 3D (React Three Fiber / Spline)**. File 3D (.gltf / .glb) yang sangat berat disimpan di `portfobe-3d-pro` (Storage Zone) dan ditarik melalui Pull Zone (`vz-eed0251b-ae9.b-cdn.net`) agar *loading* model 3D di portofolio pengguna secepat kilat berkat *Edge Servers* Bunny.net global.

### 2. Autentikasi Pengguna (NextAuth.js)
- **Google & GitHub Providers:** Sistem SSO (Single Sign-On) diaktifkan. `GOOGLE_CLIENT_ID` dan `GITHUB_CLIENT_ID` menangani otorisasi, dan Prisma Adapter otomatis menyimpan sesi pengguna ke MariaDB.

### 3. Otomasi & Sinkronisasi Desain (n8n & Penpot)
- **n8n Webhook (`N8N_WEBHOOK_SECRET`):** Layanan n8n *self-hosted* (di server yang sama/terpisah) menerima *trigger* (misalnya: ada pengguna mendaftar, pembayaran berhasil) untuk melakukan notifikasi internal (Slack/Discord/Email tim).
- **Penpot (`PENPOT_ACCESS_TOKEN`):** Digunakan untuk sinkronisasi token desain (*design tokens*) atau menarik aset vektor kolaboratif dari desainer secara langsung ke dalam platform.

### 4. Pembayaran & Langganan (Duitku API)
- **Duitku (`DUITKU_MERCHANT_CODE`, `DUITKU_API_KEY`):** Bertindak sebagai *Payment Gateway* lokal/internasional. 
- **Alur Kerja:** Sistem Portfobe menerima *callback/webhook* dari Duitku saat pengguna berhasil membayar paket *Premium/Supreme*. Logika penumpukan (stacking) masa aktif akun diproses secara aman.

### 5. Komunikasi & Keamanan (Resend & ReCAPTCHA)
- **Resend (`RESEND_API_KEY`):** Menggantikan SMTP tradisional. API ini mengirim email *transactional* seperti kuitansi pembelian, notifikasi akun, dan peringatan *password*.
- **Google ReCAPTCHA v3 (`RECAPTCHA_SECRET_KEY`):** Validasi bot *invisible* pada formulir pendaftaran dan pengiriman pesan (di halaman kontak portofolio) untuk mencegah injeksi *spam*.

---

## 4. Arsitektur Folder & FSD (Feature Sliced Design)

- `app/`: Next.js App Router murni (Routes, `layout.tsx`, *Server Actions*, API Endpoints `/api/*`).
- `src/features/`: Modul domain independen (`analytics/`, `auth/`, `billing/`, `portfolio/`).
- `src/shared/` & `src/entities/`: *Types*, *Utils*, dan skema Zod global.
- `components/ui/`: Komponen statis (*Buttons, Dialogs*).
- `components/blocks/`: **Pageblock System**, jantung tema kustom portofolio.
- `docs/`: Dokumentasi internal (seperti file ini dan panduan *Modular Theme*).

---

## 5. Struktur Database & Model Data (Prisma)

- **`User` & `Account`:** Inti identitas pengguna (dari Google/Github).
- **`Profile`, `Project`, `Certificate`:** Data konten CMS portofolio.
- **`Theme` & `BlockState`:** Menyimpan status tata letak UI (warna, visibilitas blok, teks *inline* modifikasi pengguna).
- **`Subscription`:** Status layanan berbayar.
- **`Analytics` (DailyStats, GeoStats):** Menampung data *traffic* portofolio untuk fitur **Traffic Hub**.

### Caching Strategy (Redis)
URL `REDIS_URL` terhubung ke memori internal untuk:
1. **Rate Limiting:** Mencegah serangan *brute force* pada halaman login atau API.
2. **Session Mapping & Unique Visitors:** Mengingat IP pengunjung sehingga tidak terjadi manipulasi statistik (*spam views*).
3. **Analytics Buffer:** Mengumpulkan 1000 kunjungan dalam RAM sebelum menulisnya dalam satu tarikan (*bulk insert*) ke MariaDB.

---

## 6. Skenario Tugas Latar Belakang (Cron Jobs)
Variabel `CRON_SECRET` digunakan untuk mengamankan *endpoint* `/api/cron`.
Sebuah penjadwal eksternal (misalnya Github Actions, Vercel Cron, atau n8n) memanggil URL ini secara berkala untuk:
- Mengevaluasi dan mematikan (*downgrade*) akun yang masa *Subscription*-nya telah kedaluwarsa.
- Membersihkan (*garbage collect*) data Redis/Sesi usang.

---
*Dokumen V2 ini memetakan 100% integrasi teknologi dan layanan penyokong di dalam ekosistem Portfobe.*
