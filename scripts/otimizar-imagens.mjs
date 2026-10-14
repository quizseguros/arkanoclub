/**
 * Converte os PNG pesados de public/img pra WebP.
 *
 * O site é publicado como export estático (arkanoclub.com), e nesse modo o Next
 * serve as imagens exatamente como estão em public/ — `images.unoptimized` está
 * ligado no next.config.mjs porque a otimização sob demanda precisa de servidor.
 * Sem isso, um banner de 2 MB é baixado inteiro por cada visitante.
 *
 * Os PNG originais continuam no repositório: são a fonte, e dá pra regerar.
 *
 * Uso, de dentro de site/:
 *   node scripts/otimizar-imagens.mjs           → só mostra o que faria
 *   node scripts/otimizar-imagens.mjs --aplicar → grava os .webp
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.join(process.cwd(), "public", "img");
const aplicar = process.argv.includes("--aplicar");

// Largura máxima por pasta, com folga pra telas retina. Não adianta servir
// 3000px num banner que nunca passa de ~1250px de largura na tela.
const LARGURA = { banners: 1800, produtos: 1200, categorias: 1200, padrao: 1400 };

function larguraPara(rel) {
  const pasta = rel.split(path.sep)[0];
  return LARGURA[pasta] ?? LARGURA.padrao;
}

// Abaixo disso o ganho é irrelevante e não vale arriscar artefato num logo,
// que é onde compressão com perda aparece mais.
const MINIMO_BYTES = 100 * 1024;

async function listar(dir) {
  const saida = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const cheio = path.join(dir, item.name);
    if (item.isDirectory()) saida.push(...(await listar(cheio)));
    else if (/\.png$/i.test(item.name)) saida.push(cheio);
  }
  return saida;
}

const kb = (b) => (b / 1024).toFixed(0);

const arquivos = await listar(RAIZ);
let antes = 0;
let depois = 0;

for (const png of arquivos.sort()) {
  const rel = path.relative(RAIZ, png);
  const webp = png.replace(/\.png$/i, ".webp");
  const origem = await stat(png);
  if (origem.size < MINIMO_BYTES) {
    console.log(`${rel.padEnd(44)} ${String(kb(origem.size)).padStart(5)} KB   (pequeno, mantido)`);
    continue;
  }
  const img = sharp(png);
  const meta = await img.metadata();
  const alvo = larguraPara(rel);

  const buf = await img
    .resize({ width: Math.min(meta.width ?? alvo, alvo), withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  // padrões chapados e imagens já pequenas às vezes ficam maiores em WebP
  if (buf.length >= origem.size) {
    console.log(`${rel.padEnd(44)} ${String(kb(origem.size)).padStart(5)} KB   (WebP ficaria maior, mantido)`);
    continue;
  }

  antes += origem.size;
  depois += buf.length;
  const corte = Math.round((1 - buf.length / origem.size) * 100);
  console.log(
    `${rel.padEnd(44)} ${String(kb(origem.size)).padStart(5)} KB -> ${String(kb(buf.length)).padStart(5)} KB  (-${corte}%)`
  );

  if (aplicar) await sharp(buf).toFile(webp);
}

console.log(
  `\n${arquivos.length} imagens | ${(antes / 1024 / 1024).toFixed(1)} MB -> ${(depois / 1024 / 1024).toFixed(1)} MB` +
    `  (-${Math.round((1 - depois / antes) * 100)}%)`
);
console.log(aplicar ? "GRAVADO." : "(simulacao - rode com --aplicar)");
