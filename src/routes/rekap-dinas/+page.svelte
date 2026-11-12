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
	<div class="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 no-print">
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
	<div class="max-w-6xl mx-auto bg-white text-slate-900 rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-10 print:shadow-none print:border-none print:p-0 print:rounded-none print:max-w-none print:w-full">
		<!-- Kop Surat Resmi Sekolah -->
		<div class="border-b-4 border-double border-slate-800 pb-3 mb-5 flex items-center justify-between gap-4 print:pb-2 print:mb-4">
			<img
				src="/assets/logosmpelmaarif.png"
				alt="Logo SMP El Ma'arif"
				class="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 print:w-14 print:h-14"
			/>
			<div class="text-center space-y-0.5 flex-1">
				<h3 class="text-xs uppercase tracking-widest font-bold text-slate-600 print:text-[10px]">
					Yayasan Pendidikan Al - Ma'arif
				</h3>
				<h1 class="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950 font-serif print:text-lg">
					{schoolConfig.nama_sekolah}
				</h1>
				<p class="text-[11px] text-slate-600 print:text-[9px]">
					NPSN: {schoolConfig.npsn} • Status: {schoolConfig.status || 'Swasta'} • {schoolConfig.alamat}
				</p>
				<p class="text-[10px] text-slate-500 font-mono print:text-[8px]">
					Telp: {schoolConfig.kontak?.telepon} • Email: {schoolConfig.kontak?.email} • Website: {schoolConfig.kontak?.website}
				</p>
			</div>
			<div class="w-16 sm:w-20 shrink-0 hidden sm:block print:w-14"></div>
		</div>

		<!-- Judul Laporan & Metadata -->
		<div class="text-center space-y-1 mb-5 print:mb-3">
			<h2 class="text-sm sm:text-base font-extrabold uppercase text-slate-900 tracking-wide underline underline-offset-4 print:text-xs">
				Laporan Rekapitulasi Hasil Supervisi Administrasi Pembelajaran
			</h2>
			<p class="text-xs font-semibold text-slate-700 print:text-[10px]">
				Tahun Pelajaran {schoolConfig.tahun_pelajaran} — Semester {schoolConfig.semester}
			</p>
			<p class="text-[11px] text-slate-500 print:text-[9px]">
				Sasaran: Dewan Guru Fase D (Kelas VII, VIII, IX) • Kurikulum Merdeka
			</p>
		</div>

		<!-- Ringkasan Statistik Eksekutif -->
		<div class="grid grid-cols-3 gap-2 mb-5 text-center text-xs border border-sky-200 rounded-xl p-2.5 bg-sky-50/50 print:bg-transparent print:border-slate-300 print:p-1.5 print:mb-3">
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold print:text-[8px]">Total Guru</div>
				<div class="text-sm sm:text-base font-bold text-slate-900 print:text-xs">{stats.totalGuru} Orang</div>
			</div>
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold print:text-[8px]">Total Berkas Terunggah</div>
				<div class="text-sm sm:text-base font-bold text-slate-900 print:text-xs">{stats.totalDokumen} Dokumen</div>
			</div>
			<div>
				<div class="text-[10px] text-slate-500 uppercase font-semibold print:text-[8px]">Rata-rata Kesiapan</div>
				<div class="text-sm sm:text-base font-black text-sky-700 print:text-slate-950 print:text-xs">{stats.rataRataKesiapan}%</div>
			</div>
		</div>

		<!-- Tabel Matriks Supervisi Resmi -->
		<div class="overflow-x-auto mb-6 print:overflow-visible print:mb-3">
			<table class="w-full text-left text-xs border-collapse border border-slate-300 print:text-[8.5px]">
				<thead>
					<tr class="bg-sky-50 text-slate-900 font-bold uppercase text-[9.5px] tracking-wider text-center border-b border-slate-300 print:bg-slate-200 print:text-[8px]">
						<th class="border border-slate-300 py-2 px-1.5 w-8 print:w-6">No</th>
						<th class="border border-slate-300 py-2 px-2.5 text-left min-w-[130px] print:min-w-0 print:py-1">Nama Guru & Gelar</th>
						<th class="border border-slate-300 py-2 px-2 text-left min-w-[110px] print:min-w-0 print:py-1">Mata Pelajaran</th>
						<th class="border border-slate-300 py-2 px-1.5 w-14 text-center print:w-10 print:py-1">Kelas</th>
						{#each categories as cat}
							<th class="border border-slate-300 py-2 px-1 text-center min-w-[62px] print:min-w-0 print:py-1">
								<span class="block leading-tight text-[9px] print:text-[7.5px]">{cat.nama_kategori.split('(')[0].trim()}</span>
							</th>
						{/each}
						<th class="border border-slate-300 py-2 px-1.5 w-14 text-center print:w-11 print:py-1">Kesiapan</th>
						<th class="border border-slate-300 py-2 px-1.5 w-16 text-center print:w-13 print:py-1">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each teachers as teacher, idx}
						{@const tStats = calculateTeacherStats(teacher)}
						<tr class="border-b border-slate-300 text-[10px] print:text-[8px] page-break-inside-avoid">
							<td class="border border-slate-300 py-1.5 px-1.5 text-center font-mono font-medium print:py-1">{idx + 1}</td>
							<td class="border border-slate-300 py-1.5 px-2 font-semibold text-slate-900 leading-tight print:py-1">
								{teacher.nama_lengkap}
								<div class="text-[8.5px] text-slate-500 font-normal print:text-[7px]">{teacher.gelar_status}</div>
							</td>
							<td class="border border-slate-300 py-1.5 px-2 leading-tight print:py-1">
								{teacher.mapel_diampu.join(', ')}
							</td>
							<td class="border border-slate-300 py-1.5 px-1 text-center text-[9px] print:text-[7.5px] print:py-1">
								{teacher.fase_kelas.map((k) => k.replace('Kelas ', '')).join(', ')}
							</td>

							<!-- Categories status -->
							{#each categories as cat}
								{@const doc = getDocForCategory(teacher, cat.kode_kategori)}
								<td class="border border-slate-300 py-1.5 px-1 text-center font-bold print:py-1">
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

							<td class="border border-slate-300 py-1.5 px-1 text-center font-bold text-slate-900 print:py-1">
								{tStats.persentaseKelengkapan}%
							</td>

							<td class="border border-slate-300 py-1.5 px-1 text-center font-semibold text-[9.5px] print:text-[7.5px] print:py-1">
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

		<!-- Keterangan & Catatan Supervisi (Area Tulis Manual Tim Pengawas) -->
		<div class="border border-slate-300 rounded-xl p-3 text-xs text-slate-700 mb-6 space-y-1.5 print:border-slate-400 print:rounded-lg print:p-2.5 print:mb-4 page-break-inside-avoid">
			<div class="font-bold text-slate-900 text-xs print:text-[9.5px]">Catatan & Rekomendasi Tim Pengawas:</div>
			<div class="space-y-3.5 pt-1 pb-1 print:space-y-3">
				<div class="border-b border-dashed border-slate-300 h-3 print:border-slate-400"></div>
				<div class="border-b border-dashed border-slate-300 h-3 print:border-slate-400"></div>
				<div class="border-b border-dashed border-slate-300 h-3 print:border-slate-400"></div>
			</div>
		</div>

		<!-- Blok Lembar Pengesahan / Tanda Tangan -->
		<div class="pt-4 grid grid-cols-2 gap-8 text-center text-xs text-slate-800 page-break-inside-avoid print:pt-2">
			<!-- Pengawas Pembina -->
			<div class="space-y-14 print:space-y-10">
				<div>
					<p class="text-slate-500 print:text-[9px]">Mengetahui & Memverifikasi,</p>
					<p class="font-bold text-slate-900 print:text-[10px]">Pengawas Pembina Sekolah / Tim Dinas Pendidikan</p>
				</div>

				<div class="space-y-1">
					<p class="font-bold underline underline-offset-2 text-slate-900 print:text-[9.5px]">
						............................................................
					</p>
					<p class="text-[11px] text-slate-500 font-mono print:text-[8px]">NIP. ....................................................</p>
				</div>
			</div>

			<!-- Kepala Sekolah -->
			<div class="space-y-14 print:space-y-10">
				<div>
					<p class="text-slate-500 print:text-[9px]">Pasaman Barat, 12 November 2026</p>
					<p class="font-bold text-slate-900 print:text-[10px]">Kepala {schoolConfig.nama_sekolah}</p>
				</div>

				<div class="space-y-1">
					<p class="font-bold underline underline-offset-2 text-slate-900 print:text-[9.5px]">
						{schoolConfig.kepala_sekolah.nama}
					</p>
					<p class="text-[11px] text-slate-500 font-mono print:text-[8px]">NIP. {schoolConfig.kepala_sekolah.nip}</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@page {
		size: A4 landscape;
		margin: 8mm 10mm;
	}

	@media print {
		.no-print {
			display: none !important;
		}

		:global(html),
		:global(body) {
			background: white !important;
			color: black !important;
			margin: 0 !important;
			padding: 0 !important;
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}

		.page-break-inside-avoid {
			page-break-inside: avoid;
			break-inside: avoid;
		}

		table {
			width: 100% !important;
		}

		/* Hilangkan batasan scroll dan overflow saat dicetak */
		:global(*) {
			overflow: visible !important;
		}
	}
</style>
