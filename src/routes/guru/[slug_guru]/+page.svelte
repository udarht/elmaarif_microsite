<script lang="ts">
	import type { PageData } from './$types';
	import type { PerangkatAjar } from '#lib/types/supervisi';
	import { schoolConfig, categories, calculateTeacherStats } from '#lib/utils/supervisi';
	import DocumentPreviewDrawer from '#lib/components/DocumentPreviewDrawer.svelte';
	import QrCodeModal from '#lib/components/QrCodeModal.svelte';
	import {
		ArrowLeft,
		Folder,
		ExternalLink,
		QrCode,
		Copy,
		Check,
		Eye,
		School,
		ShieldCheck,
		FileText,
		CheckCircle2,
		Sparkles
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let teacher = $derived(data.teacher);
	let stats = $derived(calculateTeacherStats(teacher));

	let previewDoc = $state<PerangkatAjar | null>(null);
	let isPreviewOpen = $state(false);

	let isQrOpen = $state(false);
	let qrTitle = $state('');
	let qrUrl = $state('');
	let qrSubtitle = $state<string | undefined>('');

	let copiedSlug = $state<string | null>(null);

	function copyShortlink(shortSlug: string) {
		const fullUrl = `${window.location.origin}/s/${shortSlug}`;
		navigator.clipboard.writeText(fullUrl).then(() => {
			copiedSlug = shortSlug;
			setTimeout(() => {
				copiedSlug = null;
			}, 2000);
		});
	}

	function handleOpenQr(title: string, url: string, subtitle?: string) {
		qrTitle = title;
		qrUrl = url;
		qrSubtitle = subtitle;
		isQrOpen = true;
	}

	function handlePreview(doc: PerangkatAjar) {
		previewDoc = doc;
		isPreviewOpen = true;
	}
</script>

<svelte:head>
	<title>{teacher.nama_lengkap} — Portofolio Perangkat Ajar | {schoolConfig.nama_sekolah}</title>
	<meta name="description" content="Portofolio digital perangkat ajar dan administrasi pembelajaran {teacher.nama_lengkap} di {schoolConfig.nama_sekolah}." />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
	<!-- Top Navigation -->
	<header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
			>
				<ArrowLeft class="w-4 h-4" />
				<span>Kembali ke Portal Supervisi</span>
			</a>

			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={() =>
						handleOpenQr(
							`Portofolio Guru: ${teacher.nama_lengkap}`,
							`${window.location.origin}/guru/${teacher.slug_guru}`,
							`Link Profil Portofolio Digital Guru`
						)}
					class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
				>
					<QrCode class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
					<span>QR Profil Guru</span>
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content Container -->
	<main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
		<!-- Teacher Profile Hero Banner -->
		<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/20 p-6 md:p-8">
			<div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
				<img
					src={teacher.avatar_url}
					alt={teacher.nama_lengkap}
					class="w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 p-1.5 border-2 border-emerald-400/40 object-cover shadow-lg shrink-0"
				/>

				<div class="space-y-3 flex-1 text-center md:text-left">
					<div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
						<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
							<ShieldCheck class="w-3.5 h-3.5" />
							{teacher.gelar_status}
						</span>
						<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300">
							TP {schoolConfig.tahun_pelajaran}
						</span>
					</div>

					<div>
						<h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{teacher.nama_lengkap}</h1>
						<p class="text-xs sm:text-sm text-emerald-300/80 font-medium mt-1">
							{schoolConfig.nama_sekolah}
						</p>
					</div>

					<div class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
						{#each teacher.mapel_diampu as mapel}
							<span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-slate-200">
								{mapel}
							</span>
						{/each}
						<span class="text-xs text-slate-400 self-center px-1">• {teacher.fase_kelas.join(', ')}</span>
					</div>
				</div>

				<!-- Stats Badge Card -->
				<div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shrink-0 text-center min-w-[160px]">
					<div class="text-xs uppercase font-medium text-slate-300">Kesiapan Dokumen</div>
					<div class="text-3xl font-black text-white mt-1">{stats.persentaseKelengkapan}%</div>
					<div class="text-[11px] text-emerald-300 mt-1">
						{stats.dokumenWajibTerpenuhi} / {stats.totalKategoriWajib} Wajib Terpenuhi
					</div>
				</div>
			</div>
		</div>

		<!-- Teaching Devices List -->
		<div class="space-y-4">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="text-lg font-bold text-slate-900 dark:text-white">Portofolio & Perangkat Ajar Digital</h2>
					<p class="text-xs text-slate-500 dark:text-slate-400">
						Koleksi berkas kurikulum, modul ajar, asesmen, dan media interaktif.
					</p>
				</div>

				<a
					href={teacher.folder_utama_url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
				>
					<Folder class="w-4 h-4" />
					<span>Buka Folder Google Drive Guru</span>
				</a>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each teacher.perangkat_ajar as doc}
					<div class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all shadow-sm space-y-4 flex flex-col justify-between">
						<div class="space-y-2">
							<div class="flex items-center justify-between gap-2">
								<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
									{doc.tipe_file}
								</span>
								<span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
									{doc.kelas_target}
								</span>
							</div>

							<h3 class="font-bold text-sm text-slate-900 dark:text-white leading-snug">
								{doc.judul_dokumen}
							</h3>

							<div class="text-[11px] text-slate-400 font-mono">
								Shortlink: /s/{doc.short_slug}
							</div>
						</div>

						<div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
							<div class="flex items-center gap-1">
								<button
									type="button"
									onclick={() =>
										handleOpenQr(
											doc.judul_dokumen,
											`${window.location.origin}/s/${doc.short_slug}`,
											`${teacher.nama_lengkap} • /s/${doc.short_slug}`
										)}
									class="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
									title="Tampilkan QR Code"
								>
									<QrCode class="w-3.5 h-3.5" />
								</button>

								<button
									type="button"
									onclick={() => copyShortlink(doc.short_slug)}
									class="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
									title="Salin Shortlink"
								>
									{#if copiedSlug === doc.short_slug}
										<Check class="w-3.5 h-3.5 text-emerald-500" />
									{:else}
										<Copy class="w-3.5 h-3.5" />
									{/if}
								</button>
							</div>

							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={() => handlePreview(doc)}
									class="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95"
								>
									<Eye class="w-3.5 h-3.5" />
									<span>Pratinjau</span>
								</button>

								<a
									href={doc.target_url}
									target="_blank"
									rel="noopener noreferrer"
									class="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
									title="Buka Berkas Asli"
								>
									<ExternalLink class="w-3.5 h-3.5" />
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
		<div class="max-w-6xl mx-auto px-4">
			© 2026 {schoolConfig.nama_sekolah} • Portofolio Digital Pendidik
		</div>
	</footer>

	<!-- Preview Drawer & QR Modals -->
	<DocumentPreviewDrawer
		isOpen={isPreviewOpen}
		document={previewDoc}
		{teacher}
		onClose={() => (isPreviewOpen = false)}
		onOpenQr={(d) =>
			handleOpenQr(
				d.judul_dokumen,
				`${window.location.origin}/s/${d.short_slug}`,
				`${teacher.nama_lengkap} • /s/${d.short_slug}`
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
