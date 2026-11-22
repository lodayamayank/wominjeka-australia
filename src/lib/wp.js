const perPage = 100;

export async function fetchAll(endpoint, params = {}) {
	const base = import.meta.env.WP_URL?.trim();
	if (!base) throw new Error('Set WP_URL to the WordPress site URL before building.');

	const url = new URL(`${base.replace(/\/+$/, '')}/wp-json/wp/v2/${endpoint}`);
	url.search = new URLSearchParams({ ...params, per_page: perPage }).toString();

	const items = [];
	let totalPages = 1;
	for (let page = 1; page <= totalPages; page++) {
		url.searchParams.set('page', String(page));
		const context = `WordPress ${endpoint}, page ${page}`;
		const response = await fetch(url, { signal: AbortSignal.timeout(30000) }).catch((cause) => {
			throw new Error(`${context}: request failed.`, { cause });
		});
		if (!response.ok) throw new Error(`${context}: HTTP ${response.status}.`);

		const batch = await response.json().catch((cause) => {
			throw new Error(`${context}: expected a JSON response.`, { cause });
		});
		if (!Array.isArray(batch)) throw new Error(`${context}: expected a list.`);
		items.push(...batch);

		if (page === 1) {
			const header = response.headers.get('X-WP-TotalPages');
			if (header === null && batch.length < perPage) break;
			if (header === null || !/^\d+$/.test(header) || !Number.isSafeInteger(Number(header))) {
				throw new Error(`${context}: missing or invalid X-WP-TotalPages header.`);
			}
			totalPages = Number(header);
		}
	}
	return items;
}

export function getPosts() {
	return fetchAll('posts', { _embed: 'wp:featuredmedia' });
}

export function getPages() {
	return fetchAll('pages', { _embed: 'wp:featuredmedia' });
}

export function getCategories() {
	return fetchAll('categories');
}

export function featuredImage(item) {
	const media = item?._embedded?.['wp:featuredmedia']?.[0];
	return media?.source_url ? { src: media.source_url, alt: media.alt_text ?? '' } : null;
}

const entities = {
	amp: '&', apos: "'", quot: '"', lt: '<', gt: '>', nbsp: '\u00a0',
	lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—',
	hellip: '…', copy: '©', reg: '®', trade: '™',
};

export function decode(value = '') {
	return String(value ?? '').replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
		if (!entity.startsWith('#')) return Object.hasOwn(entities, entity) ? entities[entity] : match;
		const codePoint = /^#x/i.test(entity) ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
		if (codePoint === 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
			return '\ufffd';
		}
		return String.fromCodePoint(codePoint);
	});
}
