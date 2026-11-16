# Portal e-Supervisi & Etalase Perangkat Ajar — SMP S El Ma'arif Boarding School

Microsite resmi berbasis web statis untuk transparansi, akuntabilitas, dan kemudahan akses administrasi perangkat ajar dewan guru **SMP S El Ma'arif Boarding School** (NPSN: `69979463`) bagi Kepala Sekolah, Tim Pengawas Sekolah, dan Dinas Pendidikan.

---

## ✨ Fitur Utama

- **Etalase Perangkat Ajar & Matriks Supervisi (`/`)**
  Menampilkan daftar guru dalam mode **Kartu** maupun **Tabel Matriks Supervisi** lengkap dengan ringkasan kelengkapan dokumen.
- **Pencarian & Filter Instan**
  Filter cepat berdasarkan nama/kata kunci, Mata Pelajaran, Kelas, dan Kategori Dokumen.
- **Pratinjau Dokumen & Detail Guru**
  Drawer pratinjau berkas dan modal detail perangkat ajar per guru tanpa perlu berpindah halaman.
- **Dokumen Induk Sekolah**
  Akses cepat ke dokumen acuan sekolah seperti KOSP, Kalender Pendidikan, SK Pembagian Tugas, dan Jadwal Pelajaran.
- **Generator QR Code**
  Membuat QR Code secara langsung untuk tautan dokumen atau folder guru agar mudah dibagikan dan dipindai.
- **Halaman Khusus & Shortlink**
  - `/guru/[slug_guru]` — Halaman profil dan daftar perangkat ajar per guru.
  - `/rekap-dinas` — Halaman rekapitulasi untuk kebutuhan pengawasan/dinas.
  - `/s/[short_slug]` — Tautan ringkas (*shortlink*) menuju folder atau dokumen perangkat ajar.
- **Siap Cloudflare Pages (`_redirects` & `_headers` Otomatis)**
  Saat build, skrip `scripts/generate-redirects.js` otomatis menghasilkan aturan redirect (`/kosp`, `/kaldik`, `/sk-tugas`, `/jadwal`, `/s/*`) dan header cache Cloudflare Pages di folder `static/`.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5 Runes)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Ikon & Utilitas:** `@lucide/svelte`, `qrcode`
- **Adapter:** `@sveltejs/adapter-static` (output statis ke folder `build/`)

---

## 📋 Prasyarat

Pastikan perangkat Anda sudah terpasang:
- [Node.js](https://nodejs.org/) (disarankan versi LTS terbaru)
- `npm` (sudah termasuk bersama Node.js)

---

## 🚀 Cara Menjalankan di Lokal

1. **Clone repositori ini**
   ```sh
   git clone https://github.com/udarht/elmaarif_microsite.git
   cd elmaarif_microsite
   ```

2. **Install dependensi**
   ```sh
   npm install
   ```

3. **Jalankan server pengembangan (*development*)**
   ```sh
   npm run dev
   ```
   Atau langsung buka di browser:
   ```sh
   npm run dev -- --open
   ```

---

## 📦 Perintah yang Tersedia

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server lokal untuk pengembangan (`vite dev`). |
| `npm run check` | Menjalankan sinkronisasi SvelteKit dan pengecekan tipe TypeScript (`svelte-check`). |
| `npm run check:watch` | Menjalankan `svelte-check` dalam mode *watch*. |
| `npm run build` | Menjalankan `scripts/generate-redirects.js` lalu membangun aplikasi statis ke folder `build/`. |
| `npm run preview` | Menjalankan pratinjau lokal dari hasil `npm run build`. |

---

## 🗂️ Struktur Proyek

```text
elmaarif_microsite/
├── scripts/
│   └── generate-redirects.js   # Pembangkit static/_redirects & static/_headers saat build
├── src/
│   ├── lib/
│   │   ├── components/         # Komponen UI (Banner, Omnibar, Card, Matrix, Modal, Drawer)
│   │   ├── data/               # Sumber data JSON (sekolah, guru, kategori dokumen)
│   │   ├── types/              # Definisi tipe TypeScript
│   │   └── utils/              # Fungsi bantu kalkulasi statistik & filter
│   └── routes/                 # Routing halaman SvelteKit (/, /guru, /rekap-dinas, /s)
├── static/                     # Aset statis, logo, robots.txt, _redirects, _headers
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ✏️ Menyesuaikan Data

Seluruh konten utama microsite bersumber dari file JSON di `src/lib/data/`:

- **`src/lib/data/school_config.json`** — Identitas sekolah, tahun pelajaran, sambutan kepala sekolah, info pengawas, dan daftar Dokumen Induk Sekolah.
- **`src/lib/data/teachers.json`** — Daftar dewan guru, *shortlink* folder utama, dan daftar perangkat ajar masing-masing guru.
- **`src/lib/data/categories.json`** — Daftar kategori dokumen perangkat ajar.

Setelah mengubah file data di atas, jalankan `npm run build` agar file `static/_redirects` ikut diperbarui secara otomatis.

---

## 🌐 Deployment

Proyek ini menggunakan `@sveltejs/adapter-static` dengan output di direktori `build/` dan `fallback: "404.html"`. Anda dapat men-deploy folder `build/` ke layanan *static hosting* apa pun, terutama **Cloudflare Pages** (yang mendukung penuh `static/_redirects` dan `static/_headers`):

- **Build command:** `npm run build`
- **Build output directory:** `build`

---

## 🤝 Kontribusi

Kontribusi untuk perbaikan tampilan, aksesibilitas, maupun dokumentasi sangat terbuka:
1. *Fork* repositori ini.
2. Buat *branch* baru untuk perubahan Anda (`git checkout -b fitur/nama-fitur`).
3. Pastikan `npm run check` dan `npm run build` berjalan tanpa error.
4. Ajukan *Pull Request* dengan deskripsi perubahan yang jelas.
