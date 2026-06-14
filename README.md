# 🌑 Portfo.be

> **The Ultimate Portfolio Engine for Creative Professionals.**

Portfo.be adalah platform SaaS (*Software as a Service*) komprehensif berskala *Enterprise* yang dirancang untuk memungkinkan desainer, *engineer*, dan pekerja kreatif kelas dunia dalam membangun, mengelola, dan melacak portofolio profesional mereka. 

Lebih dari sekadar *website builder*, Portfo.be dilengkapi dengan sistem **Analytics Internal**, **Multi-Platform Integrations** (Canva, Penpot, Github), dan arsitektur *Theme Engine* yang sangat canggih.

---

## 🏗️ Arsitektur & Fungsionalitas Inti

Berdasarkan analisis struktur inti sistem (Database Schema & Routing), berikut adalah kapabilitas sesungguhnya dari platform ini:

### 1. Advanced Theme & Appearance Engine
Sistem desain tidak hanya menggunakan satu *template* kaku.
- **Theme Drafts & Live State:** Pengguna dapat menyimpan puluhan iterasi desain (Draft) sebelum di-*publish* secara *live*. Setiap *draft* memiliki preferensi *font*, warna (*hex*), tipe tombol, dan gaya kartu secara independen.
- **Curated Projects per Theme:** Pengguna bisa mengatur proyek mana saja yang muncul pada tema tertentu melalui sistem relasi silang (`ThemeDraftProject` & `LiveThemeProject`).
- **Dynamic Page Blocks:** Fleksibilitas menyusun letak bagian (seperti *Hero*, *Projects*, *Testimonials*) menggunakan sistem drag-and-drop (`PageBlock`).

### 2. Comprehensive Media & Integrations
Mendukung lebih dari sekadar unggahan gambar statis.
- **3D Engine:** Integrasi native `<model-viewer>` yang mendukung *rendering* aset 3D secara *real-time* (`Project3DDetail`).
- **Video CDN:** Pemutaran video beresolusi tinggi yang ditenagai oleh BunnyCDN dengan konversi *thumbnail* otomatis (`videoUtils.ts`).
- **Third-Party Integrations:** Dukungan tertanam untuk menarik aset secara langsung dari **Canva** (`CanvaProject`), **Penpot**, dan **Github** (via direktori `api/integrations`).

### 3. Enterprise-Grade Analytics (Built-in)
Tidak perlu mengandalkan Google Analytics, sistem memiliki pelacakan *native* yang kuat:
- **Visitor Sessions & Geographic Data:** Melacak Negara, Kota, tipe Perangkat, Sistem Operasi, Browser, hingga alamat IP pengunjung (`VisitorSession`).
- **Traffic Acquisition:** Pelacakan komprehensif *Referrer*, sumber *traffic*, dan pelacakan metrik *marketing* (UTM Source, Medium, Campaign).
- **Time-Series Stats:** Agregasi data performa *views* dan *clicks* yang direkam secara harian (`DailyStats`) dan per jam (`HourlyStats`).

### 4. Billing, Monetization & Security
Siap dioperasikan sebagai mesin bisnis yang menguntungkan:
- **Subscription Tiers:** Sistem hierarki akun berjenjang (*FREE, PRO, SUPREME*) yang dikendalikan oleh tabel `Subscription` dan `Transaction`.
- **Coupon System:** Mendukung diskon kupon (*Percentage/Fixed*) dengan pembatasan jumlah pemakaian dan batas durasi tayang (`Coupon`).
- **Brute-Force Protection:** Keamanan tingkat lanjut yang mencatat dan memblokir otomatis alamat IP jika terjadi *spam* login atau pendaftaran (`LoginAttempt`, `RegisterAttempt`).
- **Admin Impersonation:** Administrator memiliki kemampuan untuk mengambil alih sesi pengguna (*impersonate*) guna memberikan bantuan dukungan teknis tanpa meminta *password*.

---

## 🛠️ Tech Stack & Infrastruktur

- **Framework:** Next.js 16 (App Router) dengan fitur *Dynamic Subdomain Routing* (`/[subdomain]`).
- **Frontend:** React 19, Tailwind CSS, `@dnd-kit` (untuk antarmuka geser-letak super responsif).
- **Database ORM:** Prisma Client 
- **Database Engine:** MySQL / PostgreSQL (Supabase).
- **File Storage:** BunnyCDN & Cloudinary untuk pengiriman media ultra-cepat.
- **Auth:** Sistem kredensial internal yang sangat aman dipadukan dengan OAuth Providers (`Account` model).

---

## 🚀 Instalasi Lingkungan Pengembangan (Local Setup)

### 1. Persiapan Kebutuhan Server
- Node.js (v18+)
- MySQL atau PostgreSQL Server
- Akun Cloudinary / BunnyCDN (opsional, untuk *upload* gambar/video)

### 2. Kloning & Instalasi
```bash
git clone https://github.com/iklil12/portfobe-app.git
cd portfobe-app
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin file `.env.example` ke `.env` dan isi semua *keys* infrastrukturnya:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/portfobe_db"

# Next Auth / Secret Keys
NEXTAUTH_SECRET="your-super-secret-string"

# Storage
NEXT_PUBLIC_BUNNY_PULL_ZONE="..."
```

### 4. Migrasi Skema Database
Sistem ini menggunakan sinkronisasi Prisma *Schema*.
```bash
npx prisma generate
npx prisma db push
```

### 5. Menjalankan Aplikasi
```bash
npm run dev
```
Aplikasi utama berjalan di `http://localhost:3000`. Untuk menguji *dynamic subdomain*, Anda mungkin perlu mengonfigurasi *hosts file* lokal Anda agar `*.localhost` mengarah ke `127.0.0.1`.

---

## 📂 Peta Direktori Inti (Routing Explorer)

- **`/app/[subdomain]`**: Modul utama yang me-render *Live Website* dari para pengguna secara publik.
- **`/app/dashboard`**: Portal tertutup pengguna (Pembuat Tema, Kurator Proyek, dan melihat Analitik).
- **`/app/api`**: Memiliki 30+ *micro-endpoints*, termasuk API untuk *Admin, Integrations (Github/Canva), Layout Sync, Subscriptions*, dan *Analytics Tracker*.
- **`/prisma/schema.prisma`**: Jantung dari seluruh relasi data, mencakup 30 entitas tabel (User, Analytics, Certificates, Themes).
- **`/components/features/appearance`**: Pusat gravitasi dari pengalaman interaktif aplikasi (termasuk *ProjectSelectionModal* berkinerja tinggi).

---

**Portfo.be** © 2026. *Engineered for absolute scale and creative freedom.*
