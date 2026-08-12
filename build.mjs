import { rm, mkdir, readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'site';
const OUT = 'dist';

await rm(OUT, { recursive: true, force: true });
await mkdir(path.join(OUT, 'assets'), { recursive: true });

// images -> webp; large sources capped (display sizes don't need more)
const widthCaps = { 'tj-logo.png': 1200, 'contact.png': 1200 };
const images = (await readdir(path.join(SRC, 'assets'))).filter((f) => f.endsWith('.png'));
for (const f of images) {
  const name = f.replace(/\.png$/, '.webp');
  let img = sharp(path.join(SRC, 'assets', f));
  if (widthCaps[f]) img = img.resize({ width: widthCaps[f], withoutEnlargement: true });
  await img.webp({ quality: 82 }).toFile(path.join(OUT, 'assets', name));
}

// favicons from logo
await sharp(path.join(SRC, 'assets', 'tj-logo.png')).resize(64).png().toFile(path.join(OUT, 'favicon.png'));
await sharp(path.join(SRC, 'assets', 'tj-logo.png')).resize(180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));

// html with asset refs rewritten to webp; js ref versioned by content hash
const js = await readFile(path.join(SRC, 'main.js'));
const hash = createHash('sha256').update(js).digest('hex').slice(0, 8);
const html = await readFile(path.join(SRC, 'index.html'), 'utf8');
await writeFile(path.join(OUT, 'index.html'), html
  .replaceAll(/assets\/([\w-]+)\.png/g, 'assets/$1.webp')
  .replace('src="main.js"', `src="main.js?v=${hash}"`));

await copyFile(path.join(SRC, 'main.js'), path.join(OUT, 'main.js'));

// cloudflare pages cache headers
await writeFile(path.join(OUT, '_headers'), `/assets/*
  Cache-Control: public, max-age=31536000, immutable
/favicon.png
  Cache-Control: public, max-age=86400
/apple-touch-icon.png
  Cache-Control: public, max-age=86400
`);

console.log('built', images.length, 'images ->', OUT);
