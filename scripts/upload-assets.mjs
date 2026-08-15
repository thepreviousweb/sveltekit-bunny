import { createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const region = process.env.BUNNY_ASSETS_REGION;
const zone = process.env.BUNNY_ASSETS_ZONE;
const key = process.env.BUNNY_ASSETS_UPLOAD_KEY ?? process.env.BUNNY_ASSETS_KEY;
const prefix = (process.env.BUNNY_ASSETS_PREFIX ?? '').replace(/^\/+|\/+$/g, '');
const root = join(process.cwd(), '.svelte-kit/bunny.net/client');

if (!region || !zone || !key) {
	console.error('Missing BUNNY_ASSETS_REGION, BUNNY_ASSETS_ZONE, or upload key');
	process.exit(1);
}

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(full)));
		else files.push(full);
	}
	return files;
}

const files = await walk(root);
let ok = 0;
let fail = 0;

for (const file of files) {
	const rel = relative(root, file).split(/[/\\]/).join('/');
	const remotePath = prefix ? `${prefix}/${rel}` : rel;
	const url = `https://${region}/${zone}/${remotePath}`;

	const res = await fetch(url, {
		method: 'PUT',
		headers: { AccessKey: key },
		body: createReadStream(file),
		duplex: 'half'
	});

	if (res.ok) {
		ok += 1;
		console.log(`OK  ${remotePath}`);
	} else {
		fail += 1;
		console.error(`FAIL ${remotePath} (${res.status})`);
	}
}

console.log(`Uploaded ${ok}/${files.length}, failed ${fail}`);
if (fail > 0) process.exit(1);
