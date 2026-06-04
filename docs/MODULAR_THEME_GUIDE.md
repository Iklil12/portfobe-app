# Panduan Lengkap Modularisasi Tema (Pageblock System)

Dokumen ini adalah panduan komprehensif tentang cara mengubah tema portofolio *monolithic* (satu file raksasa) menjadi arsitektur modular berbasis blok (*Pageblock System*). Sistem baru ini memungkinkan pengguna untuk melakukan *drag & drop* komponen, menyembunyikan/menampilkan seksi tertentu, dan mengedit teks secara langsung (*inline editing*) di Editor.

---

## 1. Persiapan & Struktur Direktori

Tema *legacy* (monolitik) biasanya berada di dalam:
`components/themes/[NamaTema]Theme.tsx`

Untuk versi modular, kita membuat folder baru khusus untuk tema tersebut di dalam:
`components/blocks/[nama-tema-kebab-case]/`

### Contoh Struktur Folder Tema Baru (Misal: `nexus-split`):
```text
components/blocks/nexus-split/
├── NexusSplitShell.tsx          # Pembungkus layout utama (Wajib)
├── NexusSplitContext.tsx        # State management lokal tema (Opsional, untuk media player)
├── NexusSplitHeroBlock.tsx      # Identitas, Avatar, Bio
├── NexusSplitMarqueeBlock.tsx   # Teks berjalan
├── NexusSplitAboutBlock.tsx     # Penjelasan detail
├── NexusSplitProjectsBlock.tsx  # Daftar portfolio
├── NexusSplitStatsBlock.tsx     # Statistik (Awards, Experience)
├── NexusSplitServicesBlock.tsx  # Layanan & Harga
├── NexusSplit3DBlock.tsx        # Model 3D Spline
├── NexusSplitAwardsBlock.tsx    # Daftar penghargaan
├── NexusSplitTestimonials.tsx   # Review klien
└── NexusSplitFooterBlock.tsx    # Bagian bawah & CTA
```

---

## 2. Membuat `Shell` & `Context`

### A. Context (Opsional)
Jika tema memiliki fitur pemutar media kustom (klik proyek video lalu muncul popup modal yang estetik), buatlah `Context` agar *state* pemutar media dapat diakses dari blok manapun tanpa harus *prop-drilling*.

### B. Shell (Wajib)
`ThemeShell.tsx` adalah kontainer utama yang menentukan tata letak makro (misal: panel kiri terkunci, panel kanan yang bisa di-scroll).
- Shell **wajib** menerima `children` (yang nantinya berisi blok-blok dinamis).
- Jika ada elemen yang harus diam di tempat (seperti *Sticky Sidebar* pada tema Nexus Split atau Minimalist), elemen tersebut diletakkan di dalam Shell dan diatur posisi css-nya (`fixed`, `sticky`, dsb).
- Pastikan Shell mengatur palet warna dan tipografi dasar (misalnya mendefinisikan `--hl` sebagai variabel warna *highlight*).

---

## 3. Aturan Pembuatan Komponen Blok

Setiap komponen blok mewakili satu seksi spesifik dari tema. Anda harus memecah file monolitik lama menjadi potongan-potongan blok ini.

### Standar Props
Semua komponen blok wajib menerima *props* standar berikut:
```tsx
export function TemaBaruProjectsBlock({ data, theme, isEditor, isCardPreview, blockConfig }: any)
```
- `data`: Objek data profil user (projects, bio, socials).
- `theme`: Objek pengaturan desain (warna, font, teks kustom).
- `isEditor`: Boolean penanda apakah dirender di dalam kanvas editor.
- `isCardPreview`: Boolean penanda apakah dirender sebagai thumbnail preview.

### Aturan Animasi (Framer Motion)
Agar animasi sinkron saat user mengedit, gunakan `animationTrigger`:
```tsx
const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

// Penggunaan pada komponen:
<motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={...}>
```

### Aturan Editable Text (Wajib!)
Teks statis yang melekat pada tema (misal: teks tombol "Let's Talk", judul "Selected Works", label "Experience") **wajib** diganti dengan komponen `EditableText` dari `@/components/ui/EditableText`.

```tsx
import { EditableText } from '@/components/ui/EditableText';

// Contoh penggunaan:
<EditableText 
    value={theme?.customTexts?.tema_baru_judul_projects || 'Selected Works'} 
    field="tema_baru_judul_projects" 
    entity="appearance" 
    isEditor={isEditor} 
    as="span" 
    maxLength={30} 
/>
```
**Catatan Penting EditableText**: 
- Properti `as` menentukan render tag HTML. Jika Anda menggunakan `as="p"`, jangan membungkusnya di dalam `<p>` lagi untuk menghindari *Hydration Error*. Gunakan pembungkus `<div>` atau ubah `as="span"`.

---

## 4. Integrasi ke `DynamicBlockRenderer.tsx`

Setelah semua blok dibuat, Anda harus mendaftarkannya ke otak perenderan dinamis, yaitu `components/blocks/DynamicBlockRenderer.tsx`.

1. **Import** semua file blok yang baru dibuat di bagian atas file.
2. Temukan fungsi `BlockMapper`.
3. Di dalam blok kondisi `if-else` atau `switch` untuk `activeThemeTemplate`, tambahkan *routing* untuk tema baru Anda:

```tsx
} else if (activeThemeTemplate === 'tema-baru') {
    switch (baseBlockType) {
        case 'HERO': content = <TemaBaruHeroBlock {...commonProps} />; break;
        case 'MARQUEE': content = <TemaBaruMarqueeBlock {...commonProps} />; break;
        case 'ABOUT': content = <TemaBaruAboutBlock {...commonProps} />; break;
        case 'SERVICES': content = <TemaBaruServicesBlock {...commonProps} />; break;
        case 'STATS': content = <TemaBaruStatsBlock {...commonProps} />; break;
        case 'PROJECTS': content = <TemaBaruProjectsBlock {...commonProps} />; break;
        case '3D': content = <TemaBaru3DBlock {...commonProps} />; break;
        case 'TESTIMONIALS': content = <TemaBaruTestimonialsBlock {...commonProps} />; break;
        case 'AWARDS': content = <TemaBaruAwardsBlock {...commonProps} />; break;
        case 'FOOTER': content = <TemaBaruFooterBlock {...commonProps} />; break;
        default: content = null;
    }
}
```

---

## 5. Integrasi Akhir ke `PortfolioView.tsx`

Langkah terakhir adalah memberi tahu sistem portofolio utama untuk mengalihkan perenderan dari sistem monolitik ke sistem modular.

Buka `components/PortfolioView.tsx`, temukan pengecekan `DynamicBlockRenderer` (sekitar baris ke 87), dan tambahkan nama tema Anda ke dalam validasi `if`:

```tsx
if (
    activeThemeName === 'minimalist' || 
    activeThemeName === 'spatial' || 
    // ... tema-tema lainnya ...
    activeThemeName === 'tema-baru' // <-- TAMBAHKAN DI SINI
) {
    return (
        <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
            <DynamicBlockRenderer blocks={data.pageBlocks || data.blocks || []} ... />
        </div>
    );
}
```

---

## 6. Penanganan Bug Umum (Troubleshooting)

Saat mengubah tema monolitik ke modular, beberapa hal ini sering terjadi:

1. **Teks Marquee Tampil Vertikal (Satu Huruf ke Bawah)**
   - *Penyebab*: `EditableText` memiliki *default styling* `break-all` yang berbentrok dengan *flex container* berjalan.
   - *Solusi*: Berikan *override class* pada `EditableText` marquee: `className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"`.

2. **Error `[DEBUG] Content is NULL for blockType: X`**
   - *Penyebab*: User mengaktifkan blok X (misal: About) di editor, tapi tema Anda tidak memiliki mapping untuk blok `ABOUT` di `DynamicBlockRenderer`.
   - *Solusi*: Buat komponen blok khusus untuk X di tema tersebut, meskipun di desain aslinya tidak ada. Harus selalu disediakan *fallback design*.

3. **Sticky Sidebar Rusak / Ikut Tergulung**
   - *Penyebab*: Pembungkus (`Shell`) atau elemen root memiliki atribut CSS `overflow-x-hidden`.
   - *Solusi*: Ganti strategi `position: sticky` menjadi `position: fixed` pada panel kiri, lalu berikan pendorong `margin-left` pada panel kanan agar tidak menumpuk.

4. **React Hydration Error (`<p>` descendant of `<p>`)**
   - *Penyebab*: Anda menggunakan `<EditableText as="p">` di dalam elemen yang kebetulan dideklarasikan sebagai tag `<p>`.
   - *Solusi*: Ubah elemen pembungkus luar menjadi `<div>` standar.

---
*Dokumen ini dibuat otomatis sebagai referensi teknis struktur frontend Portfo.be.*
