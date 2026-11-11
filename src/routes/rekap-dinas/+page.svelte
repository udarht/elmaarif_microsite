<script lang="ts">
	import {
		schoolConfig,
		categories,
		teachers,
		calculateSchoolStats,
		calculateTeacherStats,
		generateSupervisiCSV
	} from '#lib/utils/supervisi';
	import type { Teacher, Category, PerangkatAjar } from '#lib/types/supervisi';
	import { ArrowLeft, Printer, Download } from '@lucide/svelte';

	let stats = $derived(calculateSchoolStats(teachers));

	function getDocForCategory(teacher: Teacher, kodeKategori: string): PerangkatAjar | undefined {
		return teacher.perangkat_ajar.find((d: PerangkatAjar) => d.kode_kategori === kodeKategori);
	}

	function handlePrint() {
		window.print();
	}

	function handleExportCSV() {
		const csvContent = generateSupervisiCSV(teachers, categories);
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `Rekap_Supervisi_Dinas_SMP_ElMaarif_TP2026_2027.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<svelte:head>
	<title>Rekapitulasi Supervisi Pengawas & Dinas Pendidikan — {schoolConfig.nama_sekolah}</title>
	<meta name="description" content="Laporan resmi rekapitulasi kelengkapan berkas perangkat ajar guru SMP El Ma'arif Boarding School TP 2026/2027 siap cetak." />
</svelte:head>

<div class="min-h-screen bg-slate-100 text-slate-800 py-6 px-3 sm:px-6 font-sans">
	<!-- Screen-only Action Toolbar (Hidden during print) -->
	<div class="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
		<a
			href="/"
			class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-colors shadow-2xs"
		>
			<ArrowLeft class="w-4 h-4" />
			<span>Kembali ke Dashboard Utama</span>
		</a>

		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={handleExportCSV}
				class="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-sky-50 hover:border-sky-200 text-slate-700 hover:text-sky-700 font-semibold text-xs transition-all shadow-2xs"
			>
				<Download class="w-4 h-4 text-sky-600" />
				<span>Ekspor CSV</span>
			</button>

			<button
				type="button"
				onclick={handlePrint}
				class="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/20 active:scale-95"
			>
				<Printer class="w-4 h-4" />
				<span>Cetak Laporan / Simpan PDF</span>
			</button>
		</div>
	</div>

	<!-- Printable Official Document Container -->
	<div class="max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl shadow-lg border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 print:rounded-none print:max-w-full">
		<!-- Kop Surat Resmi Sekolah -->
		<div class="border-b-4 border-double border-slate-800 pb-4 mb-6 flex items-center justify-between gap-4">
			<img
				src="/assets/logosmpelmaarif.png"
				alt="Logo SMP El Ma'arif"
				class="w-20 h-20 object-contain shrink-0"
			/>
			<div class="text-center space-y-0.5 flex-1">
				<h3 class="text-xs uppercase tracking-widest font-bold text-slate-600">
					Yayasan Pendidikan Islam El Ma'arif
				</h3>
				<h1 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 font-serif">
					{schoolConfig.nama_sekolah}
				</h1>
				<p class="text-[11px] text-slate-600">
					NPSN: {schoolConfig.npsn} • Status: {schoolConfig.status || 'Swasta'} • {schoolConfig.alamat}
				</p>
				<p class="text-[10px] text-slate-500 font-mono">
					Telp: {schoolConfig.kontak?.telepon} • Email: {schoolConfig.kontak?.email} • Website: {schoolConfig.kontak?.website}
				</p>
			</div>
			<div class="w-20 shrink-0 hidden sm:block"></div>
		</div>

		<!-- Judul Laporan & Metadata -->
		<div class="text-center space-y-1.5 mb-6">
			<h2 class="text-base sm:text-lg font-extrabold uppercase text-slate-900 tracking-wide underline underline-offset-4">
				Laporan Rekapitulasi Hasil Supervisi Administrasi Pembelajaran
			</h2>
			<p class="text-xs font-semibold text-slate-700">
				Tahun Pelajaran {schoolConfig.tahun_pelajaran} — Semester {schoolConfig.semester}
			</p>
			<p class="text-[11px] text-slate-500">
				Sasaran: Dewan Guru Fase D (Kelas VII, VIII, IX) • Kurikulum Merdeka
			</p>
		</div>

		<!-- Ringkasan Statistik Eksekutif -->
		<div class="grid grid-cols-4 gap-2 mb-6 text-center text-xs border border-sky-200 rounded-xl p-3 bg-sky-50/50 print:bg-transparent print:border-slate-300">
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold">Total Guru</div>
				<div class="text-base font-bold text-slate-900">{stats.totalGuru} Orang</div>
			</div>
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold">Total Berkas</div>
				<div class="text-base font-bold text-slate-900">{stats.totalDokumen} Dokumen</div>
			</div>
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold">Rata-rata Kesiapan</div>
				<div class="text-base font-black text-sky-700 print:text-slate-950">{stats.rataRataKesiapan}%</div>
			</div>
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold">Predikat Kelayakan</div>
				<div class="text-base font-black text-sky-700 print:text-slate-950">SANGAT BAIK (A)</div>
			</div>
		</div>

		<!-- Tabel Matriks Supervisi Resmi -->
		<div class="overflow-x-auto mb-8">
			<table class="w-full text-left text-xs border-collapse border border-slate-300">
				<thead>
					<tr class="bg-sky-50 text-slate-900 font-bold uppercase text-[10px] tracking-wider text-center border-b border-slate-300 print:bg-slate-200">
						<th class="border border-slate-300 py-2.5 px-2 w-10">No</th>
						<th class="border border-slate-300 py-2.5 px-3 text-left min-w-[160px]">Nama Guru & Gelar</th>
						<th class="border border-slate-300 py-2.5 px-3 text-left min-w-[130px]">Mata Pelajaran</th>
						<th class="border border-slate-300 py-2.5 px-2 w-16">Kelas</th>
						{#each categories as cat}
							<th class="border border-slate-300 py-2.5 px-2 w-20 text-center">
								{cat.nama_kategori.split('(')[0].trim()}
							</th>
						{/each}
						<th class="border border-slate-300 py-2.5 px-2 w-16 text-center">Kesiapan</th>
						<th class="border border-slate-300 py-2.5 px-2 w-20 text-center">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each teachers as teacher, idx}
						{@const tStats = calculateTeacherStats(teacher)}
						<tr class="border-b border-slate-300 text-[11px] print:text-[10px] page-break-inside-avoid">
							<td class="border border-slate-300 py-2 px-2 text-center font-mono font-medium">{idx + 1}</td>
							<td class="border border-slate-300 py-2 px-3 font-semibold text-slate-900">
								{teacher.nama_lengkap}
								<div class="text-[9px] text-slate-500 font-normal">{teacher.gelar_status}</div>
							</td>
							<td class="border border-slate-300 py-2 px-3">
								{teacher.mapel_diampu.join(', ')}
							</td>
							<td class="border border-slate-300 py-2 px-2 text-center text-[10px]">
								{teacher.fase_kelas.map((k) => k.replace('Kelas ', '')).join(', ')}
							</td>

							<!-- Categories status -->
							{#each categories as cat}
								{@const doc = getDocForCategory(teacher, cat.kode_kategori)}
								<td class="border border-slate-300 py-2 px-2 text-center font-bold">
									{#if doc}
										{#if doc.status_verifikasi === 'LENGKAP'}
											<span class="text-sky-700 print:text-black">✓</span>
										{:else}
											<span class="text-amber-600 print:text-black">~</span>
										{/if}
									{:else}
										<span class="text-slate-300 print:text-slate-400">-</span>
									{/if}
								</td>
							{/each}

							<td class="border border-slate-300 py-2 px-2 text-center font-bold text-slate-900">
								{tStats.persentaseKelengkapan}%
							</td>

							<td class="border border-slate-300 py-2 px-2 text-center">
								{#if tStats.persentaseKelengkapan >= 100}
									<span class="font-bold text-sky-700 print:text-black">Lengkap</span>
								{:else if tStats.persentaseKelengkapan > 0}
									<span class="font-medium text-amber-700 print:text-black">Proses ({tStats.persentaseKelengkapan}%)</span>
								{:else}
									<span class="text-slate-400 print:text-slate-500">Belum Ada</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Keterangan & Catatan Supervisi -->
		<div class="border border-slate-300 rounded-xl p-4 text-xs text-slate-700 mb-8 space-y-1.5 print:border-none print:p-0">
			<div class="font-bold text-slate-900">Catatan & Rekomendasi Tim Pengawas:</div>
			<p class="text-[11px] leading-relaxed text-slate-600">
				Seluruh dewan guru telah mengunggah perangkat ajar wajib (Capaian Pembelajaran, Alur Tujuan Pembelajaran, Modul Ajar Berdiferensiasi, Prota/Promes, dan Rubrik Asesmen) ke dalam repositori Cloudflare Pages SMP El Ma'arif Boarding School secara terverifikasi. Pembelajaran berbasis Kurikulum Merdeka dinyatakan siap dilaksanakan secara optimal.
			</p>
		</div>

		<!-- Blok Lembar Pengesahan / Tanda Tangan -->
		<div class="pt-6 grid grid-cols-2 gap-8 text-center text-xs text-slate-800 page-break-inside-avoid">
			<!-- Pengawas Pembina -->
			<div class="space-y-16">
				<div>
					<p class="text-slate-500">Mengetahui & Memverifikasi,</p>
					<p class="font-bold text-slate-900">Pengawas Pembina Sekolah / Tim Dinas Pendidikan</p>
				</div>

				<div class="space-y-1">
					<p class="font-bold underline underline-offset-2 text-slate-900">
						............................................................
					</p>
					<p class="text-[11px] text-slate-500 font-mono">NIP. ....................................................</p>
				</div>
			</div>

			<!-- Kepala Sekolah -->
			<div class="space-y-16">
				<div>
					<p class="text-slate-500">Kabupaten/Kota, 11 November 2026</p>
					<p class="font-bold text-slate-900">Kepala {schoolConfig.nama_sekolah}</p>
				</div>

				<div class="space-y-1">
					<p class="font-bold underline underline-offset-2 text-slate-900">
						{schoolConfig.kepala_sekolah.nama}
					</p>
					<p class="text-[11px] text-slate-500 font-mono">NIP. {schoolConfig.kepala_sekolah.nip}</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@media print {
		.no-print {
			display: none !important;
		}
		:global(body) {
			background: white !important;
			color: black !important;
		}
		.page-break-inside-avoid {
			page-break-inside: avoid;
		}
	}
</style>
