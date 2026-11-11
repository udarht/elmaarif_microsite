<script lang="ts">
	import type { Teacher, Category, PerangkatAjar } from '#lib/types/supervisi';
	import { calculateTeacherStats } from '#lib/utils/supervisi';
	import { CheckCircle2, AlertCircle, Clock, ExternalLink, ArrowRight, Folder } from '@lucide/svelte';

	interface Props {
		teachers: Teacher[];
		categories: Category[];
		onSelectTeacher: (teacher: Teacher) => void;
	}

	let { teachers, categories, onSelectTeacher }: Props = $props();

	function getDocForCategory(teacher: Teacher, kodeKategori: string): PerangkatAjar | undefined {
		return teacher.perangkat_ajar.find((d: PerangkatAjar) => d.kode_kategori === kodeKategori);
	}
</script>

<div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
	<!-- Table Header Intro -->
	<div class="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/40">
		<div>
			<h3 class="font-bold text-base text-slate-900 dark:text-white">Matriks Supervisi & Ceklis Kelengkapan</h3>
			<p class="text-xs text-slate-500 dark:text-slate-400">Tampilan rekapitulasi cepat seluruh instrumen administrasi pembelajaran dewan guru.</p>
		</div>

		<div class="flex items-center gap-4 text-xs">
			<span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
				<CheckCircle2 class="w-3.5 h-3.5" /> Lengkap
			</span>
			<span class="inline-flex items-center gap-1.5 text-amber-500 font-medium">
				<Clock class="w-3.5 h-3.5" /> Proses
			</span>
			<span class="inline-flex items-center gap-1.5 text-slate-400 font-medium">
				<span class="w-2 h-0.5 bg-slate-300 dark:bg-slate-700 inline-block"></span> Belum Unggah
			</span>
		</div>
	</div>

	<!-- Scrollable Table container -->
	<div class="overflow-x-auto">
		<table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
			<thead class="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
				<tr>
					<th class="py-3.5 px-4 w-12 text-center">No</th>
					<th class="py-3.5 px-4 min-w-[200px]">Nama Guru & Gelar</th>
					<th class="py-3.5 px-4 min-w-[160px]">Mapel & Kelas</th>
					{#each categories as cat}
						<th class="py-3.5 px-3 text-center min-w-[110px]" title={cat.deskripsi || cat.nama_kategori}>
							<div class="flex flex-col items-center gap-0.5">
								<span>{cat.nama_kategori.split('(')[0].trim()}</span>
								{#if cat.wajib_supervisi}
									<span class="text-[9px] lowercase font-normal px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
										wajib
									</span>
								{/if}
							</div>
						</th>
					{/each}
					<th class="py-3.5 px-4 text-center min-w-[100px]">Kesiapan</th>
					<th class="py-3.5 px-4 text-center w-24">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100 dark:divide-slate-800">
				{#each teachers as teacher, idx}
					{@const stats = calculateTeacherStats(teacher)}
					<tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
						<td class="py-3 px-4 text-center font-mono font-medium text-slate-400">
							{idx + 1}
						</td>

						<td class="py-3 px-4">
							<div class="flex items-center gap-2.5">
								<img
									src={teacher.avatar_url}
									alt={teacher.nama_lengkap}
									class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0"
									loading="lazy"
								/>
								<div>
									<div class="font-bold text-slate-900 dark:text-white leading-tight">
										{teacher.nama_lengkap}
									</div>
									<div class="text-[10px] text-slate-400 font-medium">
										{teacher.gelar_status}
									</div>
								</div>
							</div>
						</td>

						<td class="py-3 px-4">
							<div class="font-medium text-slate-800 dark:text-slate-200">
								{teacher.mapel_diampu.join(', ')}
							</div>
							<div class="text-[10px] text-slate-400">
								{teacher.fase_kelas.join(' • ')}
							</div>
						</td>

						<!-- Status per Category -->
						{#each categories as cat}
							{@const doc = getDocForCategory(teacher, cat.kode_kategori)}
							<td class="py-3 px-3 text-center">
								{#if doc}
									{#if doc.status_verifikasi === 'LENGKAP'}
										<a
											href={doc.target_url}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
											title="{doc.judul_dokumen} (Klik untuk buka)"
										>
											<CheckCircle2 class="w-4 h-4" />
										</a>
									{:else if doc.status_verifikasi === 'PROSES'}
										<a
											href={doc.target_url}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center justify-center p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
											title="{doc.judul_dokumen} (Dalam Proses)"
										>
											<Clock class="w-4 h-4" />
										</a>
									{:else}
										<span class="inline-flex items-center justify-center p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-500" title="Perlu Revisi">
											<AlertCircle class="w-4 h-4" />
										</span>
									{/if}
								{:else}
									<span class="text-slate-300 dark:text-slate-600 font-bold">—</span>
								{/if}
							</td>
						{/each}

						<!-- Overall completeness score -->
						<td class="py-3 px-4 text-center">
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold {stats.persentaseKelengkapan >= 100
									? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
									: stats.persentaseKelengkapan >= 70
										? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
										: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}"
							>
								{stats.persentaseKelengkapan}%
							</span>
						</td>

						<!-- Action -->
						<td class="py-3 px-4 text-center">
							<button
								type="button"
								onclick={() => onSelectTeacher(teacher)}
								class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all active:scale-95"
							>
								<span>Rincian</span>
								<ArrowRight class="w-3 h-3" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
