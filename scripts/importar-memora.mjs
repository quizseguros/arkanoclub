/**
 * Importa o catálogo da Memora Watches pra aba "Sob encomenda" do site.
 *
 * Pedido do Gabriel em 14/10/2026: o site passa a mostrar os mesmos relógios,
 * preços e fotos do catálogo da Memora (memorawatches.github.io), no lugar do
 * catálogo antigo e da pronta entrega.
 *
 * O script lê o catalog.json e o config.json direto do repositório deles (é de
 * onde o próprio site da Memora lê), baixa as fotos pelo jsDelivr, converte pra
 * WebP em public/img/sob-encomenda/ e grava data/sob-encomenda.json, que o
 * data/products.ts transforma em produtos.
 *
 * Pra atualizar quando a Memora mudar preço ou entrar relógio novo, é só rodar
 * de novo. Fotos que já foram baixadas não são baixadas outra vez.
 *
 * Uso, de dentro de site/:
 *   node scripts/importar-memora.mjs
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const REPO_RAW = "https://raw.githubusercontent.com/memorawatches/memorawatches.github.io/main";
const REPO_CDN = "https://cdn.jsdelivr.net/gh/memorawatches/memorawatches.github.io@main";
const PASTA_FOTOS = path.join(process.cwd(), "public", "img", "sob-encomenda");
const URL_FOTOS = "/img/sob-encomenda";
const SAIDA = path.join(process.cwd(), "data", "sob-encomenda.json");
const SEM_FOTO = `${URL_FOTOS}/sem-foto.webp`;

// mesma regra do site deles: esgotado e descontinuado não aparecem na listagem
const FORA_DO_AR = /esgotado|descontinuado/i;
// "Mais pedido" no site deles = mais de 2 unidades vendidas
const LIMIAR_MAIS_PEDIDO = 2;

// copiada do site da Memora: sem ela "Christopher Ward" vira marca "Christopher"
const MARCAS_COMPOSTAS = [
  "Christopher Ward", "Furlan Marri", "Grand Seiko", "Frederique Constant",
  "Maurice Lacroix", "Raymond Weil", "Dan Henry", "Nivada Grenchen",
  "Studio Underd0g", "Kurono Tokyo", "Otsuka Lotec", "Louis Erard",
  "Baume Mercier", "Carl Bucherer", "Massena LAB", "Serica Watches",
  "MD Watches",
];

const nomeLimpo = (n) => String(n || "").replace(/_/g, " ").replace(/\s+/g, " ").trim();

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function baixarJson(arquivo) {
  const r = await fetch(`${REPO_RAW}/${arquivo}?t=${Date.now()}`);
  if (!r.ok) throw new Error(`${arquivo}: HTTP ${r.status}`);
  return r.json();
}

/** "39.5mm", "36,5 mm", "32mm x 50mm" → primeiro número, em mm */
function diametro(medida) {
  const m = String(medida || "").match(/(\d+(?:[.,]\d+)?)/);
  return m ? Number(m[1].replace(",", ".")) : 0;
}

// Relógios que vêm sem "movimento" no catálogo da Memora (conferido em
// 14/10/2026), preenchidos pela referência. Sem isso caíam como quartzo.
const MOVIMENTO_POR_REF = {
  "T120.852.11.051.00": "Quartzo (GMT)", // Tissot Seastar 1000 GMT, linha quartzo
  "T120.852.22.051.00": "Quartzo (GMT)",
  "M026.907.11.061.00": "Automático", // Mido Ocean Star 39, calibre 72 (escrito no mostrador)
  H13519711: "Corda manual", // Hamilton American Classic Boulton, "Mechanical" no mostrador
  H38416711: "Automático (cronógrafo)", // Hamilton American Classic Intra-Matic Auto Chrono
  SSB477: "Quartzo (cronógrafo)", // Seiko SSB = cronógrafo quartzo
  SSB453: "Quartzo (cronógrafo)",
  "4521543S": "Automático", // Venezianico Nereide, linha automática
  SSC965: "Solar (cronógrafo)", // Seiko Speedtimer solar, igual aos outros SSC do catálogo
};

function tipoMovimento(mov) {
  const s = String(mov || "").toLowerCase();
  if (s.includes("autom")) return "automático";
  if (s.includes("manual")) return "manual";
  return "quartzo";
}

/** Parcela de 12x igual à do site deles: preço / (1 - taxa) / 12, arredondado pra cima */
function parcela12(preco, taxas) {
  const taxa = (taxas["12"] || 0) / 100;
  return Math.ceil(preco / (1 - taxa) / 12);
}

const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function descricao(w) {
  const specs = [
    w.ref && `Ref. ${w.ref}`,
    w.medida && `caixa de ${w.medida}`,
    w.movimento && `movimento ${w.movimento.toLowerCase()}`,
    w.resistencia && `resistência à água de ${w.resistencia}`,
    w.material && w.material.toLowerCase(),
    w.vidro && `vidro ${w.vidro.toLowerCase()}`,
    w.espessura && `espessura de ${w.espessura}`,
    w.lugToLug && `lug to lug de ${w.lugToLug}`,
    w.reservaMarcha && `reserva de marcha de ${w.reservaMarcha}`,
  ].filter(Boolean);
  let texto = specs.join(", ") + ".";
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);

  if (w.straps?.length) {
    const base = w.strapBaseName ? `pulseira ${w.strapBaseName}` : "pulseira original";
    const outras = w.straps.map((s) => `${s.nome} (${moeda(s.price)})`).join(", ");
    texto += ` Preço com ${base}. Também disponível com ${outras}.`;
  }
  if (w.sizes?.length) {
    const outros = w.sizes
      .map((s) => `${s.medida}${s.price ? ` (${moeda(s.price)})` : ""}`)
      .join(", ");
    texto += ` Também disponível em ${outros}.`;
  }
  if (w.acompanha) texto += ` Acompanha ${w.acompanha}.`;
  return texto;
}

async function baixarFoto(caminho, destino) {
  if (existsSync(destino)) return "ja-tinha";
  // o jsDelivr recusa (403) arquivo muito grande; aí vai direto no GitHub
  let r = await fetch(`${REPO_CDN}/${caminho}`);
  if (!r.ok) r = await fetch(`${REPO_RAW}/${caminho}`);
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${caminho}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destino);
  return "baixada";
}

/** roda as tarefas com no máximo `n` ao mesmo tempo, pra não martelar o CDN */
async function emParalelo(tarefas, n) {
  const resultados = [];
  let i = 0;
  async function trabalhador() {
    while (i < tarefas.length) {
      const atual = i++;
      resultados[atual] = await tarefas[atual]().catch((e) => ({ erro: e.message }));
    }
  }
  await Promise.all(Array.from({ length: n }, trabalhador));
  return resultados;
}

async function gerarSemFoto() {
  const destino = path.join(PASTA_FOTOS, "sem-foto.webp");
  if (existsSync(destino)) return;
  const simbolo = await sharp(path.join(process.cwd(), "public", "img", "identidade", "simbolo-branco.png"))
    .resize(220)
    .ensureAlpha(0.25)
    .png()
    .toBuffer();
  await sharp({ create: { width: 1200, height: 1200, channels: 3, background: "#1a1a1a" } })
    .composite([{ input: simbolo, gravity: "center", blend: "over" }])
    .webp({ quality: 82 })
    .toFile(destino);
}

async function main() {
  const [catalogo, config] = await Promise.all([baixarJson("catalog.json"), baixarJson("config.json")]);
  // marcas que o site já conhece, pra reaproveitar o slug (e o logo) delas
  const brandsTs = await readFile(path.join(process.cwd(), "data", "brands.ts"), "utf8");
  const marcasNossas = [...brandsTs.matchAll(/slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map((m) => ({
    slug: m[1],
    name: m[2],
  }));

  const conhecidas = [...new Set([...MARCAS_COMPOSTAS, ...catalogo.map((w) => w.brand).filter(Boolean)])].sort(
    (a, b) => b.length - a.length
  );
  function marcaDe(w) {
    if (w.brand) return w.brand;
    const nome = nomeLimpo(w.name).toLowerCase();
    return (
      conhecidas.find((m) => nome === m.toLowerCase() || nome.startsWith(m.toLowerCase() + " ")) ??
      nomeLimpo(w.name).split(" ")[0]
    );
  }
  function slugDaMarca(nome) {
    const nossa = marcasNossas.find((b) => b.name.toLowerCase() === nome.toLowerCase());
    return nossa ? nossa.slug : slugify(nome);
  }

  // mesma ordem da vitrine deles ("Mais pedidos"): sort estável por pedidos,
  // empate fica na ordem do arquivo
  const visiveis = catalogo
    .filter((w) => !FORA_DO_AR.test(w.status || ""))
    .map((w, ordem) => ({ w, ordem }))
    .sort((a, b) => (b.w.orderCount || 0) - (a.w.orderCount || 0) || a.ordem - b.ordem)
    .map(({ w }) => (w.movimento ? w : { ...w, movimento: MOVIMENTO_POR_REF[w.ref] }));

  const semMovimento = visiveis.filter((w) => !w.movimento);
  if (semMovimento.length) {
    console.log(`ATENÇÃO: ${semMovimento.length} sem movimento (entram como quartzo), conferir e pôr em MOVIMENTO_POR_REF:`);
    semMovimento.forEach((w) => console.log(`  ${w.name} | ${w.ref}`));
  }

  await mkdir(PASTA_FOTOS, { recursive: true });
  await gerarSemFoto();

  // fotos do relógio primeiro, depois as das pulseiras alternativas
  const fotosPorRelogio = new Map();
  const tarefas = [];
  for (const w of visiveis) {
    const origem = [...(w.images || []), ...(w.straps || []).flatMap((s) => s.images || [])];
    const locais = [];
    origem.forEach((caminho, n) => {
      const arquivo = `${w.id}-${n}.webp`;
      locais.push({ caminho, url: `${URL_FOTOS}/${arquivo}` });
      tarefas.push(() => baixarFoto(caminho, path.join(PASTA_FOTOS, arquivo)).then((s) => ({ s, w, arquivo })));
    });
    fotosPorRelogio.set(w.id, locais);
  }

  console.log(`${visiveis.length} relógios, ${tarefas.length} fotos. Baixando...`);
  const resultados = await emParalelo(tarefas, 8);
  const erros = resultados.filter((r) => r?.erro);
  const baixadas = resultados.filter((r) => r?.s === "baixada").length;
  console.log(`${baixadas} baixadas agora, ${tarefas.length - baixadas - erros.length} já existiam, ${erros.length} com erro`);
  erros.forEach((e) => console.log("  erro:", e.erro));

  const falhas = new Set(erros.map((e) => e.erro));
  const idsUsados = new Set();
  const relogios = visiveis.map((w) => {
    const nome = nomeLimpo(w.name);
    const marca = marcaDe(w);
    let id = slugify(`${nome} ${w.ref || ""}`) || `memora-${w.id}`;
    if (idsUsados.has(id)) id = `${id}-${w.id}`;
    idsUsados.add(id);

    const fotos = fotosPorRelogio
      .get(w.id)
      .filter((f) => ![...falhas].some((e) => e.includes(f.caminho)))
      .map((f) => f.url);

    return {
      id,
      memoraId: w.id,
      name: nome,
      brand: slugDaMarca(marca),
      brandName: marca,
      ref: w.ref || "",
      medida: w.medida || "",
      caseDiameter: diametro(w.medida),
      movement: tipoMovimento(w.movimento),
      movementLabel: w.movimento || "",
      price: w.price,
      installments: 12,
      installmentPrice: parcela12(w.price, config.rates || {}),
      bestseller: (w.orderCount || 0) > LIMIAR_MAIS_PEDIDO,
      image: fotos[0] ?? SEM_FOTO,
      images: fotos.length ? fotos : [SEM_FOTO],
      description: descricao(w),
    };
  });

  await writeFile(
    SAIDA,
    JSON.stringify({ importado_em: new Date().toISOString(), fonte: REPO_RAW, relogios }, null, 2) + "\n"
  );
  const semFoto = relogios.filter((r) => r.image === SEM_FOTO);
  console.log(`\n${relogios.length} relógios gravados em data/sob-encomenda.json`);
  if (semFoto.length) console.log(`${semFoto.length} sem foto na Memora: ${semFoto.map((r) => r.name).join(", ")}`);
}

main();
