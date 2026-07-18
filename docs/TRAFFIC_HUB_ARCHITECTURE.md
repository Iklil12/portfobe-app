# Arsitektur & Cara Kerja: Traffic Hub (Sistem Analitik Portfobe)

Dokumen ini membedah *engine* di balik **Traffic Hub**, fitur analitik tingkat lanjut milik Portfobe yang dirancang untuk menangani ribuan kunjungan secara simultan tanpa membebani *disk I/O* pada server utama.

---

## 1. Konsep Dasar & Tantangan Teknis (The Problem)
Jika sebuah portofolio populer (*viral*) mendapat 10.000 kunjungan dalam 1 jam, dan sistem analitik langsung menulis setiap kunjungan (INSERT) ke dalam *database* relasional (MariaDB), server akan mengalami *bottleneck* (kemacetan I/O pada disk SSD/NVMe) yang menyebabkan situs menjadi lambat (*down*).

### Solusi Arsitektur (The Solution):
Portfobe menggunakan sistem **In-Memory Buffering & Aggregation**. Semua data kunjungan tidak langsung menyentuh MariaDB. Mereka dicegat, divalidasi, dan diakumulasi terlebih dahulu di dalam **Redis** (RAM).

---

## 2. Alur Pelacakan (Tracking Flow)

Logika utama berada di dalam `src/features/analytics/model/analyticsService.ts`.

### Tahap 1: Pengiriman Beacon (Klien)
1. Setiap halaman portofolio memuat *script* pelacak (*tracker*).
2. *Script* ini mengirim ping secara rahasia (via Fetch API / sendBeacon) ke endpoint `/api/analytics/track` saat pengunjung melihat portofolio.
3. Payload yang dikirim mencakup: URL halaman, *referrer*, data perangkat (lebar layar), dan *timestamp*.

### Tahap 2: Validasi & Anti-Spam (Redis Rate Limiting)
Saat API menerima *request*, `analyticsService.ts` langsung bekerja.
1. **Pendeteksian GeoIP:** IP pengguna dicek menggunakan pustaka `geoip-lite` untuk menentukan asal negara (Country Code).
2. **Pengecekan Spam (Rate Limit):** Redis mengecek apakah IP ini sudah mengunjungi halaman yang sama dalam 10 detik terakhir. Jika ya, ping ini **dibuang (diabaikan)** agar pengunjung iseng yang menekan tombol *Refresh* (F5) berulang kali tidak merusak data statistik.

### Tahap 3: Pemisahan Views vs Unique Visitors
Di sinilah letak kecerdasan *session mapping*:
- **Views (Total Kunjungan):** Setiap kunjungan yang lolos *rate limit* akan dihitung sebagai +1 View.
- **Unique Visitors:** Redis menyimpan *Hash* atau UUID pengunjung. Jika pengunjung ini belum pernah datang ke portofolio tersebut dalam rentang 24 jam terakhir, maka angka *Unique Visitors* bertambah +1.

### Tahap 4: Agregasi di dalam RAM (Redis Buffer)
Daripada menulis 1 baris ke MySQL per kunjungan, Redis melakukan operasi increment (contoh: `INCR page:views:username`). Ini berlangsung dalam orde mikro-detik.

---

## 5. Sinkronisasi Data (Buffer to Database)

Bagaimana data dari Redis masuk permanen ke MariaDB agar bisa ditampilkan dalam grafik 30 Hari di Traffic Hub?

Sistem melakukan operasi **Bulk Sync** secara asinkron.
1. Melalui mekanisme *Cron Job* (di-*trigger* berkala via `/api/cron`), server akan memanggil fungsi ekspor pada `analyticsService.ts`.
2. Fungsi ini mengambil semua hasil akumulasi (*counters*) dari Redis.
3. Membentuk data terstruktur (misal: Tanggal `2026-07-18`, Total View: `4500`, Unique: `3200`).
4. Menyuntikkan (*bulk upsert*) data agregat tersebut ke dalam tabel `DailyStats` dan `LocationStats` di Prisma/MariaDB.
5. Setelah berhasil disimpan, Redis akan mereset (flushing) kunci *counter* tersebut.

---

## 6. Skenario Penarikan Data (Data Fetching untuk UI)

Saat pemilik portofolio membuka menu **Traffic Hub** di *Dashboard*:
- API tidak perlu menghitung jutaan baris *log*.
- API hanya perlu mengambil 7 atau 30 baris terakhir dari tabel `DailyStats` di MariaDB (sangat ringan).
- Untuk angka "Hari Ini" (*Today*), sistem menggabungkan nilai dari database historis + angka *real-time* yang saat ini sedang berputar di dalam Redis, memberikan data statisikal yang selalu akurat hingga ke detik terakhir tanpa merusak performa.
