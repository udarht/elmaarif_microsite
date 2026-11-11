<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { schoolConfig } from '#lib/utils/supervisi';
	import { ExternalLink, ArrowRight, School, FileText, Folder, Sparkles } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let countdown = $state(1);
	let isRedirecting = $state(true);

	onMount(() => {
		const timer = setInterval(() => {
			if (countdown > 0) {
				countdown -= 1;
			} else {
				clearInterval(timer);
				window.location.href = data.targetUrl;
			}
		}, 600);

		return () => clearInterval(timer);
	});
</script>

<svelte:head>
	<title>Mengarahkan ke: {data.title} — {schoolConfig.nama_sekolah}</title>
	<meta http-equiv="refresh" content="1;url={data.targetUrl}" />
</svelte:head>

<div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
	<!-- Background subtle ambient glow -->
	<div class="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
	<div class="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

	<div class="w-full max-w-md bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
		<!-- School badge -->
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
			<School class="w-3.5 h-3.5" />
			<span>{schoolConfig.nama_sekolah}</span>
		</div>

		<!-- Animated Icon -->
		<div class="relative w-20 h-20 mx-auto flex items-center justify-center">
			<div class="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-ping"></div>
			<div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
				{#if data.isFolder}
					<Folder class="w-8 h-8" />
				{:else}
					<FileText class="w-8 h-8" />
				{/if}
			</div>
		</div>

		<!-- Title & Info -->
		<div class="space-y-2">
			<h1 class="text-lg font-bold text-white leading-snug">
				{data.title}
			</h1>
			<p class="text-xs text-slate-400">
				Pendidik: <span class="font-semibold text-emerald-300">{data.teacher.nama_lengkap}</span>
			</p>
			{#if data.document}
				<div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
					<span class="px-2 py-0.5 rounded bg-slate-700/80 font-mono text-emerald-400">{data.document.tipe_file}</span>
					<span>•</span>
					<span>Target: {data.document.kelas_target}</span>
				</div>
			{/if}
		</div>

		<!-- Countdown Progress Bar -->
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-slate-400">
				<span>Mengarahkan otomatis...</span>
				<span class="font-mono text-emerald-400 font-bold">{countdown}s</span>
			</div>
			<div class="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
				<div class="h-full bg-emerald-400 rounded-full animate-pulse transition-all duration-500" style="width: 100%"></div>
			</div>
		</div>

		<!-- Manual Action Button -->
		<div class="space-y-2 pt-2">
			<a
				href={data.targetUrl}
				class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
			>
				<span>Buka Berkas Sekarang</span>
				<ExternalLink class="w-4 h-4" />
			</a>

			<a
				href="/"
				class="inline-block text-xs text-slate-400 hover:text-slate-200 transition-colors pt-2"
			>
				Kembali ke Portal Supervisi
			</a>
		</div>
	</div>
</div>
