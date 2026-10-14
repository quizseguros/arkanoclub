/**
 * Publica a pasta out/ no arkanoclub.com (Hostinger) por FTP, sem precisar
 * subir zip pelo Gerenciador de Arquivos.
 *
 * Manda só o que mudou desde o último envio: guarda o "carimbo" (tamanho +
 * hash) de cada arquivo em .ultimo-envio-hostinger.json e compara. Arquivo
 * que sumiu do out/ não é apagado no servidor, de propósito: sobra antiga não
 * quebra nada, apagar errado quebra.
 *
 * Acesso em site/.env.ftp (fora do git):
 *   FTP_HOST=...
 *   FTP_USER=...
 *   FTP_PASS=...
 *   FTP_DIR=public_html   (ou "/" se a conta FTP já abre dentro do public_html)
 *
 * Uso, de dentro de site/ (depois do build com EXPORT_ESTATICO=1):
 *   node scripts/publicar-hostinger.mjs          → envia o que mudou
 *   node scripts/publicar-hostinger.mjs --tudo   → reenvia tudo
 *   node scripts/publicar-hostinger.mjs --testar → só testa a conexão
 */
import { Client } from "basic-ftp";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const RAIZ = process.cwd();
const OUT = path.join(RAIZ, "out");
const REGISTRO = path.join(RAIZ, ".ultimo-envio-hostinger.json");
const ARQ_ENV = path.join(RAIZ, ".env.ftp");

const tudo = process.argv.includes("--tudo");
const soTestar = process.argv.includes("--testar");

function lerEnv() {
  if (!existsSync(ARQ_ENV)) {
    console.error("Falta o arquivo site/.env.ftp com FTP_HOST, FTP_USER e FTP_PASS.");
    process.exit(1);
  }
  const env = {};
  for (const linha of readFileSync(ARQ_ENV, "utf8").split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  for (const k of ["FTP_HOST", "FTP_USER", "FTP_PASS"]) {
    if (!env[k]) {
      console.error(`Falta ${k} no site/.env.ftp.`);
      process.exit(1);
    }
  }
  return env;
}

async function listar(dir) {
  const saida = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const cheio = path.join(dir, item.name);
    if (item.isDirectory()) saida.push(...(await listar(cheio)));
    else saida.push(cheio);
  }
  return saida;
}

async function carimbo(arquivo) {
  const buf = await readFile(arquivo);
  return `${buf.length}:${createHash("sha1").update(buf).digest("hex")}`;
}

async function main() {
  const env = lerEnv();
  const destino = (env.FTP_DIR || "public_html").replace(/\/+$/, "") || "/";

  const cliente = new Client(60_000);
  await cliente.access({
    host: env.FTP_HOST,
    user: env.FTP_USER,
    password: env.FTP_PASS,
    port: Number(env.FTP_PORT || 21),
    // a Hostinger aceita FTP com TLS; se der erro de certificado, cai pro FTP simples
    secure: env.FTP_TLS === "nao" ? false : true,
    secureOptions: { rejectUnauthorized: false },
  });
  console.log(`Conectado em ${env.FTP_HOST}.`);

  if (soTestar) {
    await cliente.cd(destino);
    const itens = await cliente.list();
    console.log(`Pasta ${destino}: ${itens.length} itens (${itens.slice(0, 8).map((i) => i.name).join(", ")}...)`);
    cliente.close();
    return;
  }

  if (!existsSync(OUT)) {
    console.error("Não achei a pasta out/. Rode antes: EXPORT_ESTATICO=1 npm run build");
    process.exit(1);
  }
  await stat(path.join(OUT, "index.html"));

  const anterior = !tudo && existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, "utf8")) : {};
  const atual = {};
  const enviar = [];
  for (const arq of await listar(OUT)) {
    const rel = path.relative(OUT, arq).split(path.sep).join("/");
    atual[rel] = await carimbo(arq);
    if (anterior[rel] !== atual[rel]) enviar.push(rel);
  }

  console.log(`${Object.keys(atual).length} arquivos no out/, ${enviar.length} pra enviar.`);
  // páginas por último: assim ninguém abre uma página nova que aponta pra
  // script ou foto que ainda não chegou
  enviar.sort((a, b) => (a.endsWith(".html") ? 1 : 0) - (b.endsWith(".html") ? 1 : 0));

  let feitos = 0;
  const registro = { ...anterior };
  for (const rel of enviar) {
    const remoto = `${destino === "/" ? "" : destino}/${rel}`;
    await cliente.ensureDir(path.posix.dirname(remoto));
    await cliente.cd("/");
    await cliente.uploadFrom(path.join(OUT, rel), remoto);
    registro[rel] = atual[rel];
    feitos++;
    if (feitos % 50 === 0 || feitos === enviar.length) {
      console.log(`  ${feitos}/${enviar.length}`);
      // salva no meio do caminho: se a conexão cair, a próxima rodada continua daqui
      writeFileSync(REGISTRO, JSON.stringify(registro));
    }
  }
  writeFileSync(REGISTRO, JSON.stringify(registro));
  cliente.close();
  console.log(enviar.length ? "Publicado no arkanoclub.com." : "Nada mudou desde o último envio.");
}

main().catch((e) => {
  console.error("Erro:", e.message);
  process.exit(1);
});
