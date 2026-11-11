# BLUEPRINT ARSITEKTUR & SKEMA DATA STATIS E-SUPERVISI (PORTAL PERANGKAT AJAR & SUPERVISI DIGITAL)
**Proyek:** Ekosistem Digital Sekolah (Standalone Serverless Microsite)  
**Modul:** `esupervisi-portal` (Etalase Perangkat Ajar, Kinerja Guru & Akses Pengawas/Dinas)  
**Hosting & Infrastruktur:** 100% Static Deployment di Cloudflare Pages (`@sveltejs/adapter-static`) — **Zero VPS / Zero Database**  
**Target Pengguna:** Pengawas Sekolah, Tim Dinas Pendidikan, Kepala Sekolah, dan Dewan Guru SMP El Ma'arif Boarding School  
** Tahun Pelajaran:** 2026/2027  
**Tanggal Rancangan:** 11 November 2026  

---

## 1. Analisis Kebutuhan & Strategi Arsitektur "Zero-Database"

Kebutuhan mendesak untuk menyediakan satu pintu akses (Single Portal) bagi Pengawas Sekolah dan Dinas Pendidikan guna memeriksa kelengkapan perangkat ajar, administrasi kelas, serta dokumentasi pembelajaran guru tanpa membebani VPS ataupun memerlukan setup database baru.

### A. Solusi Penyimpanan Data (Static JSON / Flat-File Engine)
- **Zero Database di VPS:** Seluruh data profil sekolah, daftar guru (PTK), mata pelajaran, dan tautan perangkat ajar disimpan dalam file statis terstruktur di dalam repositori (`src/lib/data/supervisi_db.json`).
- **Kecepatan & Keandalan Maksimal:** Karena di-compile menjadi aset statis di jaringan Edge Cloudflare Pages, waktu muat halaman (TTFB) berada di bawah 50ms, bebas risiko *database down*, dan 100% gratis.
- **Kemudahan Update Data:** Penambahan atau perubahan link Google Drive/dokumen guru cukup dilakukan dengan mengedit file JSON (atau konversi cepat dari tabel Excel/CSV menggunakan script lokal) lalu *push* ke GitHub untuk memicu *auto-deploy* Cloudflare Pages.

### B. Solusi Shortlink Internal & Eksternal (Dual-Mode Routing)
Agar tautan perangkat ajar rapi dan mudah diakses oleh pengawas, microsite ini sekaligus berfungsi sebagai **Custom Shortener Engine**:
1. **Dynamic Client/Edge Redirect (`/s/[slug]`):**  
   Contoh: `supervisi.adayu.id/s/inf-7-modul` otomatis me-redirect pengawas ke link Google Drive asli milik guru yang bersangkutan.
2. **File `_redirects` Native Cloudflare Pages:**  
   Saat proses *build* (`npm run build`), script otomatis men-generate file `static/_redirects` dari data JSON sehingga redirect berjalan langsung di level Edge Cloudflare (instan tanpa menunggu rendering JS).

---

## 2. Standar Teknologi (Tech Stack)

1. **Framework:** SvelteKit (Svelte 5 dengan Runes API: `$state`, `$derived`, `$effect`).
2. **Build Adapter:** `@sveltejs/adapter-static` (Full Prerendered / SPA Fallback untuk dynamic slug).
3. **Styling & UI:** Tailwind CSS v4 + DaisyUI v5 (Tema Modern Glassmorphism & Bento Grid, mendukung Mode Terang/Gelap yang ramah mata pengawas).
4. **Aset & Foto Guru:** Disimpan di `static/avatars/` atau diambil langsung dari CDN `cdn.adayu.id`.
5. **Fitur Tambahan Client-Side:**
   - Generator QR Code instan per guru / per dokumen (untuk dicetak di berkas fisik bila pengawas minta bukti cetak).
   - Drawer Previewer (pratinjau dokumen PDF/Google Drive langsung di dalam portal tanpa perlu pindah tab).

---

## 3. Rincian Skema Data JSON (`src/lib/data/`)

Meskipun tidak menggunakan PostgreSQL, struktur JSON dirancang berelasi rapi mengikuti standar `sekolah_id` dan `id_unit` agar ke depannya siap di-import ke modul `datacenter` kapan saja.

### 1) `school_config.json` (Identitas & Statistik Ringkas Sekolah)
Menyimpan metadata kepala sekolah, pengawas, dan informasi tahun pelajaran aktif.
- `sekolah_id` (`number`) — Default: `1`
- `nama_sekolah` (`string`) — `"SMP El Ma'arif Boarding School"`
- `npsn` (`string`)
- `tahun_pelajaran` (`string`) — `"2026/2027"`
- `semester` (`string`) — `"Ganjil"` / `"Genap"`
- `kepala_sekolah` (`object`: `{ nama, nip, foto_url, sambutan_singkat }`)
- `info_pengawas` (`object`: `{ pesan_selamat_datang, panduan_akses_cepat }`)
- `dokumen_induk_sekolah` (`array`) — Link KOSP/KTSP, Kalender Pendidikan, SK Pembagian Tugas, Jadwal Pelajaran Umum.

### 2) `categories.json` (Master Kategori Perangkat Ajar)
Mengelompokkan jenis dokumen agar pengawas bisa memfilter per instrumen supervisi:
- `kode_kategori` (`string` PK) — Contoh: `'ATP_CP'`, `'MODUL_AJAR'`, `'PROTA_PROMES'`, `'ASESMEN'`, `'MEDIA_AJAR'`, `'JURNAL_GURU'`
- `nama_kategori` (`string`) — Contoh: `'CP & Alur Tujuan Pembelajaran (ATP)'`, `'Modul Ajar / RPP'`
- `ikon` (`string`) — Nama ikon Lucide/Heroicons
- `wajib_supervisi` (`boolean`) — Penanda dokumen wajib untuk perhitungan persentase kelengkapan (Progress Bar).

### 3) `teachers.json` (Master Data Guru & Portofolio Perangkat)
Satu objek mewakili satu guru beserta daftar tautan perangkat ajarnya.
- `id_unit` (`number`) — ID sekuensial unik guru (`1, 2, 3...`)
- `slug_guru` (`string`) — Unik untuk URL profil langsung (contoh: `'pak-skom'`, `'ismy-azizah'`)
- `nama_lengkap` (`string`) — Contoh: `'Ismy Azizah, S.Pd.'`, `'Lutfhi Laila Adhi, S.Pd, Gr.'`, `'Witri Yanti, S.Pd, Gr.'`, `'Anggia Fitri Yuni, S.Pd, Gr.'`, `'Anggun Kurnia, S.Pd.'`, `'Ranti Dwi Sarlin, S.Pd, Gr.'`, `'Sofya Murti Lubis, S.Pd, Gr.'`
- `gelar_status` (`string`) — Contoh: `'Guru Tersertifikasi (Gr.)'`, `'Guru Mapel'`
- `mapel_diampu` (`array of string`) — Contoh: `['Informatika', 'Koding dan Kecerdasan Artifisial']`
- `fase_kelas` (`array of string`) — Contoh: `['Fase D', 'Kelas VII', 'Kelas VIII', 'Kelas IX']`
- `avatar_url` (`string`)
- `folder_utama_url` (`string`) — Link Google Drive Folder Induk milik guru tersebut
- `short_folder` (`string`) — Shortlink internal (contoh: `'drive-skom'`)
- `perangkat_ajar` (`array of objects`):
  - `id_dokumen` (`string`) — Contoh: `'DOC-01-01'`
  - `kode_kategori` (`string` FK ke `categories.json`)
  - `judul_dokumen` (`string`) — Contoh: `'Modul Ajar Informatika Kelas VII - Berpikir Komputasional'`
  - `kelas_target` (`string`) — `'VII'`, `'VIII'`, `'IX'`, atau `'Semua Kelas'`
  - `tipe_file` (`string`) — `'GDRIVE_FOLDER'`, `'PDF'`, `'GDOC'`, `'GSHEET'`, `'CANVA'`, `'INTERAKTIF_3D'`
  - `target_url` (`string`) — URL asli Google Drive / Canva / Media Interaktif
  - `short_slug` (`string`) — Slug pendek untuk `/s/[short_slug]`
  - `status_verifikasi` (`string`) — `'LENGKAP'`, `'REVISI'`, `'PROSES'`
  - `updated_at` (`string`) — Tanggal pembaruan terakhir (`'2026-11-10'`)

---

## 4. Fitur UI/UX Interaktif & Modern (Fokus Pengawas & Dinas)

Dirancang agar pengawas tidak bingung mencari dokumen dan terkesan dengan kerapian digitalisasi sekolah:

### A. Executive Summary Dashboard (Hero Bento Grid)
Saat pengawas membuka halaman utama, langsung tersaji ringkasan eksekutif real-time (dihitung otomatis via `$derived` dari JSON):
- **Total Guru Terdata** & **Persentase Kesiapan Supervisi Sekolah** (misal: `94% Dokumen Terunggah`).
- **Akses Cepat Dokumen Induk Sekolah:** Tombol langsung ke KOSP, SK Pembagian Tugas 2026/2027, dan Kalender Pendidikan.
- **Mode Tampilan Pengawas (Inspector View Toggle):** Pilihan tampilan **Grid Kartu Modern** (visual dengan foto guru & progress bar) atau **Tabel Matriks Supervisi** (tampilan tabel padat ceklis kelengkapan seluruh guru dalam satu layar).

### B. Instant Omnibar Search & Multi-Filter (Zero Reload)
- Pencarian *real-time* berdasarkan **Nama Guru**, **Mata Pelajaran**, **Kelas (VII / VIII / IX)**, atau **Jenis Perangkat (Modul Ajar, ATP, Asesmen, Media)**.
- Filter klik cepat (Pills): `Semua Mapel`, `Informatika & Koding AI`, `Matematika`, `B. Indonesia`, `IPA`, `IPS`, dll.

### C. Interactive Teacher Drawer & In-App Document Preview
Ketika kartu seorang guru diklik:
- Membuka **Slide-over Drawer / Modal Modern** berisi daftar lengkap perangkat ajar guru tersebut yang dikelompokkan per kategori dan kelas.
- **Tombol "Pratinjau Cepat" (Embed Preview):** Jika link berupa Google Drive PDF/Doc, pengawas bisa langsung membaca dokumen di layar samping tanpa meninggalkan halaman microsite.
- **Tombol "Salin Shortlink" & "Tampilkan QR Code":** Memudahkan pembagian tautan pendek (`.../s/modul-inf-7`) melalui WhatsApp atau proyektor saat rapat pembinaan.

### D. Mode Cetak Laporan Supervisi (`window.print()` Ready)
- Dilengkapi CSS `@media print` khusus: jika Pengawas menekan tombol **"Cetak Rekap Kelengkapan"**, halaman otomatis merender tabel rekapitulasi resmi lengkap dengan kop sekolah dan kolom tanda tangan Kepala Sekolah serta Pengawas.

---

## 5. Arsitektur Routing SvelteKit

| Route Path | Fungsi Halaman | Mekanisme Render |
|---|---|---|
| `/` | Dashboard Utama Portal Supervisi, Statistik, Filter Mapel/Kelas, Grid Guru & Tabel Matriks | Static Prerender (`prerender = true`) |
| `/guru/[slug_guru]` | Halaman Profil & Portofolio Lengkap Perangkat Ajar per Guru (Bisa dijadikan link bio guru) | Static Prerender via `entries()` dari `teachers.json` |
| `/s/[short_slug]` | Mesin Shortlink Redirector dengan animasi transisi singkat *"Mengarahkan ke Perangkat Ajar..."* | Prerender + Fallback `_redirects` Cloudflare |
| `/rekap-dinas` | Tampilan Tabel Matriks Ceklis Supervisi 100% Guru (Siap Ekspor/Print PDF untuk laporan pengawas) | Static Prerender (`prerender = true`) |