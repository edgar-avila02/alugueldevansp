import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

async function optimizeLogos() {
  const dir = path.join(ROOT, 'public/wp-content/uploads/2026/03');

  // 1. ANTT: pegar o original de maior resolução
  const anttOriginal = path.join(dir, 'Logo-da-ANTT.webp.bak');
  const anttTrimmed = await sharp(anttOriginal)
    .trim({ threshold: 25 })
    .extend({ top: 12, bottom: 12, left: 16, right: 16, background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .webp({ quality: 95 })
    .toBuffer();

  for (const name of [
    'Logo-da-ANTT.webp',
    'Logo-da-ANTT-1024x535.webp',
    'Logo-da-ANTT-768x401.webp',
    'Logo-da-ANTT-300x157.webp',
  ]) {
    await fs.writeFile(path.join(dir, name), anttTrimmed);
    console.log(`Saved ${name}`);
  }

  // 2. Artesp: pegar o original de maior resolução
  const artespOriginal = path.join(dir, 'Logo-da-Artesp.webp.bak');
  // Dobra a resolução do recorte para garantir nitidez perfeita
  const artespTrimmedRaw = sharp(artespOriginal).trim({ threshold: 25 });
  const artespMeta = await artespTrimmedRaw.metadata();
  const artespTrimmed = await artespTrimmedRaw
    .resize({ width: Math.round(artespMeta.width * 2) })
    .extend({ top: 14, bottom: 14, left: 18, right: 18, background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .webp({ quality: 95 })
    .toBuffer();

  for (const name of [
    'Logo-da-Artesp.webp',
    'Logo-da-Artesp-300x157.webp',
  ]) {
    await fs.writeFile(path.join(dir, name), artespTrimmed);
    console.log(`Saved ${name}`);
  }

  console.log('All logos optimized and saved with high fidelity!');
}

optimizeLogos().catch(console.error);
