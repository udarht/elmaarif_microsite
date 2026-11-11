<script lang="ts">
	import type { DokumenInduk } from '#lib/types/supervisi';
	import { X, ExternalLink, FileText, CheckCircle2 } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		dokumenIndukList: DokumenInduk[];
		onClose: () => void;
	}

	let { isOpen, dokumenIndukList, onClose }: Props = $props();
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
				aria-label="Tutup modal"
			>
				<X class="w-5 h-5" />
			</button>

			<div class="flex items-center gap-3 mb-6">
				<div class="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
					<FileText class="w-6 h-6" />
				</div>
				<div>
					<h3 class="text-xl font-bold text-slate-900 dark:text-white">Dokumen Induk Satuan Pendidikan</h3>
					<p class="text-xs text-slate-500 dark:text-slate-400">SMP El Ma'arif Boarding School • TP 2026/2027</p>
				</div>
			</div>

			<div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
				{#each dokumenIndukList as doc}
					<div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
									{doc.tipe}
								</span>
								<h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{doc.judul}</h4>
							</div>
							<p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{doc.deskripsi}</p>
						</div>

						<a
							href={doc.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shrink-0 active:scale-95 shadow-sm"
						>
							<span>Buka Dokumen</span>
							<ExternalLink class="w-3.5 h-3.5" />
						</a>
					</div>
				{/each}
			</div>

			<div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
				<button
					type="button"
					onclick={onClose}
					class="cursor-pointer px-5 py-2.5 rounded-xl font-medium text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
