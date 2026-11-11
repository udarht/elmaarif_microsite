<script lang="ts">
	import type { Teacher, Category, PerangkatAjar } from '#lib/types/supervisi';
	import { calculateTeacherStats } from '#lib/utils/supervisi';
	import {
		X,
		ExternalLink,
		Folder,
		Copy,
		Check,
		QrCode,
		Eye
	} from '@lucide/svelte';

	interface Props {
		teacher: Teacher | null;
		categories: Category[];
		onClose: () => void;
		onPreviewDoc: (doc: PerangkatAjar, teacher: Teacher) => void;
		onOpenQr: (title: string, url: string, subtitle?: string) => void;
	}

	let { teacher, categories, onClose, onPreviewDoc, onOpenQr }: Props = $props();

	let copiedSlug = $state<string | null>(null);
	let groupBy = $state<'kategori' | 'kelas'>('kategori');

	function copyShortlink(shortSlug: string) {
		const fullUrl = `${window.location.origin}/s/${shortSlug}`;
		navigator.clipboard.writeText(fullUrl).then(() => {
			copiedSlug = shortSlug;
			setTimeout(() => {
				copiedSlug = null;
			}, 2000);
		});
	}

	function getCategoryName(kodeKategori: string): string {
		const cat = categories.find((c) => c.kode_kategori === kodeKategori);
		return cat ? cat.nama_kategori : kodeKategori;
	}

	// Grouping calculations
	let groupedDocs = $derived.by(() => {
		if (!teacher) return [];
		if (groupBy === 'kategori') {
			const map = new Map<string, PerangkatAjar[]>();
			for (const cat of categories) {
				const docs = teacher.perangkat_ajar.filter((d) => d.kode_kategori === cat.kode_kategori);
				if (docs.length > 0) {
					map.set(cat.nama_kategori, docs);
				}
			}
			return Array.from(map.entries()).map(([groupName, docs]) => ({ groupName, docs }));
		} else {
			const map = new Map<string, PerangkatAjar[]>();
			for (const doc of teacher.perangkat_ajar) {
				const key = doc.kelas_target;
				if (!map.has(key)) map.set(key, []);
				map.get(key)!.push(doc);
			}
			return Array.from(map.entries()).map(([groupName, docs]) => ({ groupName, docs }));
		}
	});
</script>

{#if teacher}
	{@const stats = calculateTeacherStats(teacher)}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
				aria-label="Tutup modal"
			>
				<X class="w-5 h-5" />
			</button>

			<!-- Header: Teacher info -->
			<div class="flex items-start gap-4 mb-4 pb-4 border-b border-slate-100 shrink-0">
				<img
					src={teacher.avatar_url}
					alt={teacher.nama_lengkap}
					class="w-16 h-16 rounded-2xl bg-sky-50 p-1 border border-sky-300 object-cover shrink-0"
				/>

				<div class="space-y-1 flex-1 min-w-0">
					<div class="flex flex-wrap items-center gap-2">
						<h3 class="text-xl font-bold text-slate-900 truncate">{teacher.nama_lengkap}</h3>
						<span class="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
							Kesiapan: {stats.persentaseKelengkapan}%
						</span>
					</div>
					<p class="text-xs text-slate-500">{teacher.gelar_status}</p>
					<div class="flex flex-wrap gap-1.5 pt-1">
						{#each teacher.mapel_diampu as mapel}
							<span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
								{mapel}
							</span>
						{/each}
						<span class="text-[11px] text-slate-500 self-center">• {teacher.fase_kelas.join(', ')}</span>
					</div>
				</div>

				<!-- Quick QR for teacher master folder -->
				<button
					type="button"
					onclick={() =>
						onOpenQr(
							`Folder Utama: ${teacher?.nama_lengkap}`,
							`${window.location.origin}/s/${teacher?.short_folder}`,
							`Shortlink: /s/${teacher?.short_folder}`
						)}
					class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer shrink-0"
					title="QR Code Folder Drive Guru"
				>
					<QrCode class="w-3.5 h-3.5" />
					<span>QR Guru</span>
				</button>
			</div>

			<!-- Filter bar inside modal: Grouping toggle & Master drive link -->
			<div class="flex items-center justify-between pb-3 shrink-0">
				<div class="inline-flex p-0.5 bg-slate-100 rounded-xl text-xs font-medium border border-slate-200">
					<button
						type="button"
						onclick={() => (groupBy = 'kategori')}
						class="cursor-pointer px-3 py-1 rounded-lg transition-all {groupBy === 'kategori'
							? 'bg-sky-600 text-white font-bold shadow-xs'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Kelompokkan Kategori
					</button>
					<button
						type="button"
						onclick={() => (groupBy = 'kelas')}
						class="cursor-pointer px-3 py-1 rounded-lg transition-all {groupBy === 'kelas'
							? 'bg-sky-600 text-white font-bold shadow-xs'
							: 'text-slate-600 hover:text-slate-900'}"
					>
						Kelompokkan Kelas
					</button>
				</div>

				<a
					href={teacher.folder_utama_url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer"
				>
					<Folder class="w-3.5 h-3.5" />
					<span class="hidden sm:inline">Buka Folder Google Drive</span>
				</a>
			</div>

			<!-- Documents list (Scrollable) -->
			<div class="space-y-5 overflow-y-auto pr-1 flex-1">
				{#each groupedDocs as group}
					<div class="space-y-2.5">
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 rounded-full bg-sky-500"></span>
							<h4 class="text-xs font-bold uppercase tracking-wider text-slate-600">
								{group.groupName} ({group.docs.length})
							</h4>
						</div>

						<div class="space-y-2">
							{#each group.docs as doc}
								<div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
									<div class="space-y-1 min-w-0 flex-1">
										<div class="flex flex-wrap items-center gap-1.5">
											<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
												{doc.tipe_file}
											</span>
											<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
												{doc.kelas_target}
											</span>
											<span class="text-[10px] text-slate-500 font-mono">
												/s/{doc.short_slug}
											</span>
										</div>

										<h5 class="font-bold text-sm text-slate-900 leading-snug">
											{doc.judul_dokumen}
										</h5>
									</div>

									<!-- Action buttons -->
									<div class="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
										<!-- Preview Button -->
										<button
											type="button"
											onclick={() => onPreviewDoc(doc, teacher)}
											class="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all active:scale-95 shadow-xs"
											title="Pratinjau Dokumen (Embed Drawer)"
										>
											<Eye class="w-3.5 h-3.5" />
											<span class="hidden md:inline">Pratinjau</span>
										</button>

										<!-- QR Code Button -->
										<button
											type="button"
											onclick={() =>
												onOpenQr(
													doc.judul_dokumen,
													`${window.location.origin}/s/${doc.short_slug}`,
													`${teacher.nama_lengkap} • /s/${doc.short_slug}`
												)}
											class="cursor-pointer p-1.5 rounded-xl text-slate-500 hover:text-sky-600 bg-white border border-slate-200 hover:bg-sky-50 transition-colors"
											title="Tampilkan QR Code"
										>
											<QrCode class="w-3.5 h-3.5" />
										</button>

										<!-- Copy Shortlink Button -->
										<button
											type="button"
											onclick={() => copyShortlink(doc.short_slug)}
											class="cursor-pointer p-1.5 rounded-xl text-slate-500 hover:text-sky-600 bg-white border border-slate-200 hover:bg-sky-50 transition-colors"
											title="Salin Shortlink (/s/{doc.short_slug})"
										>
											{#if copiedSlug === doc.short_slug}
												<Check class="w-3.5 h-3.5 text-sky-600" />
											{:else}
												<Copy class="w-3.5 h-3.5" />
											{/if}
										</button>

										<!-- External Link Button -->
										<a
											href={doc.target_url}
											target="_blank"
											rel="noopener noreferrer"
											class="cursor-pointer p-1.5 rounded-xl text-slate-500 hover:text-sky-600 bg-white border border-slate-200 hover:bg-sky-50 transition-colors"
											title="Buka Berkas Asli di Tab Baru"
										>
											<ExternalLink class="w-3.5 h-3.5" />
										</a>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<!-- Footer -->
			<div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
				<a
					href="/guru/{teacher.slug_guru}"
					class="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1.5"
				>
					<span>Buka Halaman Portofolio Guru</span>
					<ExternalLink class="w-3 h-3" />
				</a>

				<button
					type="button"
					onclick={onClose}
					class="cursor-pointer px-5 py-2 rounded-xl font-medium text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
