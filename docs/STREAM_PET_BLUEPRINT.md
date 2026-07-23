# 🐉 Blueprint Arsitektur: StreamPet (Omnichannel Virtual Pet)

Sistem ini adalah platform peliharaan virtual 24/7 yang memungkinkan penonton berinteraksi dengan peliharaan maskot *streamer* melalui dua jalur: **TikTok Live (Gifts/Likes)** dan **Web Hub Publik (Payment Gateway)**. Kedua interaksi ini diproses secara *real-time* ke satu layar (OBS Overlay/Tablet Streamer).

---

## 1. Topologi Sistem (High-Level Architecture)

Karena Anda menggunakan VPS Contabo (12GB RAM, 6 Core) dengan Coolify, seluruh ekosistem ini bisa berjalan lancar di dalam kontainer Docker.

```mermaid
graph TD
    %% Eksternal
    TT[TikTok Live Server]
    Duitku[Duitku Payment Gateway]
    FansWeb[Fans (Web Browser)]
    Streamer[Streamer OBS / iPad]

    %% Internal (VPS Node)
    subgraph VPS Contabo (Coolify)
        TLC[TikTok Live Listener Node.js]
        API[Next.js Core API]
        WS[Soketi WebSocket Server]
        Redis[(Redis Cache & PubSub)]
        DB[(PostgreSQL / MariaDB)]
        FE_Web[Next.js Public Web Hub]
        FE_OBS[Next.js Transparent Overlay]
    end

    %% Koneksi Data
    TT -- Stream Gifts/Likes/Chat --> TLC
    TLC -- Filtered Events --> Redis
    Redis -- Pub/Sub --> WS
    WS -- Realtime Updates --> FE_OBS
    WS -- Realtime Updates --> FE_Web

    FansWeb -- Beli Item (QRIS) --> API
    API -- Create Invoice --> Duitku
    Duitku -- Webhook Success --> API
    API -- Update EXP/Items --> DB
    API -- Trigger Event --> Redis

    Streamer -- Pantau Layar --> FE_OBS
```

---

## 2. Komponen Utama (Tech Stack)

### A. TikTok Live Microservice (Node.js)
Sebuah servis kecil (daemon) yang berjalan 24 jam menggunakan *library* open-source `tiktok-live-connector`.
- **Tugas:** Menempel ke *username* TikTok *streamer* saat mereka *Live*, mendengarkan setiap ketukan layar (*Like*) dan donasi Mawar (*Gift*).
- **Proses:** Ketika seseorang memberi Mawar, servis ini langsung menembak pesan ke Redis Pub/Sub (`channel: pet_events`).

### B. Soketi (WebSocket Server)
Pusat saraf komunikasi *real-time*. Soketi adalah server WebSockets yang kompatibel dengan Pusher.
- **Tugas:** Menyambungkan layar OBS/iPad *streamer* dan layar Web fans secara instan tanpa *delay* HTTP.

### C. Web & Overlay Frontend (Next.js + Framer Motion / Phaser.js)
- **Web Hub (`/username`):** Halaman publik tempat fans melihat peliharaan, membelikan item (topi, makanan), dan melihat Leaderboard.
- **OBS Overlay (`/username/overlay`):** Halaman web berlatar transparan (`background: transparent`) yang merender animasi 2D/3D (misal naga makan apel, melompat, menyemburkan api).

---

## 3. Alur Kerja (Data Flow)

### Skenario 1: Interaksi via TikTok Live
1. Penonton bernama "Budi" mengirim 1 Gift **Mawar** di TikTok.
2. `tiktok-live-connector` mendeteksi: `{ user: "Budi", gift: "Rose", count: 1 }`.
3. Node.js menembak data ini ke **Soketi**.
4. Halaman **OBS Overlay** menerima data, memunculkan teks *"Budi mengirim Mawar!"* dan merender animasi 2D naga memakan mawar tersebut.
5. Node.js meng-*update* *database* (EXP Naga bertambah +10).

### Skenario 2: Interaksi via Website (Di Luar Live / Saat Live)
1. Penonton bernama "Siti" membuka web `pet.streamer.com`.
2. Siti membeli "Mahkota Emas" seharga Rp 50.000 menggunakan QRIS Duitku.
3. Duitku mengirim *Webhook* sukses ke API Next.js.
4. API Next.js menyimpan Mahkota Emas ke dalam *Database* (Inventaris peliharaan).
5. API Next.js menembak ke **Soketi**.
6. **OBS Overlay** dan **Web Hub** semua orang secara *real-time* melihat animasi Mahkota Emas jatuh dari langit dan menempel di kepala naga.

### Skenario 3: Sistem Milestones (Goal)
1. Di layar terdapat *Progress Bar* (Target Like: 1 Juta).
2. Setiap kali penonton *Tap-Tap* layar di TikTok, `tiktok-live-connector` menangkap event `onLike`.
3. *Progress Bar* di OBS bergerak secara *real-time*.
4. Saat menyentuh 1 Juta, WebSockets memicu animasi *Super Saiyan* atau ledakan kembang api di layar, merayakan pencapaian bersama komunitas.

---

## 4. Desain Database (Prisma Schema Draft)

```prisma
// Profil Streamer
model Streamer {
  id             String   @id @default(uuid())
  tiktokUsername String   @unique // Untuk di-listen oleh connector
  displayName    String
  pet            Pet?
}

// Data Peliharaan
model Pet {
  id         String   @id @default(uuid())
  streamerId String   @unique
  name       String   @default("Drago")
  level      Int      @default(1)
  exp        Int      @default(0)
  hunger     Int      @default(100) // 0-100, berkurang setiap jam
  accessories Accessory[] // Relasi ke item yang sedang dipakai
  
  streamer   Streamer @relation(fields: [streamerId], references: [id])
}

// Leaderboard / Fans
model FanInteraction {
  id         String   @id @default(uuid())
  petId      String
  username   String   // Bisa dari TikTok atau login Web
  totalSpent Float    @default(0) // Untuk ranking Leaderboard
  lastActive DateTime @default(now())
}
```

---

## 5. Strategi Deployment (Fase Pembuatan)

Untuk mengeksekusi ini, Anda membaginya menjadi 3 fase agar tidak kewalahan:

1. **Fase 1 (Proof of Concept - 1 Minggu):**
   - Setup `tiktok-live-connector` murni di terminal.
   - Sambungkan ke *websocket* (Soketi) agar *gift* yang masuk bisa memunculkan teks bergoyang di layar kosong (`Next.js`).
2. **Fase 2 (Visual & Animasi - 2 Minggu):**
   - Masukkan karakter peliharaan 2D (Bisa pakai *CSS Sprite* atau *Framer Motion* sederhana).
   - Buat logika transisi: Kalo dapat Mawar -> ganti state jadi `ANIMATION_EAT`.
3. **Fase 3 (Monetisasi Web - 1 Minggu):**
   - Buat *dashboard* publiknya.
   - Sambungkan API Duitku agar transaksi web juga memicu animasi *Websocket* yang sama dengan *Gift* TikTok.
