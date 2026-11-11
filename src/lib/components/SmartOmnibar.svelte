<script lang="ts">
	import type { Category } from '#lib/types/supervisi';
	import { Search, LayoutGrid, Table, Download, X, Filter } from '@lucide/svelte';

	interface Props {
		searchQuery: string;
		selectedMapel: string;
		selectedKelas: string;
		selectedKategori: string;
		viewMode: 'grid' | 'matrix';
		mapelOptions: string[];
		categories: Category[];
		onExportCSV: () => void;
		onUpdateSearch: (val: string) => void;
		onUpdateMapel: (val: string) => void;
		onUpdateKelas: (val: string) => void;
		onUpdateKategori: (val: string) => void;
		onUpdateViewMode: (mode: 'grid' | 'matrix') => void;
	}

	let {
		searchQuery,
		selectedMapel,
		selectedKelas,
		selectedKategori,
		viewMode,
		mapelOptions,
		categories,
		onExportCSV,
		onUpdateSearch,
		onUpdateMapel,
		onUpdateKelas,
		onUpdateKategori,
		onUpdateViewMode
	}: Props = $props();

	let searchInputRef: HTMLInputElement | null = $state(null);

	export function focusSearch() {
		if (searchInputRef) {
			searchInputRef.focus();
		}
	}
</script>

<div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 mb-8 space-y-4">
	<!-- Top Bar: Search Input & View Mode Toggle & CSV Export -->
	<div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
		<!-- Search input -->
		<div class="relative flex-1">
			<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
				<Search class="w-4 h-4" />
			</div>
			<input
				bind:this={searchInputRef}
				type="text"
				value={searchQuery}
				oninput={(e) => onUpdateSearch((e.target as HTMLInputElement).value)}
				placeholder="Cari guru, mata pelajaran, atau judul perangkat... (Tekan '/' untuk fokus)"
				class="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => onUpdateSearch('')}
					class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
					aria-label="Bersihkan pencarian"
				>
					<X class="w-4 h-4" />
				</button>
			{/if}
		</div>

		<!-- Action controls: View Mode & Export -->
		<div class="flex items-center gap-2 self-end md:self-auto shrink-0">
			<!-- View mode switcher -->
			<div class="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80">
				<button
					type="button"
					onclick={() => onUpdateViewMode('grid')}
					class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all {viewMode === 'grid'
						? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
						: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
				>
					<LayoutGrid class="w-4 h-4" />
					<span class="hidden sm:inline">Kartu Guru</span>
				</button>

				<button
					type="button"
					onclick={() => onUpdateViewMode('matrix')}
					class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all {viewMode === 'matrix'
						? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
						: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
				>
					<Table class="w-4 h-4" />
					<span class="hidden sm:inline">Matriks Ceklis</span>
				</button>
			</div>

			<!-- Export CSV -->
			<button
				type="button"
				onclick={onExportCSV}
				class="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
				title="Ekspor rekap matriks supervisi ke format CSV"
			>
				<Download class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
				<span class="hidden md:inline">Ekspor CSV</span>
			</button>
		</div>
	</div>

	<!-- Dropdown Filters: Kelas & Kategori -->
	<div class="flex flex-wrap items-center gap-2.5 pt-1">
		<div class="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
			<Filter class="w-3.5 h-3.5" />
			<span>Filter:</span>
		</div>

		<!-- Filter Kelas -->
		<select
			value={selectedKelas}
			onchange={(e) => onUpdateKelas((e.target as HTMLSelectElement).value)}
			class="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
		>
			<option value="Semua Kelas">Semua Tingkat Kelas</option>
			<option value="Kelas VII">Kelas VII</option>
			<option value="Kelas VIII">Kelas VIII</option>
			<option value="Kelas IX">Kelas IX</option>
		</select>

		<!-- Filter Kategori Dokumen -->
		<select
			value={selectedKategori}
			onchange={(e) => onUpdateKategori((e.target as HTMLSelectElement).value)}
			class="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
		>
			<option value="Semua Kategori">Semua Kategori Dokumen</option>
			{#each categories as cat}
				<option value={cat.kode_kategori}>{cat.nama_kategori}</option>
			{/each}
		</select>

		{#if selectedMapel !== 'Semua Mapel' || selectedKelas !== 'Semua Kelas' || selectedKategori !== 'Semua Kategori' || searchQuery}
			<button
				type="button"
				onclick={() => {
					onUpdateSearch('');
					onUpdateMapel('Semua Mapel');
					onUpdateKelas('Semua Kelas');
					onUpdateKategori('Semua Kategori');
				}}
				class="cursor-pointer text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 ml-auto"
			>
				Reset Filter
			</button>
		{/if}
	</div>

	<!-- Quick Filter Pills for Mapel -->
	<div class="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
		<button
			type="button"
			onclick={() => onUpdateMapel('Semua Mapel')}
			class="cursor-pointer px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all {selectedMapel === 'Semua Mapel'
				? 'bg-emerald-600 text-white font-semibold shadow-sm'
				: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
		>
			Semua Mapel
		</button>
		{#each mapelOptions as mapel}
			<button
				type="button"
				onclick={() => onUpdateMapel(mapel)}
				class="cursor-pointer px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all {selectedMapel === mapel
					? 'bg-emerald-600 text-white font-semibold shadow-sm'
					: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}"
			>
				{mapel}
			</button>
		{/each}
	</div>
</div>
