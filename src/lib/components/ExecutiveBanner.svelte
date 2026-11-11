<script lang="ts">
	import type { SchoolConfig, SchoolSupervisiStats } from '#lib/types/supervisi';
	import { School, Award, FileText, ExternalLink, ShieldCheck, Sparkles, BookOpen, Calendar } from '@lucide/svelte';

	interface Props {
		schoolConfig: SchoolConfig;
		stats: SchoolSupervisiStats;
		onOpenDokumenInduk: () => void;
	}

	let { schoolConfig, stats, onOpenDokumenInduk }: Props = $props();
</script>

<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl border border-emerald-500/20 p-6 md:p-8 mb-8">
	<!-- Background subtle glow decoration -->
	<div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
	<div class="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

	<div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
		<!-- Left: Identity & Welcome -->
		<div class="lg:col-span-7 space-y-4">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
					<ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
					Portal Resmi Pengawas & Dinas Pendidikan
				</span>
				<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200">
					TP {schoolConfig.tahun_pelajaran} • Semester {schoolConfig.semester}
				</span>
			</div>

			<div>
				<h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
					<School class="w-8 h-8 text-emerald-400 shrink-0 hidden sm:inline-block" />
					<span>{schoolConfig.nama_sekolah}</span>
				</h1>
				<p class="text-emerald-200/80 text-sm mt-1 font-mono">
					NPSN: {schoolConfig.npsn} • {schoolConfig.alamat}
				</p>
			</div>

			<p class="text-slate-300 text-sm leading-relaxed max-w-2xl bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
				<span class="font-semibold text-emerald-300">Catatan Pengawas:</span> {schoolConfig.info_pengawas.pesan_selamat_datang}
			</p>

			<!-- Action buttons -->
			<div class="flex flex-wrap items-center gap-3 pt-2">
				<button
					type="button"
					onclick={onOpenDokumenInduk}
					class="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
				>
					<FileText class="w-4 h-4" />
					<span>Dokumen Induk Sekolah (KOSP / Kaldik)</span>
				</button>
			</div>
		</div>

		<!-- Right: Executive Stats Bento -->
		<div class="lg:col-span-5 grid grid-cols-2 gap-3.5">
			<!-- Overall readiness card -->
			<div class="col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center justify-between">
				<div>
					<span class="text-xs font-medium text-slate-300 uppercase tracking-wider block">Kesiapan Supervisi</span>
					<div class="flex items-baseline gap-2 mt-1">
						<span class="text-4xl font-black text-white">{stats.rataRataKesiapan}%</span>
						<span class="text-xs font-medium text-emerald-400">Rata-rata Terpenuhi</span>
					</div>
					<span class="text-xs text-slate-400 mt-1 block">Berdasarkan instrumen wajib</span>
				</div>

				<div class="relative w-20 h-20 flex items-center justify-center">
					<svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
						<path
							class="text-white/15"
							stroke-width="3.5"
							stroke="currentColor"
							fill="none"
							d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
						/>
						<path
							class="text-emerald-400 transition-all duration-1000 ease-out"
							stroke-dasharray="{stats.rataRataKesiapan}, 100"
							stroke-width="3.5"
							stroke-linecap="round"
							stroke="currentColor"
							fill="none"
							d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<Award class="w-7 h-7 text-emerald-400" />
					</div>
				</div>
			</div>

			<!-- Total Guru -->
			<div class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
				<div class="text-xs font-medium text-slate-400 uppercase tracking-wider">Dewan Guru</div>
				<div class="text-3xl font-extrabold text-white mt-1">{stats.totalGuru}</div>
				<span class="text-[11px] text-emerald-300/90 font-medium">Fase D (Kls 7, 8, 9)</span>
			</div>

			<!-- Total Dokumen -->
			<div class="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
				<div class="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Berkas</div>
				<div class="text-3xl font-extrabold text-white mt-1">{stats.totalDokumen}</div>
				<span class="text-[11px] text-emerald-400 font-medium">{stats.dokumenLengkap} Terverifikasi</span>
			</div>
		</div>
	</div>
</div>
