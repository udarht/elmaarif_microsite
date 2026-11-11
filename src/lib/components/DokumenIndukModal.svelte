<script lang="ts">
	import type { DokumenInduk } from '#lib/types/supervisi';
	import { X, ExternalLink, FileText, Globe } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		dokumenIndukList: DokumenInduk[];
		onClose: () => void;
	}

	let { isOpen, dokumenIndukList, onClose }: Props = $props();
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
				aria-label="Tutup modal"
			>
				<X class="w-5 h-5" />
			</button>

			<div class="flex items-center gap-3 mb-6">
				<div class="p-3 rounded-2xl bg-sky-100 text-sky-600">
					<FileText class="w-6 h-6" />
				</div>
				<div>
					<h3 class="text-xl font-bold text-slate-900">Dokumen Induk Satuan Pendidikan</h3>
					<p class="text-xs text-slate-500">SMP El Ma'arif Boarding School • TP 2026/2027</p>
				</div>
			</div>

			<div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
				{#each dokumenIndukList as doc}
					<div class="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
									{doc.tipe}
								</span>
								<h4 class="font-bold text-sm text-slate-800">{doc.judul}</h4>
							</div>
							<p class="text-xs text-slate-500 leading-relaxed">{doc.deskripsi}</p>
						</div>

						<a
							href={doc.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shrink-0 active:scale-95 shadow-xs"
						>
							<span>Buka Dokumen</span>
							<ExternalLink class="w-3.5 h-3.5" />
						</a>
					</div>
				{/each}
			</div>

			<div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
				<a
					href="https://elmaarifpasbar.sch.id"
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1.5"
				>
					<Globe class="w-3.5 h-3.5" />
					<span>Kunjungi elmaarifpasbar.sch.id</span>
					<ExternalLink class="w-3 h-3" />
				</a>

				<button
					type="button"
					onclick={onClose}
					class="cursor-pointer px-5 py-2.5 rounded-xl font-medium text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
