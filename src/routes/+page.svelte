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
	import { School, Printer, ShieldCheck, Sparkles, AlertCircle } from '@lucide/svelte';

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

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
	<!-- Top Navigation Header -->
	<header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
			<!-- Brand identity -->
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
					<School class="w-5 h-5" />
				</div>
				<div>
					<span class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
						e-Supervisi El Ma'arif
					</span>
					<span class="text-[11px] text-slate-400 font-medium block">
						Portal Perangkat Ajar TP {schoolConfig.tahun_pelajaran}
					</span>
				</div>
			</a>

			<!-- Right tools: Mode Cetak & Status Badge -->
			<div class="flex items-center gap-3">
				<a
					href="/rekap-dinas"
					class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
				>
					<Printer class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
					<span class="hidden sm:inline">Cetak Rekap Dinas</span>
				</a>

				<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
					<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
					<span class="hidden md:inline">Cloudflare Edge Static</span>
				</span>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Executive Bento Banner -->
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
			<div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
				<div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
					<AlertCircle class="w-7 h-7" />
				</div>
				<div class="space-y-1">
					<h3 class="text-lg font-bold text-slate-900 dark:text-white">Tidak ada data guru yang cocok</h3>
					<p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
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
					class="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all"
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
	<footer class="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
		<div class="max-w-7xl mx-auto px-4 space-y-2">
			<p class="font-medium text-slate-700 dark:text-slate-300">
				© 2026 {schoolConfig.nama_sekolah} — Ekosistem Digital Pendidikan El Ma'arif
			</p>
			<p class="text-[11px] text-slate-400">
				Disusun untuk Instrumen Supervisi Mutu Pembelajaran Pengawas & Dinas Pendidikan • Serverless Static Architecture
			</p>
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
