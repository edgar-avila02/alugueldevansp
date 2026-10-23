import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\edgar\\.gemini\\antigravity-ide\\brain\\d44aa30c-87de-422b-9adf-baaa4f5a9ea0';
const destDir = path.resolve('public/images/avaliadores');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const copyMap = {
  'marcelo_amador_1792776602275.jpg': 'marcelo-fernandes.jpg',
  'carla_amadora_1792776639288.jpg': 'carla-menezes.jpg',
  'ricardo_amador_1792776687530.jpg': 'ricardo-silveira.jpg',
  'fernanda_amadora_1792776737607.jpg': 'fernanda-prado.jpg',
  'bruno_amador_1792776806160.jpg': 'bruno-nascimento.jpg',
  'camila_amadora_1792776865726.jpg': 'camila-rocha.jpg'
};

for (const [srcFile, destFile] of Object.entries(copyMap)) {
  const srcPath = path.join(brainDir, srcFile);
  const destPath = path.join(destDir, destFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copiado: ${srcFile} -> ${destFile}`);
  } else {
    console.warn(`Arquivo não encontrado: ${srcPath}`);
  }
}
