# ROLE & OBJECTIVE
Kamu adalah Senior Frontend Architect & UI/UX Engineer. Tugasmu adalah membangun aplikasi web microsite statis bernama **Portal e-Supervisi & Etalase Perangkat Ajar Sekolah** menggunakan **SvelteKit (Svelte 5 Runes)**, **Tailwind CSS v4**, **DaisyUI v5**, dan **`@sveltejs/adapter-static`** untuk di-deploy langsung ke **Cloudflare Pages** tanpa database eksternal dan tanpa backend VPS.

Seluruh acuan desain data, fitur interaktif, dan struktur routing wajib mengikuti dokumen referensi: `blueprint_esupervisi_microsite_statis.md`.

---

# CRITICAL RULES (WAJIB DIPATUHI)
1. **DILARANG MELAKUKAN GIT COMMIT DAN GIT PUSH (STRICT NO GIT MUTATION):**
   - Kamu **DILARANG KERAS** menjalankan perintah `git commit`, `git push`, atau mengubah commit history git dalam bentuk apapun.
2. **DILARANG EKSEKUSI SEKALIGUS (PHASED WORKFLOW):**
   - Bekerjalah secara bertahap mengikuti 4 Fase di bawah ini.
   - Setiap selesai 1 Fase, kamu WAJIB berhenti, menampilkan ringkasan hasil kerjamu, dan menunggu instruksi `"LANJUT FASE [X]"` dari USER.
3. **100% SERVERLESS & STATIC (CLOUDFLARE PAGES READY):**
   - Jangan gunakan database SQL, Prisma, atau endpoint server yang membutuhkan Node.js runtime terus-menerus.
   - Seluruh data bersumber dari file JSON statis di `src/lib/data/` dan wajib kompatibel penuh dengan `@sveltejs/adapter-static`.
4. **SVELTE 5 RUNES & MODERN UI:**
   - Gunakan sintaks Svelte 5 murni (`$state`, `$derived`, `$props`, `$effect`). Jangan gunakan sintaks lama `export let` atau `$:`.
   - Desain harus terlihat sangat modern, bersih, berwibawa untuk Pengawas/Dinas Pendidikan, responsif di HP maupun layar proyektor, dan memiliki fitur ganti mode tampilan (Grid Kartu vs Tabel Matriks Supervisi).

---

# TAHAPAN EKSEKUSI (PHASED WORKFLOW)

## FASE 1: Inisialisasi Struktur Proyek & Skema Data JSON Statis
1. Periksa struktur proyek SvelteKit saat ini dan pastikan `@sveltejs/adapter-static`, Tailwind CSS, dan ikon (Lucide) terkonfigurasi dengan benar untuk Cloudflare Pages (`svelte.config.js`).
2. Buat struktur data JSON di `src/lib/data/`:
   - `school_config.json`: Berisi identitas **SMP El Ma'arif Boarding School**, Tahun Pelajaran **2026/2027**, sambutan singkat untuk Pengawas/Dinas Pendidikan, serta link Dokumen Induk Sekolah (KOSP, Kalender Pendidikan, SK Pembagian Tugas).
   - `categories.json`: Master kategori instrumen perangkat ajar (`ATP & CP`, `Modul Ajar`, `Prota & Promes`, `Instrumen Asesmen`, `Media Pembelajaran Interaktif`, `Jurnal Mengajar`).
   - `teachers.json`: Data riil dewan guru Fase D (Kelas VII, VIII, IX) lengkap dengan sampel portofolio perangkat ajar dan `short_slug` masing-masing:
     1. **Pak S.Kom** (Informatika & Koding dan Kecerdasan Artifisial - Kelas VII, VIII, IX, termasuk karya media interaktif *"Cara Kerja Komponen Komputer - Eksplorasi Visual 3D Real-time & Simulasi Alur Siklus Pemrosesan Data (IPOS)"*)
     2. **Ismy Azizah, S.Pd.**
     3. **Lutfhi Laila Adhi, S.Pd, Gr.**
     4. **Witri Yanti, S.Pd, Gr.**
     5. **Anggia Fitri Yuni, S.Pd, Gr.**
     6. **Anggun Kurnia, S.Pd.**
     7. **Ranti Dwi Sarlin, S.Pd, Gr.**
     8. **Sofya Murti Lubis, S.Pd, Gr.**
3. Buat helper/service di `src/lib/utils/supervisi.ts` untuk menghitung statistik otomatis (persentase kelengkapan per guru, total dokumen sekolah, pencarian, dan pemetaan shortlink).
*Berhenti setelah Fase 1 selesai dan laporkan struktur file yang telah dibuat kepada USER.*

## FASE 2: Komponen UI Interaktif, Dashboard Utama (`/`) & Matriks Pengawas
Setelah Fase 1 disetujui USER:
1. Bangun halaman utama `src/routes/+page.svelte` dengan komponen modular:
   - **Header & Executive Bento Banner:** Menampilkan identitas SMP El Ma'arif Boarding School (TP 2026/2027), metrik kesiapan perangkat ajar sekolah (Progress Radial/Bar), dan tombol akses cepat Dokumen Induk Sekolah.
   - **Smart Filter & Omnibar:** Input pencarian instan (`$state`) berdasarkan nama guru/mapel/judul dokumen, filter tingkat kelas (`Semua`, `Kelas VII`, `Kelas VIII`, `Kelas IX`), filter kategori perangkat, serta tombol pengubah tampilan (**Mode Kartu Visual** vs **Mode Matriks Ceklis Pengawas**).
   - **Grid Kartu Guru (`TeacherCard.svelte`):** Menampilkan foto/avatar, nama & gelar (`Gr.`), badge mata pelajaran, indikator persentase kelengkapan perangkat, tombol buka folder Google Drive utama, dan tombol **"Lihat Perangkat"**.
   - **Tabel Matriks Supervisi (`SupervisiMatrix.svelte`):** Tabel komprehensif yang menampilkan baris nama seluruh guru dan kolom ceklis kategori perangkat (`ATP`, `Modul`, `Prota/Promes`, `Asesmen`, `Media`) beserta tombol aksi langsung buka dokumen.
*Berhenti setelah Fase 2 selesai dan minta review USER.*

## FASE 3: Drawer Detail Perangkat, In-App Document Previewer & QR Shortlink
Setelah Fase 2 disetujui USER:
1. Buat komponen **Interactive Teacher Drawer / Modal (`TeacherDetailModal.svelte`)**:
   - Menampilkan rincian seluruh perangkat ajar guru yang dipilih, dikelompokkan rapi per kategori atau kelas.
   - Setiap item perangkat memiliki 3 tombol aksi cepat: **Buka Link Asli**, **Pratinjau Dokumen (Embed Drawer)**, dan **Salin Shortlink (`/s/[slug]`)** dengan notifikasi toast.
2. Buat halaman profil mandiri per guru di `src/routes/guru/[slug_guru]/+page.svelte` (dengan `entries()` untuk prerender statis) agar setiap guru punya URL portofolio eksklusif.
3. Tambahkan modal generator **QR Code** ringan (menggunakan SVG/Canvas client-side) agar setiap shortlink guru bisa di-scan langsung oleh Pengawas menggunakan HP/Tablet.
*Berhenti setelah Fase 3 selesai dan laporkan kepada USER.*

## FASE 4: Mesin Shortlink (`/s/[short_slug]`), Auto-Generator `_redirects` & Mode Cetak Dinas
Setelah Fase 3 disetujui USER:
1. Buat route `src/routes/s/[short_slug]/+page.svelte` yang menangani redirect cerdas ke URL target dokumen/Google Drive guru, dilengkapi kartu informasi dokumen dan hitung mundur instan (0.5 detik) jika dibuka di browser.
2. Buat script otomatis (`scripts/generate-redirects.js`) yang terintegrasi dengan `npm run build` untuk membaca `teachers.json` dan `school_config.json`, lalu men-generate file `static/_redirects` sesuai format standar Cloudflare Pages.
3. Buat halaman/fitur **Cetak Laporan Supervisi (`/rekap-dinas`)** dengan stylesheet `@media print` resmi (Kop Sekolah, Tabel Matriks Kelengkapan Perangkat Ajar Guru TP 2026/2027, dan blok tanda tangan Kepala Sekolah & Pengawas Pembina).
4. Jalankan `npm run build` untuk memverifikasi seluruh route berhasil di-prerender menjadi aset statis siap unggah ke Cloudflare Pages tanpa error.
*Berhenti dan laporkan hasil akhir build kepada USER.*