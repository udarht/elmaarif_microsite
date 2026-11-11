<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { X, Copy, Check, Download, QrCode } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		title: string;
		url: string;
		subtitle?: string;
		onClose: () => void;
	}

	let { isOpen, title, url, subtitle, onClose }: Props = $props();

	let qrDataUrl = $state<string>('');
	let isCopied = $state(false);

	$effect(() => {
		if (isOpen && url) {
			QRCode.toDataURL(url, {
				width: 320,
				margin: 2,
				color: {
					dark: '#064e3b',
					light: '#ffffff'
				}
			})
				.then((dataUri) => {
					qrDataUrl = dataUri;
				})
				.catch((err) => {
					console.error('Failed to generate QR code:', err);
				});
		}
	});

	function handleCopy() {
		navigator.clipboard.writeText(url).then(() => {
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		});
	}

	function handleDownload() {
		if (!qrDataUrl) return;
		const a = document.createElement('a');
		a.href = qrDataUrl;
		a.download = `QR_${title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center animate-in fade-in zoom-in-95 duration-200">
			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
				aria-label="Tutup modal QR"
			>
				<X class="w-5 h-5" />
			</button>

			<div class="inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-3">
				<QrCode class="w-6 h-6" />
			</div>

			<h3 class="text-base font-bold text-slate-900 dark:text-white leading-tight px-4">{title}</h3>
			{#if subtitle}
				<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
			{/if}

			<!-- QR Code Preview Area -->
			<div class="my-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 inline-block shadow-inner">
				{#if qrDataUrl}
					<img
						src={qrDataUrl}
						alt="QR Code {title}"
						class="w-48 h-48 mx-auto rounded-xl shadow-sm bg-white p-2"
					/>
				{:else}
					<div class="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
						Menyiapkan QR Code...
					</div>
				{/if}
			</div>

			<p class="text-[11px] text-slate-400 mb-3">
				Pindai dengan kamera smartphone / tablet untuk membuka berkas instan.
			</p>

			<!-- URL box with copy button -->
			<div class="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-4">
				<span class="truncate flex-1 text-left select-all px-1">{url}</span>
				<button
					type="button"
					onclick={handleCopy}
					class="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
					title="Salin URL"
				>
					{#if isCopied}
						<Check class="w-3.5 h-3.5 text-emerald-500" />
					{:else}
						<Copy class="w-3.5 h-3.5" />
					{/if}
				</button>
			</div>

			<!-- Action buttons -->
			<div class="grid grid-cols-2 gap-2">
				<button
					type="button"
					onclick={handleDownload}
					disabled={!qrDataUrl}
					class="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
				>
					<Download class="w-3.5 h-3.5" />
					<span>Unduh PNG</span>
				</button>

				<button
					type="button"
					onclick={onClose}
					class="cursor-pointer px-3 py-2.5 rounded-xl font-medium text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
