<script lang="ts">
	import type { Teacher } from '#lib/types/supervisi';
	import { calculateTeacherStats } from '#lib/utils/supervisi';
	import { Folder, ExternalLink, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from '@lucide/svelte';

	interface Props {
		teacher: Teacher;
		onSelectTeacher: (teacher: Teacher) => void;
	}

	let { teacher, onSelectTeacher }: Props = $props();

	let stats = $derived(calculateTeacherStats(teacher));

	// Color gradient badge based on completion
	let progressColor = $derived(
		stats.persentaseKelengkapan >= 100
			? 'bg-emerald-500'
			: stats.persentaseKelengkapan >= 70
				? 'bg-teal-500'
				: 'bg-amber-500'
	);
</script>

<div class="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
	<!-- Top accent line -->
	<div class="h-1.5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
		<div class="h-full {progressColor} transition-all duration-500" style="width: {stats.persentaseKelengkapan}%"></div>
	</div>

	<div class="p-5 sm:p-6 space-y-4">
		<!-- Header: Avatar, Name, and Status -->
		<div class="flex items-start gap-3.5">
			<div class="relative shrink-0">
				<img
					src={teacher.avatar_url}
					alt={teacher.nama_lengkap}
					class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 p-1 border border-emerald-500/20 object-cover shadow-sm group-hover:scale-105 transition-transform"
					loading="lazy"
				/>
				{#if stats.persentaseKelengkapan >= 100}
					<div class="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 text-emerald-500 shadow">
						<CheckCircle2 class="w-4 h-4 fill-emerald-100" />
					</div>
				{/if}
			</div>

			<div class="space-y-1 min-w-0 flex-1">
				<div class="flex items-center gap-1.5 flex-wrap">
					<h3 class="font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
						{teacher.nama_lengkap}
					</h3>
				</div>
				<p class="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
					{teacher.gelar_status}
				</p>
			</div>
		</div>

		<!-- Mapel and Kelas Pills -->
		<div class="space-y-2">
			<div class="flex flex-wrap gap-1.5">
				{#each teacher.mapel_diampu as mapel}
					<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
						{mapel}
					</span>
				{/each}
			</div>

			<div class="flex flex-wrap gap-1 text-[11px] text-slate-400">
				{#each teacher.fase_kelas as kls}
					<span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
						{kls}
					</span>
				{/each}
			</div>
		</div>

		<!-- Progress Bar & Stats -->
		<div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
			<div class="flex items-center justify-between text-xs">
				<span class="font-medium text-slate-500 dark:text-slate-400">Kelengkapan Supervisi:</span>
				<span class="font-bold text-slate-900 dark:text-white">{stats.persentaseKelengkapan}%</span>
			</div>

			<div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
				<div class="h-full {progressColor} rounded-full transition-all duration-700" style="width: {stats.persentaseKelengkapan}%"></div>
			</div>

			<div class="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
				<span>{stats.dokumenWajibTerpenuhi} dari {stats.totalKategoriWajib} Dokumen Wajib</span>
				<span>{teacher.perangkat_ajar.length} Berkas Total</span>
			</div>
		</div>
	</div>

	<!-- Bottom Action Footer -->
	<div class="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
		<!-- Drive folder quick link -->
		<a
			href={teacher.folder_utama_url}
			target="_blank"
			rel="noopener noreferrer"
			class="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
			title="Buka Folder Google Drive Utama"
		>
			<Folder class="w-4 h-4" />
		</a>

		<!-- Open Teacher Devices Modal / Drawer -->
		<button
			type="button"
			onclick={() => onSelectTeacher(teacher)}
			class="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
		>
			<span>Lihat Perangkat</span>
			<ArrowRight class="w-3.5 h-3.5" />
		</button>
	</div>
</div>
