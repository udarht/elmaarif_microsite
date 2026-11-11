# 🛡️ PANDUAN & ATURAN KERJA PROYEK: ELMAARIF MICROSITE
> **Status:** AKTIF & WAJIB DIPATUHI SETIAP SESI  
> **Lokasi Workspace:** `D:\02_-_RHT_-_Proyek\saas_adayu\elmaarif_microsite`  
> **Fokus Utama:** El-Ma'arif Microsite (Independen & Terisolasi Penuh)

---

## 1. 🚨 PRINSIP ISOLASI TOTAL & KEAMANAN GIT
1. **Larangan Keras Git Commit & Git Push:**
   - DILARANG KERAS menjalankan perintah `git commit` dan APALAGI `git push`.
   - Agen hanya diperbolehkan membantu penulisan kode, penyesuaian file, atau pengecekan lokal. Proses commit dan push sepenuhnya adalah otoritas manual oleh User.
2. **Tidak Mencampuradukkan Sistem:**
   - Folder dan workspace ini **hanya** untuk proyek `elmaarif_microsite`.
   - DILARANG mengimpor, mereferensikan, menyalin asumsi, atau menggabungkan arsitektur, basis data, konfigurasi, token, atau logika bisnis dari aplikasi lain (baik proyek induk `saas_adayu`, aplikasi saas lain, maupun proyek sampingan) ke dalam folder ini tanpa instruksi eksplisit tertulis dari User.
3. **Kemandirian Workspace (Self-Contained):**
   - Semua dependensi, konfigurasi environment (`.env`), skrip build, aset, dan dokumentasi harus berada di dalam root folder `elmaarif_microsite`.
   - Jangan menyentuh, mengubah, atau membuat dependensi ke folder di luar workspace ini (`../` atau folder tetangga).
4. **Pembersihan Konteks / Anti-Hallucination:**
   - Jangan mengasumsikan fitur, skema tabel, atau alur kerja dari aplikasi lain yang pernah dirancang di sesi-sesi sebelumnya.
   - Bila ragu mengenai kebutuhan spesifik `elmaarif_microsite`, selalu tanyakan dan konfirmasi ke User terlebih dahulu.

---

## 2. 🎯 IDENTITAS & TUJUAN PROYEK
- **Nama Proyek:** El-Ma'arif Microsite (`elmaarif_microsite`)
- **Tipe Aplikasi:** Microsite / Landing Page & Web Portal terpadu untuk El-Ma'arif.
- **Fokus Desain & Performa:** Ringan, responsif, cepat diakses (mobile-first), ramah SEO, dan berfokus pada kemudahan navigasi informasi dan konversi audiens.

---

## 3. 📋 ATURAN PENGEMBANGAN & KODE (CODING RULES)
1. **Struktur Direktori yang Rapi & Terisolasi:**
   - Buat struktur modular dan terpisah dengan jelas (komponen, halaman, aset, styles, utils).
   - Jangan menaruh file kerja sementara sembarangan.
2. **Pengelolaan Environment & Sensitif:**
   - Semua kredensial/API keys harus ditaruh di `.env.local` atau `.env` dan didaftarkan ke `.gitignore`.
   - Sediakan `.env.example` yang jelas tanpa mengekspos data rahasia.
3. **Dokumentasi Terintegrasi:**
   - Setiap fitur atau modul baru yang signifikan harus terdokumentasi (misal di `README.md` atau dokumen arsitektur lokal).
4. **Perubahan & Refactoring Bertahap:**
   - Kerjakan setiap task secara terukur, verifikasi langkah demi langkah, dan jangan merombak kode di luar lingkup tugas yang diminta.

---

## 4. 🧠 ATURAN MEMORI AGENT (AI BEHAVIORAL DIRECTIVES)
- **Cek `GEMINI.md` Terlebih Dahulu:** Sebelum mengeksekusi instruksi besar, ingat kembali bahwa lingkup kerja terbatas HANYA pada `elmaarif_microsite`.
- **Pertahankan Konsistensi Bahasa:** Komunikasi dengan User menggunakan Bahasa Indonesia yang lugas, profesional, dan solutif.
- **Konfirmasi Desain:** Untuk pemilihan stack (framework frontend/backend, styling, database), diskusikan dan pastikan sesuai spesifikasi yang disetujui User untuk El-Ma'arif Microsite.
