import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

async function processVanImage(inputFile, outputFile) {
  const { data, info } = await sharp(inputFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  
  // 1. Flood fill from image borders for background pixels (min(RGB) >= 246)
  const isBg = new Uint8Array(width * height);
  const queue = [];
  
  function add(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (isBg[idx]) return;
    const pIdx = idx * 4;
    const r = data[pIdx], g = data[pIdx+1], b = data[pIdx+2];
    if (r >= 246 && g >= 246 && b >= 246) {
      isBg[idx] = 1;
      queue.push(idx);
    }
  }
  
  for (let x = 0; x < width; x++) { add(x, 0); add(x, height - 1); }
  for (let y = 0; y < height; y++) { add(0, y); add(width - 1, y); }
  
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    add(x + 1, y);
    add(x - 1, y);
    add(x, y + 1);
    add(x, y - 1);
  }
  
  // 2. Output buffer
  const out = Buffer.from(data);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;
      const r = data[pIdx], g = data[pIdx+1], b = data[pIdx+2];
      const lum = (r + g + b) / 3;
      
      if (isBg[idx]) {
        // Transparent background
        out[pIdx + 3] = 0;
      } else {
        // Floor shadow at the bottom
        if (y >= height * 0.76) {
          const isNeutral = (Math.max(r, g, b) - Math.min(r, g, b)) <= 18;
          if (isNeutral && lum > 80) {
            // Shadow
            out[pIdx] = 0;
            out[pIdx + 1] = 0;
            out[pIdx + 2] = 0;
            out[pIdx + 3] = Math.round(255 - lum);
            continue;
          }
        }
        
        // Edge antialiasing against white
        let bgNeighborCount = 0;
        const neighbors = [
          [x+1, y], [x-1, y], [x, y+1], [x, y-1],
          [x+1, y+1], [x-1, y-1], [x+1, y-1], [x-1, y+1]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (isBg[ny * width + nx]) bgNeighborCount++;
          }
        }
        
        if (bgNeighborCount > 0 && lum > 215) {
          const alphaFactor = Math.min(1, Math.max(0, (255 - lum) / 40));
          out[pIdx + 3] = Math.round(alphaFactor * 255);
        } else {
          out[pIdx + 3] = 255;
        }
      }
    }
  }
  
  const processedBuffer = await sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ quality: 95, lossless: false })
    .toBuffer();
    
  await fs.writeFile(outputFile, processedBuffer);
  console.log('Processed main:', outputFile);
  return processedBuffer;
}

const list = [
  {
    file: 'public/wp-content/uploads/2025/07/Van-Mercedes-Benz-branca.webp',
    thumb: 'public/wp-content/uploads/2025/07/Van-Mercedes-Benz-branca-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Van-Sprinter-prata.webp',
    thumb: 'public/wp-content/uploads/2025/07/Van-Sprinter-prata-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Mercedes-Benz-Minivan-prata.webp',
    thumb: 'public/wp-content/uploads/2025/07/Mercedes-Benz-Minivan-prata-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Van-de-12-lugares-branca.webp',
    thumb: 'public/wp-content/uploads/2025/07/Van-de-12-lugares-branca-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Van-Citroen-branca-de-carga.webp',
    thumb: 'public/wp-content/uploads/2025/07/Van-Citroen-branca-de-carga-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Master-furgao.webp',
    thumb: 'public/wp-content/uploads/2025/07/Master-furgao-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Van-Renault-Master-preta.webp',
    thumb: 'public/wp-content/uploads/2025/07/Van-Renault-Master-preta-300x189.webp',
    thumbW: 300, thumbH: 189
  },
  {
    file: 'public/wp-content/uploads/2025/07/Mercedes-Benz-Minivan.webp',
    thumb: 'public/wp-content/uploads/2025/07/Mercedes-Benz-Minivan-300x150.webp',
    thumbW: 300, thumbH: 150
  },
  {
    file: 'public/wp-content/uploads/2025/07/Van-Sprinter.webp',
    thumb: null,
    thumbW: 0, thumbH: 0
  }
];

for (const item of list) {
  const orig = path.resolve('scripts/van-originals', path.basename(item.file));
  const mainBuf = await processVanImage(orig, path.resolve(item.file));
  if (item.thumb) {
    await sharp(mainBuf)
      .resize(item.thumbW, item.thumbH)
      .webp({ quality: 95, lossless: false })
      .toFile(path.resolve(item.thumb));
    console.log('Processed thumb:', item.thumb);
  }
}

console.log('All van images have been processed with transparency!');
