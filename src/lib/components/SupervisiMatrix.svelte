<script lang="ts">
	import type { Teacher, Category, PerangkatAjar } from '#lib/types/supervisi';
	import { calculateTeacherStats } from '#lib/utils/supervisi';
	import { CheckCircle2, AlertCircle, Clock, ArrowRight } from '@lucide/svelte';

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

<div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
	<!-- Table Header Intro -->
	<div class="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
		<div>
			<h3 class="font-bold text-base text-slate-900">Matriks Supervisi & Ceklis Kelengkapan</h3>
			<p class="text-xs text-slate-500">Tampilan rekapitulasi cepat seluruh instrumen administrasi pembelajaran dewan guru.</p>
		</div>

		<div class="flex items-center gap-4 text-xs">
			<span class="inline-flex items-center gap-1.5 text-sky-600 font-semibold">
				<CheckCircle2 class="w-3.5 h-3.5" /> Lengkap
			</span>
			<span class="inline-flex items-center gap-1.5 text-amber-500 font-medium">
				<Clock class="w-3.5 h-3.5" /> Proses
			</span>
			<span class="inline-flex items-center gap-1.5 text-slate-400 font-medium">
				<span class="w-2 h-0.5 bg-slate-300 inline-block"></span> Belum Unggah
			</span>
		</div>
	</div>

	<!-- Scrollable Table container -->
	<div class="overflow-x-auto">
		<table class="w-full text-left text-xs text-slate-600">
			<thead class="bg-sky-50/60 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-sky-100">
				<tr>
					<th class="py-3.5 px-4 w-12 text-center">No</th>
					<th class="py-3.5 px-4 min-w-[200px]">Nama Guru & Gelar</th>
					<th class="py-3.5 px-4 min-w-[160px]">Mapel & Kelas</th>
					{#each categories as cat}
						<th class="py-3.5 px-3 text-center min-w-[110px]" title={cat.deskripsi || cat.nama_kategori}>
							<div class="flex flex-col items-center gap-0.5">
								<span>{cat.nama_kategori.split('(')[0].trim()}</span>
								{#if cat.wajib_supervisi}
									<span class="text-[9px] lowercase font-semibold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
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
			<tbody class="divide-y divide-slate-100">
				{#each teachers as teacher, idx}
					{@const stats = calculateTeacherStats(teacher)}
					<tr class="hover:bg-sky-50/40 transition-colors">
						<td class="py-3 px-4 text-center font-mono font-medium text-slate-400">
							{idx + 1}
						</td>

						<td class="py-3 px-4">
							<div class="flex items-center gap-2.5">
								<img
									src={teacher.avatar_url}
									alt={teacher.nama_lengkap}
									class="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 shrink-0"
									loading="lazy"
								/>
								<div>
									<div class="font-bold text-slate-900 leading-tight">
										{teacher.nama_lengkap}
									</div>
									<div class="text-[10px] text-slate-500 font-medium">
										{teacher.gelar_status}
									</div>
								</div>
							</div>
						</td>

						<td class="py-3 px-4">
							<div class="font-semibold text-slate-800">
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
											class="inline-flex items-center justify-center p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
											title="{doc.judul_dokumen} (Klik untuk buka)"
										>
											<CheckCircle2 class="w-4 h-4 text-sky-600" />
										</a>
									{:else if doc.status_verifikasi === 'PROSES'}
										<a
											href={doc.target_url}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center justify-center p-1.5 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 transition-colors"
											title="{doc.judul_dokumen} (Dalam Proses)"
										>
											<Clock class="w-4 h-4" />
										</a>
									{:else}
										<span class="inline-flex items-center justify-center p-1.5 rounded-lg bg-rose-50 text-rose-500" title="Perlu Revisi">
											<AlertCircle class="w-4 h-4" />
										</span>
									{/if}
								{:else}
									<span class="text-slate-300 font-bold">—</span>
								{/if}
							</td>
						{/each}

						<!-- Overall completeness score -->
						<td class="py-3 px-4 text-center">
							<span
								class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold {stats.persentaseKelengkapan >= 100
									? 'bg-sky-100 text-sky-800'
									: stats.persentaseKelengkapan >= 70
										? 'bg-sky-50 text-sky-700 border border-sky-200'
										: 'bg-amber-100 text-amber-800'}"
							>
								{stats.persentaseKelengkapan}%
							</span>
						</td>

						<!-- Action -->
						<td class="py-3 px-4 text-center">
							<button
								type="button"
								onclick={() => onSelectTeacher(teacher)}
								class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 font-semibold text-xs transition-all active:scale-95"
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
