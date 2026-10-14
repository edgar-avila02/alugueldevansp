// Recorta o conteúdo real de cada logo (ignora transparência e branco) e salva versões justas.
// Originais são preservados em *.orig.webp (fora do build via .gitignore não é necessário: ficam em /scripts/logo-originals).
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BACKUP = path.join(ROOT, 'scripts/logo-originals');
await fs.mkdir(BACKUP, { recursive: true });

const logos = [
  { name: 'emtu', file: 'public/wp-content/uploads/2025/07/Logo-EMTU.webp', src: null },
  { name: 'sptrans', file: 'public/wp-content/uploads/2025/07/Logo-SPTrans.webp', src: null },
  { name: 'antt', file: 'public/wp-content/uploads/2026/03/Logo-da-ANTT.webp', src: 'public/wp-content/uploads/2026/03/Logo-da-ANTT.webp.bak' },
  { name: 'artesp', file: 'public/wp-content/uploads/2026/03/Logo-da-Artesp.webp', src: 'public/wp-content/uploads/2026/03/Logo-da-Artesp.webp.bak' },
];

async function bbox(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const a = data[i + 3];
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      if (a > 40 && min < 225) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

for (const l of logos) {
  const backup = path.join(BACKUP, l.name + '.webp');
  try {
    await fs.access(backup);
  } catch {
    await fs.copyFile(path.join(ROOT, l.src || l.file), backup);
  }
  const box = await bbox(backup);
  const pad = 2;
  const meta = await sharp(backup).metadata();
  const region = {
    left: Math.max(0, box.left - pad),
    top: Math.max(0, box.top - pad),
    width: Math.min(meta.width - Math.max(0, box.left - pad), box.width + pad * 2),
    height: Math.min(meta.height - Math.max(0, box.top - pad), box.height + pad * 2),
  };
  const out = await sharp(backup).extract(region).webp({ quality: 95 }).toBuffer();
  await fs.writeFile(path.join(ROOT, l.file), out);
  const m = await sharp(out).metadata();
  console.log(l.name, `${m.width}x${m.height}`, 'aspect', (m.width / m.height).toFixed(2));
}
