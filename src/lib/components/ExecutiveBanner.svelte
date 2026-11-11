<script lang="ts">
	import type { SchoolConfig, SchoolSupervisiStats } from '#lib/types/supervisi';
	import { School, Award, FileText, ShieldCheck, Sparkles, BookOpen, Calendar, Globe, ExternalLink } from '@lucide/svelte';

	interface Props {
		schoolConfig: SchoolConfig;
		stats: SchoolSupervisiStats;
		onOpenDokumenInduk: () => void;
	}

	let { schoolConfig, stats, onOpenDokumenInduk }: Props = $props();
</script>

<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-blue-700 text-white shadow-xl shadow-sky-600/15 border border-sky-400/30 p-6 md:p-8 mb-8">
	<!-- Background subtle ambient clouds / glow -->
	<div class="absolute -top-24 -right-24 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none"></div>
	<div class="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>

	<div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
		<!-- Left: Identity & Welcome -->
		<div class="lg:col-span-7 space-y-4">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-xs">
					<ShieldCheck class="w-3.5 h-3.5 text-sky-200" />
					Portal Resmi Pengawas & Dinas Pendidikan
				</span>
				{#if schoolConfig.status}
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
						Status: {schoolConfig.status}
					</span>
				{/if}
				<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/15 text-sky-100 border border-white/15">
					TP {schoolConfig.tahun_pelajaran} • Semester {schoolConfig.semester}
				</span>
			</div>

			<div>
				<h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
					<img
						src="/assets/logosmpelmaarif.png"
						alt="Logo SMP El Ma'arif"
						class="w-12 h-12 sm:w-14 sm:h-14 object-contain bg-white/20 p-1 rounded-2xl backdrop-blur-md border border-white/30 shrink-0 hidden sm:inline-flex shadow-md"
					/>
					<span>{schoolConfig.nama_sekolah}</span>
				</h1>
				<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sky-100 text-xs sm:text-sm mt-1.5 font-mono">
					<span>NPSN: {schoolConfig.npsn}</span>
					<span>•</span>
					<span>{schoolConfig.alamat}</span>
				</div>
			</div>

			<p class="text-sky-50 text-sm leading-relaxed max-w-2xl bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xs">
				<span class="font-bold text-white">Catatan Pengawas:</span> {schoolConfig.info_pengawas.pesan_selamat_datang}
			</p>

			<!-- Action buttons: Dokumen Induk & Website Utama Sekolah -->
			<div class="flex flex-wrap items-center gap-3 pt-1">
				<button
					type="button"
					onclick={onOpenDokumenInduk}
					class="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-900 font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-900/20 active:scale-95"
				>
					<FileText class="w-4 h-4 text-sky-600" />
					<span>Dokumen Induk Sekolah (KOSP / Kaldik)</span>
				</button>

				{#if schoolConfig.kontak?.website}
					<a
						href={schoolConfig.kontak.website}
						target="_blank"
						rel="noopener noreferrer"
						class="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm border border-white/30 backdrop-blur-sm transition-all shadow-xs active:scale-95"
					>
						<Globe class="w-4 h-4 text-sky-100" />
						<span>Website Utama ({schoolConfig.kontak.website.replace('https://', '')})</span>
						<ExternalLink class="w-3.5 h-3.5 text-sky-200" />
					</a>
				{/if}
			</div>
		</div>

		<!-- Right: Executive Stats Bento -->
		<div class="lg:col-span-5 grid grid-cols-2 gap-3.5">
			<!-- Overall readiness card -->
			<div class="col-span-2 bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 flex items-center justify-between shadow-xs">
				<div>
					<span class="text-xs font-semibold text-sky-100 uppercase tracking-wider block">Kesiapan Supervisi</span>
					<div class="flex items-baseline gap-2 mt-1">
						<span class="text-4xl font-black text-white">{stats.rataRataKesiapan}%</span>
						<span class="text-xs font-bold text-sky-200">Rata-rata Terpenuhi</span>
					</div>
					<span class="text-xs text-sky-100 mt-1 block">Berdasarkan instrumen wajib</span>
				</div>

				<div class="relative w-20 h-20 flex items-center justify-center shrink-0">
					<svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
						<path
							class="text-white/25"
							stroke-width="3.5"
							stroke="currentColor"
							fill="none"
							d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
						/>
						<path
							class="text-white transition-all duration-1000 ease-out"
							stroke-dasharray="{stats.rataRataKesiapan}, 100"
							stroke-width="3.5"
							stroke-linecap="round"
							stroke="currentColor"
							fill="none"
							d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<Award class="w-7 h-7 text-white" />
					</div>
				</div>
			</div>

			<!-- Total Guru -->
			<div class="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xs">
				<div class="text-xs font-semibold text-sky-100 uppercase tracking-wider">Dewan Guru</div>
				<div class="text-3xl font-extrabold text-white mt-1">{stats.totalGuru}</div>
				<span class="text-[11px] text-sky-100 font-medium">Fase D (Kls 7, 8, 9)</span>
			</div>

			<!-- Total Dokumen -->
			<div class="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xs">
				<div class="text-xs font-semibold text-sky-100 uppercase tracking-wider">Total Berkas</div>
				<div class="text-3xl font-extrabold text-white mt-1">{stats.totalDokumen}</div>
				<span class="text-[11px] text-sky-100 font-medium">{stats.dokumenLengkap} Terverifikasi</span>
			</div>
		</div>
	</div>
</div>
