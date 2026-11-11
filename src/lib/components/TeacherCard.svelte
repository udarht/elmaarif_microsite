<script lang="ts">
	import type { Teacher } from '#lib/types/supervisi';
	import { calculateTeacherStats } from '#lib/utils/supervisi';
	import { Folder, ArrowRight, CheckCircle2 } from '@lucide/svelte';

	interface Props {
		teacher: Teacher;
		onSelectTeacher: (teacher: Teacher) => void;
	}

	let { teacher, onSelectTeacher }: Props = $props();

	let stats = $derived(calculateTeacherStats(teacher));

	// Sky blue SMP uniform gradient progress bar
	let progressColor = $derived(
		stats.persentaseKelengkapan >= 100
			? 'bg-sky-500'
			: stats.persentaseKelengkapan >= 70
				? 'bg-sky-400'
				: 'bg-amber-400'
	);
</script>

<div class="group relative bg-white rounded-3xl border border-slate-200 hover:border-sky-400 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden">
	<!-- Top accent line -->
	<div class="h-1.5 w-full bg-slate-100 overflow-hidden">
		<div class="h-full {progressColor} transition-all duration-500" style="width: {stats.persentaseKelengkapan}%"></div>
	</div>

	<div class="p-5 sm:p-6 space-y-4">
		<!-- Header: Avatar, Name, and Status -->
		<div class="flex items-start gap-3.5">
			<div class="relative shrink-0">
				<img
					src={teacher.avatar_url}
					alt={teacher.nama_lengkap}
					class="w-14 h-14 rounded-2xl bg-sky-50 p-1 border border-sky-200 object-cover shadow-xs group-hover:scale-105 transition-transform"
					loading="lazy"
				/>
				{#if stats.persentaseKelengkapan >= 100}
					<div class="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-sky-600 shadow">
						<CheckCircle2 class="w-4 h-4 fill-sky-100" />
					</div>
				{/if}
			</div>

			<div class="space-y-1 min-w-0 flex-1">
				<div class="flex items-center gap-1.5 flex-wrap">
					<h3 class="font-bold text-base text-slate-900 truncate group-hover:text-sky-600 transition-colors">
						{teacher.nama_lengkap}
					</h3>
				</div>
				<p class="text-xs font-medium text-slate-500 line-clamp-1">
					{teacher.gelar_status}
				</p>
			</div>
		</div>

		<!-- Mapel and Kelas Pills -->
		<div class="space-y-2">
			<div class="flex flex-wrap gap-1.5">
				{#each teacher.mapel_diampu as mapel}
					<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
						{mapel}
					</span>
				{/each}
			</div>

			<div class="flex flex-wrap gap-1 text-[11px] text-slate-500">
				{#each teacher.fase_kelas as kls}
					<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
						{kls}
					</span>
				{/each}
			</div>
		</div>

		<!-- Progress Bar & Stats -->
		<div class="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-1.5">
			<div class="flex items-center justify-between text-xs">
				<span class="font-medium text-slate-500">Kelengkapan Supervisi:</span>
				<span class="font-bold text-sky-700">{stats.persentaseKelengkapan}%</span>
			</div>

			<div class="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
				<div class="h-full {progressColor} rounded-full transition-all duration-700" style="width: {stats.persentaseKelengkapan}%"></div>
			</div>

			<div class="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
				<span>{stats.dokumenWajibTerpenuhi} dari {stats.totalKategoriWajib} Dokumen Wajib</span>
				<span>{teacher.perangkat_ajar.length} Berkas Total</span>
			</div>
		</div>
	</div>

	<!-- Bottom Action Footer -->
	<div class="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
		<!-- Drive folder quick link -->
		<a
			href={teacher.folder_utama_url}
			target="_blank"
			rel="noopener noreferrer"
			class="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
			title="Buka Folder Google Drive Utama"
		>
			<Folder class="w-4 h-4" />
		</a>

		<!-- Open Teacher Devices Modal / Drawer -->
		<button
			type="button"
			onclick={() => onSelectTeacher(teacher)}
			class="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-sm shadow-sky-600/20 active:scale-95"
		>
			<span>Lihat Perangkat</span>
			<ArrowRight class="w-3.5 h-3.5" />
		</button>
	</div>
</div>
