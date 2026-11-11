<script lang="ts">
	import type { PerangkatAjar, Teacher } from '#lib/types/supervisi';
	import { X, ExternalLink, QrCode, Copy, Check, Maximize2, FileText, Folder, Info } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		document: PerangkatAjar | null;
		teacher: Teacher | null;
		onClose: () => void;
		onOpenQr: (doc: PerangkatAjar) => void;
	}

	let { isOpen, document: doc, teacher, onClose, onOpenQr }: Props = $props();

	let isCopied = $state(false);
	let isLoadingIframe = $state(true);

	let isFolder = $derived.by(() => {
		if (!doc) return false;
		return doc.tipe_file === 'GDRIVE_FOLDER' || doc.target_url.includes('/drive/folders/');
	});

	let folderId = $derived.by(() => {
		if (!doc) return null;
		const match = doc.target_url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
		return match ? match[1] : null;
	});

	// Get embeddable URL
	let embedUrl = $derived.by(() => {
		if (!doc) return '';
		let url = doc.target_url;
		if (folderId) {
			return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
		}
		if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
			// Convert /view to /preview for clean inline embedding
			return url.replace(/\/view(\?.*)?$/, '/preview');
		}
		return url;
	});

	function handleCopy() {
		if (!doc) return;
		const fullUrl = `${window.location.origin}/s/${doc.short_slug}`;
		navigator.clipboard.writeText(fullUrl).then(() => {
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		});
	}

	$effect(() => {
		if (isOpen) {
			isLoadingIframe = true;
		}
	});
</script>

{#if isOpen && doc && teacher}
	<div
		class="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-all"
		role="dialog"
		aria-modal="true"
	>
		<!-- Slide-over Drawer Container -->
		<div class="relative w-full max-w-4xl bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full animate-in slide-in-from-right duration-300">
			<!-- Drawer Top Bar -->
			<div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50 shrink-0">
				<div class="space-y-0.5 min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<span class="text-[10px] font-bold px-2 py-0.5 rounded {isFolder ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-sky-100 text-sky-800'}">
							{isFolder ? 'Folder Drive' : doc.tipe_file}
						</span>
						<span class="text-xs text-slate-500 font-medium truncate">
							{teacher.nama_lengkap} • {doc.kelas_target}
						</span>
					</div>
					<h3 class="font-bold text-sm sm:text-base text-slate-900 truncate">
						{doc.judul_dokumen}
					</h3>
				</div>

				<!-- Quick actions -->
				<div class="flex items-center gap-1.5 shrink-0">
					<button
						type="button"
						onclick={handleCopy}
						class="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-200 transition-colors"
						title="Salin Shortlink (/s/{doc.short_slug})"
					>
						{#if isCopied}
							<Check class="w-4 h-4 text-sky-600" />
						{:else}
							<Copy class="w-4 h-4" />
						{/if}
					</button>

					<button
						type="button"
						onclick={() => onOpenQr(doc)}
						class="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-200 transition-colors"
						title="Tampilkan QR Code"
					>
						<QrCode class="w-4 h-4" />
					</button>

					<a
						href={doc.target_url}
						target="_blank"
						rel="noopener noreferrer"
						class="cursor-pointer p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-200 transition-colors"
						title="Buka Dokumen di Tab Baru"
					>
						<ExternalLink class="w-4 h-4" />
					</a>

					<button
						type="button"
						onclick={onClose}
						class="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1"
						aria-label="Tutup pratinjau"
					>
						<X class="w-5 h-5" />
					</button>
				</div>
			</div>

			<!-- Drawer Content Area -->
			<div class="relative flex-1 bg-slate-100 overflow-y-auto flex flex-col">
				{#if isFolder}
					<!-- Clean & Modern Google Drive Folder Hub -->
					<div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-6 my-auto">
						<!-- Big Animated Folder Badge -->
						<div class="relative">
							<div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/25">
								<Folder class="w-10 h-10 sm:w-12 sm:h-12" />
							</div>
							<div class="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
								Terverifikasi
							</div>
						</div>

						<div class="space-y-2 max-w-lg">
							<span class="inline-block text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
								Folder Google Drive Resmi
							</span>
							<h4 class="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
								{doc.judul_dokumen}
							</h4>
							<p class="text-xs text-slate-500">
								Pendidik: <span class="font-bold text-slate-700">{teacher.nama_lengkap}</span> • Sasaran: <span class="font-semibold text-slate-700">{doc.kelas_target}</span>
							</p>
						</div>

						<!-- Explanation Card -->
						<div class="max-w-md w-full bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-left space-y-2 shadow-xs">
							<div class="flex items-center gap-2 text-slate-800 font-bold text-xs">
								<Info class="w-4 h-4 text-sky-600 shrink-0" />
								<span>Akses Folder Terpadu</span>
							</div>
							<p class="text-[11px] text-slate-500 leading-relaxed">
								Google Drive memproteksi tampilan folder dari dalam bingkai peramban (*iframe*). Seluruh berkas perangkat ajar tersimpan lengkap dan dapat diakses langsung secara resmi di Google Drive.
							</p>
						</div>

						<!-- Primary Action: Open in Drive -->
						<div class="w-full max-w-md space-y-3">
							<a
								href={doc.target_url}
								target="_blank"
								rel="noopener noreferrer"
								class="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition-all active:scale-95"
							>
								<span>Buka Folder di Google Drive</span>
								<ExternalLink class="w-4 h-4" />
							</a>

							<div class="flex items-center justify-center gap-3 text-xs">
								<button
									type="button"
									onclick={handleCopy}
									class="cursor-pointer text-slate-500 hover:text-sky-600 font-medium inline-flex items-center gap-1"
								>
									{#if isCopied}
										<Check class="w-3.5 h-3.5 text-sky-600" />
										<span>Shortlink Disalin</span>
									{:else}
										<Copy class="w-3.5 h-3.5" />
										<span>Salin Shortlink</span>
									{/if}
								</button>
								<span class="text-slate-300">•</span>
								<button
									type="button"
									onclick={() => onOpenQr(doc)}
									class="cursor-pointer text-slate-500 hover:text-sky-600 font-medium inline-flex items-center gap-1"
								>
									<QrCode class="w-3.5 h-3.5" />
									<span>QR Code</span>
								</button>
							</div>
						</div>
					</div>
				{:else}
					{#if isLoadingIframe}
						<div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-10 text-slate-500 space-y-3">
							<div class="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
							<p class="text-xs font-semibold text-slate-600">Memuat pratinjau berkas digital...</p>
						</div>
					{/if}

					{#if doc.tipe_file === 'INTERAKTIF_3D' || doc.tipe_file === 'PDF' || doc.tipe_file === 'GDOC' || doc.tipe_file === 'GSHEET' || doc.tipe_file === 'CANVA'}
						<iframe
							src={embedUrl}
							title={doc.judul_dokumen}
							class="w-full h-full border-0"
							onload={() => (isLoadingIframe = false)}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
						></iframe>
					{:else}
						<div class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
							<div class="p-4 rounded-2xl bg-slate-200 text-slate-600">
								<FileText class="w-10 h-10 text-sky-600" />
							</div>
							<div class="space-y-1">
								<h4 class="font-bold text-base text-slate-800">Pratinjau Langsung Tidak Didukung</h4>
								<p class="text-xs text-slate-500 max-w-sm">
									Tipe berkas ini lebih optimal jika dibuka langsung pada tab peramban baru.
								</p>
							</div>
							<a
								href={doc.target_url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-all"
							>
								<span>Buka Dokumen Asli</span>
								<ExternalLink class="w-4 h-4" />
							</a>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Drawer Bottom Info Banner -->
			<div class="px-5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
				<div class="flex items-center gap-2">
					<span class="font-mono text-[11px] text-sky-600 font-bold">/s/{doc.short_slug}</span>
					<span>•</span>
					<span>Terakhir diperbarui: {doc.updated_at}</span>
				</div>

				<div class="flex items-center gap-3">
					{#if isFolder}
						<span class="text-[11px] text-slate-400 hidden md:inline">
							Jika folder tidak tampil karena proteksi cookie browser, gunakan tombol buka folder di atas.
						</span>
					{/if}
					<a
						href={doc.target_url}
						target="_blank"
						rel="noopener noreferrer"
						class="font-semibold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1 shrink-0"
					>
						<span>{isFolder ? 'Buka Folder Penuh' : 'Buka Layar Penuh'}</span>
						<Maximize2 class="w-3 h-3" />
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
