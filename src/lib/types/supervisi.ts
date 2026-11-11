export type TipeFile =
	| 'GDRIVE_FOLDER'
	| 'PDF'
	| 'GDOC'
	| 'GSHEET'
	| 'CANVA'
	| 'INTERAKTIF_3D';

export type StatusVerifikasi = 'LENGKAP' | 'REVISI' | 'PROSES';

export interface DokumenInduk {
	id: string;
	judul: string;
	tipe: string;
	url: string;
	deskripsi: string;
}

export interface KepalaSekolah {
	nama: string;
	nip: string;
	foto_url: string;
	sambutan_singkat: string;
}

export interface InfoPengawas {
	pesan_selamat_datang: string;
	panduan_akses_cepat: string;
}

export interface SchoolConfig {
	sekolah_id: number;
	nama_sekolah: string;
	npsn: string;
	tahun_pelajaran: string;
	semester: string;
	alamat?: string;
	kontak?: {
		email?: string;
		telepon?: string;
		website?: string;
	};
	kepala_sekolah: KepalaSekolah;
	info_pengawas: InfoPengawas;
	dokumen_induk_sekolah: DokumenInduk[];
}

export interface Category {
	kode_kategori: string;
	nama_kategori: string;
	deskripsi?: string;
	ikon: string;
	wajib_supervisi: boolean;
}

export interface PerangkatAjar {
	id_dokumen: string;
	kode_kategori: string;
	judul_dokumen: string;
	kelas_target: string;
	tipe_file: TipeFile;
	target_url: string;
	short_slug: string;
	status_verifikasi: StatusVerifikasi;
	updated_at: string;
}

export interface Teacher {
	id_unit: number;
	slug_guru: string;
	nama_lengkap: string;
	gelar_status: string;
	mapel_diampu: string[];
	fase_kelas: string[];
	avatar_url: string;
	folder_utama_url: string;
	short_folder: string;
	perangkat_ajar: PerangkatAjar[];
}

export interface TeacherStats {
	totalDokumen: number;
	dokumenWajibTerpenuhi: number;
	totalKategoriWajib: number;
	persentaseKelengkapan: number;
	kategoriTerpenuhi: Set<string>;
}

export interface SchoolSupervisiStats {
	totalGuru: number;
	totalDokumen: number;
	rataRataKesiapan: number;
	dokumenLengkap: number;
	dokumenProses: number;
	dokumenRevisi: number;
}
