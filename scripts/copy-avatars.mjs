import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'C:\\Users\\edgar\\.gemini\\antigravity-ide\\brain\\d44aa30c-87de-422b-9adf-baaa4f5a9ea0';
const destDir = path.resolve(process.cwd(), 'public/images/avaliadores');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  'marcelo_fernandes_1792767169793.jpg': 'marcelo-fernandes.jpg',
  'carla_menezes_1792767197323.jpg': 'carla-menezes.jpg',
  'ricardo_silveira_1792767227731.jpg': 'ricardo-silveira.jpg',
  'fernanda_prado_1792767261146.jpg': 'fernanda-prado.jpg'
};

for (const [srcFile, destFile] of Object.entries(map)) {
  const srcPath = path.join(srcDir, srcFile);
  const destPath = path.join(destDir, destFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copiado: ${srcFile} -> ${destFile}`);
  } else {
    console.error(`Não encontrado: ${srcPath}`);
  }
}
