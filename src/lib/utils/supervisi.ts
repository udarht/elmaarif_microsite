import type {
	SchoolConfig,
	Category,
	Teacher,
	TeacherStats,
	SchoolSupervisiStats,
	PerangkatAjar
} from '../types/supervisi';
import schoolConfigData from '../data/school_config.json';
import categoriesData from '../data/categories.json';
import teachersData from '../data/teachers.json';

export const schoolConfig: SchoolConfig = schoolConfigData as unknown as SchoolConfig;
export const categories: Category[] = categoriesData as unknown as Category[];
export const teachers: Teacher[] = teachersData as unknown as Teacher[];

/**
 * Mendapatkan daftar kategori yang wajib untuk instrumen supervisi
 */
export function getWajibCategories(): Category[] {
	return categories.filter((c: Category) => c.wajib_supervisi);
}

/**
 * Menghitung statistik pemenuhan perangkat ajar per guru
 */
export function calculateTeacherStats(teacher: Teacher): TeacherStats {
	const wajibCats = getWajibCategories();
	const kategoriTerpenuhi = new Set<string>();

	for (const doc of teacher.perangkat_ajar) {
		if (doc.status_verifikasi === 'LENGKAP') {
			kategoriTerpenuhi.add(doc.kode_kategori);
		}
	}

	let dokumenWajibTerpenuhi = 0;
	for (const cat of wajibCats) {
		if (kategoriTerpenuhi.has(cat.kode_kategori)) {
			dokumenWajibTerpenuhi++;
		}
	}

	const totalKategoriWajib = wajibCats.length;
	const persentaseKelengkapan =
		totalKategoriWajib > 0
			? Math.round((dokumenWajibTerpenuhi / totalKategoriWajib) * 100)
			: 100;

	return {
		totalDokumen: teacher.perangkat_ajar.length,
		dokumenWajibTerpenuhi,
		totalKategoriWajib,
		persentaseKelengkapan,
		kategoriTerpenuhi
	};
}

/**
 * Menghitung statistik global supervisi sekolah
 */
export function calculateSchoolStats(allTeachers: Teacher[]): SchoolSupervisiStats {
	const totalGuru = allTeachers.length;
	let totalDokumen = 0;
	let totalPersentase = 0;
	let dokumenLengkap = 0;
	let dokumenProses = 0;
	let dokumenRevisi = 0;

	for (const t of allTeachers) {
		const stats = calculateTeacherStats(t);
		totalDokumen += t.perangkat_ajar.length;
		totalPersentase += stats.persentaseKelengkapan;

		for (const d of t.perangkat_ajar) {
			if (d.status_verifikasi === 'LENGKAP') dokumenLengkap++;
			else if (d.status_verifikasi === 'PROSES') dokumenProses++;
			else if (d.status_verifikasi === 'REVISI') dokumenRevisi++;
		}
	}

	const rataRataKesiapan = totalGuru > 0 ? Math.round(totalPersentase / totalGuru) : 0;

	return {
		totalGuru,
		totalDokumen,
		rataRataKesiapan,
		dokumenLengkap,
		dokumenProses,
		dokumenRevisi
	};
}

/**
 * Pencarian dan filter instan guru berdasarkan kata kunci, mata pelajaran, dan kelas
 */
export function filterTeachers(
	allTeachers: Teacher[],
	searchQuery: string,
	selectedMapel: string,
	selectedKelas: string,
	selectedKategori: string
): Teacher[] {
	const q = searchQuery.trim().toLowerCase();

	return allTeachers.filter((t: Teacher) => {
		// Filter query teks (nama guru, mapel, judul dokumen)
		if (q) {
			const matchName = t.nama_lengkap.toLowerCase().includes(q);
			const matchMapel = t.mapel_diampu.some((m: string) => m.toLowerCase().includes(q));
			const matchDoc = t.perangkat_ajar.some((d: PerangkatAjar) => d.judul_dokumen.toLowerCase().includes(q));
			if (!matchName && !matchMapel && !matchDoc) return false;
		}

		// Filter Mata Pelajaran
		if (selectedMapel && selectedMapel !== 'Semua Mapel') {
			const hasMapel = t.mapel_diampu.includes(selectedMapel);
			if (!hasMapel) return false;
		}

		// Filter Kelas
		if (selectedKelas && selectedKelas !== 'Semua Kelas') {
			const hasKelas = t.fase_kelas.includes(selectedKelas);
			if (!hasKelas) return false;
		}

		// Filter Kategori Dokumen
		if (selectedKategori && selectedKategori !== 'Semua Kategori') {
			const hasKategori = t.perangkat_ajar.some((d: PerangkatAjar) => d.kode_kategori === selectedKategori);
			if (!hasKategori) return false;
		}

		return true;
	});
}

/**
 * Mencari dokumen atau folder berdasarkan short slug
 */
export function findDocumentBySlug(
	allTeachers: Teacher[],
	slug: string
): { teacher: Teacher; document?: PerangkatAjar; isFolder: boolean } | null {
	for (const teacher of allTeachers) {
		if (teacher.short_folder === slug) {
			return { teacher, isFolder: true };
		}
		const doc = teacher.perangkat_ajar.find((d: PerangkatAjar) => d.short_slug === slug);
		if (doc) {
			return { teacher, document: doc, isFolder: false };
		}
	}
	return null;
}

/**
 * Ekspor Matriks Ceklis Supervisi ke format CSV (Client-side)
 */
export function generateSupervisiCSV(allTeachers: Teacher[], allCategories: Category[]): string {
	const headers = ['No', 'Nama Guru', 'Mata Pelajaran', 'Kelas Diampu', ...allCategories.map((c: Category) => c.nama_kategori), 'Kesiapan (%)'];
	const rows: string[][] = [];

	allTeachers.forEach((t: Teacher, idx: number) => {
		const stats = calculateTeacherStats(t);
		const row = [
			String(idx + 1),
			`"${t.nama_lengkap.replace(/"/g, '""')}"`,
			`"${t.mapel_diampu.join(', ')}"`,
			`"${t.fase_kelas.join(', ')}"`,
			...allCategories.map((cat: Category) => {
				const hasDoc = t.perangkat_ajar.some(
					(d: PerangkatAjar) => d.kode_kategori === cat.kode_kategori && d.status_verifikasi === 'LENGKAP'
				);
				return hasDoc ? 'LENGKAP' : 'BELUM';
			}),
			`${stats.persentaseKelengkapan}%`
		];
		rows.push(row);
	});

	return [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
}
