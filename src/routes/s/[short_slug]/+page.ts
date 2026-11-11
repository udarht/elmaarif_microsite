import { error } from '@sveltejs/kit';
import { teachers } from '#lib/utils/supervisi';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
	const slugs: { short_slug: string }[] = [];
	for (const t of teachers) {
		if (t.short_folder) {
			slugs.push({ short_slug: t.short_folder });
		}
		for (const d of t.perangkat_ajar) {
			if (d.short_slug) {
				slugs.push({ short_slug: d.short_slug });
			}
		}
	}
	return slugs;
}

export const load: PageLoad = ({ params }) => {
	const slug = params.short_slug;

	for (const t of teachers) {
		if (t.short_folder === slug) {
			return {
				isFolder: true,
				targetUrl: t.folder_utama_url,
				title: `Folder Google Drive: ${t.nama_lengkap}`,
				teacher: t,
				document: null
			};
		}
		const doc = t.perangkat_ajar.find((d) => d.short_slug === slug);
		if (doc) {
			return {
				isFolder: false,
				targetUrl: doc.target_url,
				title: doc.judul_dokumen,
				teacher: t,
				document: doc
			};
		}
	}

	throw error(404, `Shortlink "/s/${slug}" tidak ditemukan`);
};
