<script lang="ts">
	import { onMount } from 'svelte';
	import type { Teacher, PerangkatAjar } from '#lib/types/supervisi';
	import {
		schoolConfig,
		categories,
		teachers,
		calculateSchoolStats,
		filterTeachers,
		generateSupervisiCSV
	} from '#lib/utils/supervisi';
	import ExecutiveBanner from '#lib/components/ExecutiveBanner.svelte';
	import SmartOmnibar from '#lib/components/SmartOmnibar.svelte';
	import TeacherCard from '#lib/components/TeacherCard.svelte';
	import SupervisiMatrix from '#lib/components/SupervisiMatrix.svelte';
	import DokumenIndukModal from '#lib/components/DokumenIndukModal.svelte';
	import TeacherDetailModal from '#lib/components/TeacherDetailModal.svelte';
	import DocumentPreviewDrawer from '#lib/components/DocumentPreviewDrawer.svelte';
	import QrCodeModal from '#lib/components/QrCodeModal.svelte';
	import { School, Printer, AlertCircle, Globe, ExternalLink } from '@lucide/svelte';

	// State Management via Svelte 5 Runes
	let searchQuery = $state('');
	let selectedMapel = $state('Semua Mapel');
	let selectedKelas = $state('Semua Kelas');
	let selectedKategori = $state('Semua Kategori');
	let viewMode = $state<'grid' | 'matrix'>('grid');

	let isDokumenIndukOpen = $state(false);
	let selectedTeacher = $state<Teacher | null>(null);

	// Preview Drawer & QR Modal States
	let previewDoc = $state<PerangkatAjar | null>(null);
	let previewTeacher = $state<Teacher | null>(null);
	let isPreviewOpen = $state(false);

	let isQrOpen = $state(false);
	let qrTitle = $state('');
	let qrUrl = $state('');
	let qrSubtitle = $state<string | undefined>('');

	function handleOpenQr(title: string, url: string, subtitle?: string) {
		qrTitle = title;
		qrUrl = url;
		qrSubtitle = subtitle;
		isQrOpen = true;
	}

	function handlePreviewDoc(doc: PerangkatAjar, teacher: Teacher) {
		previewDoc = doc;
		previewTeacher = teacher;
		isPreviewOpen = true;
	}

	// Derived calculations
	let schoolStats = $derived(calculateSchoolStats(teachers));

	let filteredTeachers = $derived(
		filterTeachers(teachers, searchQuery, selectedMapel, selectedKelas, selectedKategori)
	);

	// Extract unique mapel options
	let mapelOptions = $derived.by(() => {
		const set = new Set<string>();
		teachers.forEach((t: Teacher) => t.mapel_diampu.forEach((m: string) => set.add(m)));
		return Array.from(set);
	});

	// Client-side CSV Exporter
	function handleExportCSV() {
		const csvContent = generateSupervisiCSV(teachers, categories);
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `Rekap_Supervisi_SMP_ElMaarif_TP2026_2027.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Keyboard Shortcut: press '/' or 'Ctrl+K' to focus search
	let omnibarRef: any = $state(null);

	onMount(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT') || (e.ctrlKey && e.key === 'k')) {
				e.preventDefault();
				omnibarRef?.focusSearch?.();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});
</script>

<svelte:head>
	<title>{schoolConfig.nama_sekolah} — Portal e-Supervisi & Etalase Perangkat Ajar TP {schoolConfig.tahun_pelajaran}</title>
	<meta name="description" content="Portal e-Supervisi Digital dan Etalase Perangkat Ajar SMP El Ma'arif Boarding School. Akses cepat instrumen supervisi untuk Pengawas Sekolah dan Dinas Pendidikan." />
</svelte:head>

<div class="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans">
	<!-- Top Navigation Header -->
	<header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
			<!-- Brand identity -->
			<a href="/" class="flex items-center gap-3 group">
				<img
					src="/assets/logosmpelmaarif.png"
					alt="Logo SMP El Ma'arif"
					class="w-10 h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
				/>
				<div>
					<span class="font-extrabold text-base tracking-tight text-slate-900 block group-hover:text-sky-600 transition-colors">
						e-Supervisi El Ma'arif
					</span>
					<span class="text-[11px] text-slate-500 font-medium block">
						Portal Perangkat Ajar TP {schoolConfig.tahun_pelajaran}
					</span>
				</div>
			</a>

			<!-- Right tools: Website Utama, Mode Cetak & Status Badge -->
			<div class="flex items-center gap-2.5">
				<a
					href={schoolConfig.kontak?.website || 'https://elmaarifpasbar.sch.id'}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-800 text-xs font-semibold border border-sky-200 transition-all active:scale-95 shadow-2xs"
					title="Kunjungi Website Resmi: elmaarifpasbar.sch.id"
				>
					<Globe class="w-3.5 h-3.5 text-sky-600" />
					<span class="hidden sm:inline">Website Utama</span>
					<ExternalLink class="w-3 h-3 opacity-60" />
				</a>

				<a
					href="/rekap-dinas"
					class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-semibold border border-slate-200 hover:border-sky-200 transition-all active:scale-95 shadow-2xs"
				>
					<Printer class="w-3.5 h-3.5 text-sky-600" />
					<span class="hidden sm:inline">Cetak Rekap Dinas</span>
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Executive Bento Banner (Biru Langit SMP) -->
		<ExecutiveBanner
			{schoolConfig}
			stats={schoolStats}
			onOpenDokumenInduk={() => (isDokumenIndukOpen = true)}
		/>

		<!-- Smart Omnibar (Search, Filters, View Mode Toggle, CSV Export) -->
		<SmartOmnibar
			bind:this={omnibarRef}
			{searchQuery}
			{selectedMapel}
			{selectedKelas}
			{selectedKategori}
			{viewMode}
			{mapelOptions}
			{categories}
			onExportCSV={handleExportCSV}
			onUpdateSearch={(v: string) => (searchQuery = v)}
			onUpdateMapel={(v: string) => (selectedMapel = v)}
			onUpdateKelas={(v: string) => (selectedKelas = v)}
			onUpdateKategori={(v: string) => (selectedKategori = v)}
			onUpdateViewMode={(m: 'grid' | 'matrix') => (viewMode = m)}
		/>

		<!-- Content Display based on View Mode -->
		{#if filteredTeachers.length === 0}
			<!-- Empty State -->
			<div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
				<div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
					<AlertCircle class="w-7 h-7" />
				</div>
				<div class="space-y-1">
					<h3 class="text-lg font-bold text-slate-900">Tidak ada data guru yang cocok</h3>
					<p class="text-xs text-slate-500 max-w-md mx-auto">
						Kombinasi kata kunci pencarian atau filter yang dipilih tidak menemukan berkas perangkat ajar.
					</p>
				</div>
				<button
					type="button"
					onclick={() => {
						searchQuery = '';
						selectedMapel = 'Semua Mapel';
						selectedKelas = 'Semua Kelas';
						selectedKategori = 'Semua Kategori';
					}}
					class="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-xs"
				>
					Reset Semua Filter
				</button>
			</div>
		{:else if viewMode === 'grid'}
			<!-- Grid Mode: Teacher Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredTeachers as teacher (teacher.id_unit)}
					<TeacherCard
						{teacher}
						onSelectTeacher={(t: Teacher) => (selectedTeacher = t)}
					/>
				{/each}
			</div>
		{:else}
			<!-- Matrix Mode: Comprehensive Table -->
			<SupervisiMatrix
				teachers={filteredTeachers}
				{categories}
				onSelectTeacher={(t: Teacher) => (selectedTeacher = t)}
			/>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
		<div class="max-w-7xl mx-auto px-4 space-y-3 flex flex-col items-center">
			<p class="font-medium text-slate-700">
				© 2026 {schoolConfig.nama_sekolah} — Ekosistem Digital Pendidikan El Ma'arif
			</p>
			<p class="text-[11px] text-slate-400">
				Disusun untuk Instrumen Supervisi Mutu Pembelajaran Pengawas & Dinas Pendidikan • Serverless Static Architecture
			</p>
			<div class="pt-1">
				<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
					<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
					<span>Powered by Adayu.ID</span>
				</span>
			</div>
		</div>
	</footer>

	<!-- Modals -->
	<DokumenIndukModal
		isOpen={isDokumenIndukOpen}
		dokumenIndukList={schoolConfig.dokumen_induk_sekolah}
		onClose={() => (isDokumenIndukOpen = false)}
	/>

	<TeacherDetailModal
		teacher={selectedTeacher}
		{categories}
		onClose={() => (selectedTeacher = null)}
		onPreviewDoc={handlePreviewDoc}
		onOpenQr={handleOpenQr}
	/>

	<DocumentPreviewDrawer
		isOpen={isPreviewOpen}
		document={previewDoc}
		teacher={previewTeacher}
		onClose={() => (isPreviewOpen = false)}
		onOpenQr={(d: PerangkatAjar) =>
			handleOpenQr(
				d.judul_dokumen,
				`${window.location.origin}/s/${d.short_slug}`,
				`${previewTeacher?.nama_lengkap} • /s/${d.short_slug}`
			)}
	/>

	<QrCodeModal
		isOpen={isQrOpen}
		title={qrTitle}
		url={qrUrl}
		subtitle={qrSubtitle}
		onClose={() => (isQrOpen = false)}
	/>
</div>
