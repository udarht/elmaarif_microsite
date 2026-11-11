<script lang="ts">
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
					dark: '#0369a1', // Sky blue 700 (seragam SMP modern, high contrast)
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
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 text-center animate-in fade-in zoom-in-95 duration-200">
			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
				aria-label="Tutup modal QR"
			>
				<X class="w-5 h-5" />
			</button>

			<div class="inline-flex p-3 rounded-2xl bg-sky-100 text-sky-600 mb-3">
				<QrCode class="w-6 h-6" />
			</div>

			<h3 class="text-base font-bold text-slate-900 leading-tight px-4">{title}</h3>
			{#if subtitle}
				<p class="text-xs text-slate-500 mt-1">{subtitle}</p>
			{/if}

			<!-- QR Code Preview Area -->
			<div class="my-5 p-4 rounded-2xl bg-sky-50 border border-sky-200 inline-block shadow-inner">
				{#if qrDataUrl}
					<img
						src={qrDataUrl}
						alt="QR Code {title}"
						class="w-48 h-48 mx-auto rounded-xl shadow-xs bg-white p-2"
					/>
				{:else}
					<div class="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
						Menyiapkan QR Code...
					</div>
				{/if}
			</div>

			<p class="text-[11px] text-slate-500 mb-3">
				Pindai dengan kamera smartphone / tablet untuk membuka berkas instan.
			</p>

			<!-- URL box with copy button -->
			<div class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-xs font-mono text-slate-700 border border-slate-200 mb-4">
				<span class="truncate flex-1 text-left select-all px-1">{url}</span>
				<button
					type="button"
					onclick={handleCopy}
					class="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer shrink-0 border border-slate-200"
					title="Salin URL"
				>
					{#if isCopied}
						<Check class="w-3.5 h-3.5 text-sky-600" />
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
					class="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-xs active:scale-95"
				>
					<Download class="w-3.5 h-3.5" />
					<span>Unduh PNG</span>
				</button>

				<button
					type="button"
					onclick={onClose}
					class="cursor-pointer px-3 py-2.5 rounded-xl font-medium text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
