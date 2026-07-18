# Arsitektur & Cara Kerja: Appearance Editor (V2)

Dokumen ini membedah secara mendalam (Deep-Dive) jantung interaktivitas platform Portfobe, yaitu sistem **Appearance Editor**. Dokumen ini dibagi menjadi 3 Bab utama agar pengembang dapat memahami sistem dari level kode dasar, pemetaan file, hingga fungsionalitas yang dihadapi langsung oleh pengguna.

---

## BAB 1: The Code Level (Logika & State Management)

Editor Portfobe tidak menggunakan pendekatan form tradisional (mengisi kolom lalu klik simpan). Sebagai gantinya, platform ini menggunakan arsitektur **WYSIWYG Overlay (What You See Is What You Get)**.

### 1. Jantung Editor: Zustand (`useEditorStore.ts`)
Karena interaksi editor membutuhkan respons seketika (*zero latency*), seluruh status editor diatur sepenuhnya di sisi klien (*client-side*) menggunakan **Zustand**. 

**Tanggung Jawab Utama `useEditorStore`:**
- **`activeBlocks`**: Array JSON penyimpan status seluruh blok yang sedang dirender (urutan blok, status tersembunyi/ditampilkan, data teks *inline*).
- **`themeSettings`**: Menyimpan variabel global desain (warna aksen HEX, jenis font, gaya kartu/tombol).
- **`isDirty` & `isSaving`**: Boolean yang bertugas melacak apakah ada perubahan yang belum tersimpan ke *database*. Mencegah pengguna keluar atau memublikasikan tanpa menyimpan.
- **`draftMode`**: Melacak apakah pengguna sedang mengedit *Draft* (versi revisi) atau *Live* (versi publik).

### 2. Alur Data (Optimistic UI & Debouncing)
Sistem tidak membebani server dengan melakukan POST request setiap kali *mouse* digeser. 
- **Optimistic UI:** Saat pengguna mengganti warna atau menggeser blok, Zustand *store* langsung diperbarui. Kanvas (*Preview*) bereaksi secara instan tanpa menunggu balasan *server*.
- **Debounced Autosave:** Menggunakan pustaka `use-debounce`, perubahan ditahan sesaat (misalnya 1 detik setelah pengguna berhenti berinteraksi). Setelah jeda tercapai, state dikirim secara asinkron (background) ke API `/api/blocks/update`.

### 3. Penanganan Render (GSAP Anti-Flickering)
Untuk mencegah *Flickering Animation* (UI berkedut) saat merender ulang blok secara terus-menerus, animasi GSAP/Framer Motion pada komponen portofolio dimatikan (dinonaktifkan) saat *props* `isEditMode = true` terdeteksi. Hal ini membuat pengalaman modifikasi *snappy* (seketika).

---

## BAB 2: Struktur File & Komponen

Semua elemen UI penyusun editor berada di `src/features/appearance/ui/` dan *shared controls* di `components/editor-controls/`. 

### A. The Shell (Cangkang Editor Utama)
- **`LeftPanel.tsx`**: Panel sisi kiri yang menampung navigasi utama (Tab Theme, Pages, Resume) dan menampung daftar blok (menggunakan pustaka *Drag & Drop* misal `@dnd-kit`).
- **`RightPanel.tsx`**: Panel dinamis di sisi kanan yang merender pengaturan spesifik (seperti pengaturan Gallery Pro) berdasarkan tab yang sedang aktif di Left Panel.
- **`PreviewPanel.tsx`**: Pembungkus area tengah (Kanvas). Area ini merender portofolio menggunakan simulasi *iframe* atau kontainer terisolasi yang diinjeksi CSS variables langsung dari Zustand.

### B. Floating Controls (UI Melayang)
- **`EditorControls.tsx`**: Panel melayang (*floating toolbars*) yang muncul di atas komponen saat di-hover. Memiliki ikon aksi (Mata untuk *Hide*, Panah untuk *Move*, dll).
- **`SharedControls.tsx`**: Kumpulan *switchers* UI statis yang berisi `ColorPicker`, `FontPicker`, `CardStylePicker`, `ButtonShapePicker`, dan `GalleryLayoutPicker`.
- **`GlobalCursor.tsx`**: Pelacak *mouse* kustom yang memberikan isyarat visual (*visual cue*) saat pengguna menyorot teks yang bisa diedit.

### C. Sistem Modal (Dialog Overlay)
Terdapat 8 Modal penting pendukung Editor:
1. `ThemeSelectionModal.tsx` (Galeri Preset Tema)
2. `DraftManagerModal.tsx` (Version Control / Riwayat Draft)
3. `SaveDraftModal.tsx` (Input nama Draft baru)
4. `ProjectSelectionModal.tsx` (Pilihan proyek untuk di-*pin* ke halaman utama)
5. `ProUpgradeModal.tsx` (Paywall untuk fitur Premium/Supreme)
6. `PublishSuccessModal.tsx` (Notifikasi sukses publikasi)
7. `OfflineModal.tsx` (Peringatan saat koneksi internet terputus)
8. `SeoSettingsModal.tsx` (Pengaturan Meta tags & OpenGraph)

---

## BAB 3: Alur Pengguna & Detail Fitur (User Flow)

Bagian ini mendaftar secara rinci apa saja opsi dan *tools* yang tersedia bagi pengguna saat mereka berhadapan dengan Appearance Editor.

### 1. Tab "THEME" (Pengaturan Tema Visual)
Tab ini merupakan rumah bagi penyesuaian estetika dasar situs.
- **Templates Selector:** Menampilkan 18+ preset tata letak eksklusif (Minimalist, BentoGrid, Spatial, Nexus Noir, dll).
- **Color Picker (Accent Color):** Pemilihan warna utama dengan input HEX atau 7 preset warna bawaan.
- **Typography Font:** 3 kategori pilihan Font global (Monospace/Modern/Elegant).
- **Project Card Style:** Mengubah bentuk tepian kartu proyek (`Brutalism` / `Clean Flat` / `Soft Drop Shadow`).
- **Element Shape:** Mengubah bentuk komponen *button* dan *badge* (`Square` / `Rounded` / `Pill`).
- **Content Manager:** Tombol untuk memilih proyek spesifik (Projects) dan tombol mengakses riwayat *Saved Drafts*.

### 2. Tab "PAGES" (Manajemen Halaman & Blok)
Tab ini mengatur arsitektur informasi dan urutan presentasi situs.
- **Main Page (Landing):**
  - Mengakses `SectionReorderPanel` di mana pengguna dapat men-drag dan meletakkan (*drag-and-drop*) urutan blok portofolio.
- **Gallery Showcase (PRO Feature):**
  - Hanya aktif jika pengguna berlangganan (Supreme) dan memiliki >4 proyek foto/video.
  - Membuka akses ke **Gallery Design** (*Minimal Museum, Editorial Mag, Frosted Glass, Cyber Tech, Neo-Brutalist*).
  - Membuka akses ke **Gallery Layout** pola masonry dinamis (*Editorial, Masonry, Grid, Fluid*).

### 3. Tab "RESUME" (CV Builder Interaktif)
Membuka area spesifik untuk membangun *Curriculum Vitae* yang dapat diekspor.
- Mengubah *Preview Canvas* menjadi kertas A4 interaktif (*inline-text edit*).
- **CV Templates:** Pilihan desain *Harvard ATS, Minimalist,* atau *Creative*.
- **Aksi Cepat:** Tombol "Save CV" (ke database) dan "Download PDF" (memanfaatkan fitur render *print/postMessage* ke *iframe*).

### 4. Kontrol Mengambang Spesifik (Mobile Dock & SEO)
- **Mobile Floating Dock:** Bar kecil di bawah layar untuk layar ponsel, menyediakan tombol ringkas untuk *Save*, *Publish*, dan membuka menu (Sliders).
- **Status Publikasi (Drafting):** Indikator UI cerdas (LIVE, CHANGES, DRAFT) yang memberi tahu pengguna jika editan mereka sudah tayang di publik atau baru sekadar konsep di *database*.

---
*Dokumen ini merupakan panduan lengkap dari tingkat arsitektur (Zustand & FSD) hingga representasi UX/UI pada Appearance Editor Portfobe.*
