import { error } from '@sveltejs/kit';
import { teachers } from '#lib/utils/supervisi';
import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
	return teachers.map((t) => ({ slug_guru: t.slug_guru }));
}

export const load: PageLoad = ({ params }) => {
	const teacher = teachers.find((t) => t.slug_guru === params.slug_guru);
	if (!teacher) {
		throw error(404, 'Data guru tidak ditemukan');
	}
	return {
		teacher
	};
};
