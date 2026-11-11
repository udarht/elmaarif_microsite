import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const teachersPath = path.join(rootDir, 'src', 'lib', 'data', 'teachers.json');
const schoolConfigPath = path.join(rootDir, 'src', 'lib', 'data', 'school_config.json');
const staticDir = path.join(rootDir, 'static');
const redirectsPath = path.join(staticDir, '_redirects');
const headersPath = path.join(staticDir, '_headers');

if (!fs.existsSync(staticDir)) {
	fs.mkdirSync(staticDir, { recursive: true });
}

const teachers = JSON.parse(fs.readFileSync(teachersPath, 'utf8'));
const schoolConfig = JSON.parse(fs.readFileSync(schoolConfigPath, 'utf8'));

const lines = [
	'# ===================================================',
	'# Cloudflare Pages Edge Redirects Rules (_redirects)',
	'# Generated automatically by scripts/generate-redirects.js',
	'# ===================================================',
	''
];

// 1. Dokumen Induk Shortcuts
lines.push('# Dokumen Induk Satuan Pendidikan');
if (schoolConfig.dokumen_induk_sekolah && Array.isArray(schoolConfig.dokumen_induk_sekolah)) {
	for (const doc of schoolConfig.dokumen_induk_sekolah) {
		if (doc.id === 'DOK-INDUK-01') lines.push(`/kosp ${doc.url} 302`);
		else if (doc.id === 'DOK-INDUK-02') lines.push(`/kaldik ${doc.url} 302`);
		else if (doc.id === 'DOK-INDUK-03') lines.push(`/sk-tugas ${doc.url} 302`);
		else if (doc.id === 'DOK-INDUK-04') lines.push(`/jadwal ${doc.url} 302`);
	}
}
lines.push('');

// 2. Teacher Master Folders
lines.push('# Shortlink Folder Utama Dewan Guru');
for (const t of teachers) {
	if (t.short_folder && t.folder_utama_url) {
		lines.push(`/s/${t.short_folder} ${t.folder_utama_url} 302`);
		if (t.short_folder.startsWith('gdrive-')) {
			const alias = t.short_folder.replace('gdrive-', 'drive-');
			lines.push(`/s/${alias} ${t.folder_utama_url} 302`);
		}
	}
}
lines.push('');

// 3. Teacher Individual Documents
lines.push('# Shortlink Dokumen Perangkat Ajar');
let totalDocs = 0;
for (const t of teachers) {
	for (const doc of t.perangkat_ajar) {
		if (doc.short_slug && doc.target_url) {
			lines.push(`/s/${doc.short_slug} ${doc.target_url} 302`);
			totalDocs++;
		}
	}
}
lines.push('');

// 4. SPA Fallback
lines.push('# SPA Fallback for static prerender routes');
lines.push('/* /404.html 404');
lines.push('');

fs.writeFileSync(redirectsPath, lines.join('\n'), 'utf8');
console.log(`[generate-redirects] Successfully generated ${redirectsPath} with ${teachers.length} teachers and ${totalDocs} document redirects.`);

// Also write _headers for high performance caching on Cloudflare
const headersContent = [
	'# Cloudflare Edge Cache-Control Headers',
	'/*/_app/*',
	'  Cache-Control: public, max-age=31536000, immutable',
	'',
	'/*.html',
	'  Cache-Control: public, max-age=0, must-revalidate',
	'',
	'/s/*',
	'  Cache-Control: public, max-age=300'
].join('\n');

fs.writeFileSync(headersPath, headersContent, 'utf8');
console.log(`[generate-redirects] Successfully generated ${headersPath}`);
