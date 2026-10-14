/**
 * Importa o catálogo da Memora Watches pra aba "Sob encomenda" do site.
 *
 * Pedido do Gabriel em 14/10/2026: o site passa a mostrar os mesmos relógios,
 * preços e fotos do catálogo da Memora (memorawatches.github.io), no lugar do
 * catálogo antigo e da pronta entrega.
 *
 * O script lê o catalog.json direto do repositório deles (é de
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

// Fotos oficiais da marca pros relógios em que a foto da Memora corta a
// pulseira (todos os Baltic) ou não tem foto nenhuma (7 relógios), 14/10/2026.
// Chave = id do relógio na Memora.
const fotosOficiais = JSON.parse(
  await readFile(path.join(process.cwd(), "scripts", "fotos-oficiais.json"), "utf8")
).relogios;

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
// Parcelado = preço à vista + 14%, dividido em 12 (pedido do Guilherme,
// 14/10/2026). Substitui a taxa de maquininha do config.json da Memora.
const ACRESCIMO_PARCELADO = 0.14;

function parcela12(preco) {
  return Math.round(((preco * (1 + ACRESCIMO_PARCELADO)) / 12) * 100) / 100;
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
  // caminho completo = foto oficial da marca; o resto vem do repositório da Memora
  let r = await fetch(caminho.startsWith("http") ? caminho : `${REPO_CDN}/${caminho}`);
  if (!r.ok && !caminho.startsWith("http")) r = await fetch(`${REPO_RAW}/${caminho}`);
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${caminho}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const pronta = await enquadrar(buf);
  await sharp(pronta.buffer).webp({ quality: 82 }).toFile(destino);
  return pronta.enquadrada ? "baixada-enquadrada" : "baixada";
}

// Enquadramento padrão da foto de produto: relógio inteiro, centralizado, com
// a mesma folga em cima e embaixo do Mido Ocean Star 39 Azul/Preto (4,4% da
// altura), que o Gabriel definiu como referência em 14/10/2026. Muitas fotos
// da Memora vêm com a pulseira encostando na borda ou com o relógio pequeno
// no meio do quadro.
const LADO = 1200;
const FOLGA = 0.044;
// pixel mais escuro que isso (em qualquer canal) conta como relógio
const LIMIAR_FUNDO = 238;

/** Só mexe em foto de estúdio (fundo branco nos quatro cantos). Foto de pulso,
 *  caixa ou ambiente sai só redimensionada. */
async function enquadrar(buf) {
  const base = sharp(buf).rotate().flatten({ background: "#ffffff" });
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const pixel = (x, y) => {
    const i = (y * W + x) * C;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const simples = async () => ({
    enquadrada: false,
    buffer: await sharp(buf)
      .rotate()
      .resize({ width: LADO, height: LADO, fit: "inside", withoutEnlargement: true })
      .toBuffer(),
  });

  // cantos: quadrados de 3% do lado, quase todo pixel tem que ser branco
  const s = Math.max(4, Math.round(Math.min(W, H) * 0.03));
  const cantos = [[0, 0], [W - s, 0], [0, H - s], [W - s, H - s]];
  let soma = [0, 0, 0];
  let n = 0;
  for (const [cx, cy] of cantos) {
    let brancos = 0;
    for (let y = cy; y < cy + s; y++)
      for (let x = cx; x < cx + s; x++) {
        const p = pixel(x, y);
        if (p[0] >= 235 && p[1] >= 235 && p[2] >= 235) brancos++;
        soma = soma.map((v, k) => v + p[k]);
        n++;
      }
    if (brancos / (s * s) < 0.98) return simples();
  }
  const fundo = soma.map((v) => Math.round(v / n));

  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = pixel(x, y);
      if (p[0] < LIMIAR_FUNDO || p[1] < LIMIAR_FUNDO || p[2] < LIMIAR_FUNDO) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  if (maxX < 0) return simples();

  // Centro horizontal = eixo de simetria do relógio, e não o meio da área
  // ocupada: sombra de um lado e coroa do outro empurravam o relógio pra
  // esquerda (Tissot PRX 35, 14/10/2026).
  const eixo = await eixoDeSimetria(base, W, H, minX, maxX);
  const meiaLargura = Math.max(eixo - minX, maxX - eixo) + 1;
  const altura = maxY - minY + 1;
  const util = Math.round(LADO * (1 - 2 * FOLGA));
  const escala = Math.min(util / (2 * meiaLargura), util / altura);
  const largura = maxX - minX + 1;
  const novaL = Math.round(largura * escala);
  const novaA = Math.round(altura * escala);

  const relogio = await base
    .clone()
    .extract({ left: minX, top: minY, width: largura, height: altura })
    .resize(novaL, novaA)
    .toBuffer();

  return {
    enquadrada: true,
    buffer: await sharp({
      create: { width: LADO, height: LADO, channels: 3, background: { r: fundo[0], g: fundo[1], b: fundo[2] } },
    })
      .composite([
        {
          input: relogio,
          left: Math.round(LADO / 2 - (eixo - minX) * escala),
          top: Math.round((LADO - novaA) / 2),
        },
      ])
      .png()
      .toBuffer(),
  };
}

/** Acha a coluna em que o relógio é mais simétrico (espelho esquerda/direita),
 *  numa cópia reduzida e em tons de cinza. Pixel claro (sombra, reflexo) não
 *  conta, pra sombra não puxar o eixo. Devolve a coluna na escala original. */
async function eixoDeSimetria(base, W, H, minX, maxX) {
  const PEQ = 240;
  const fator = PEQ / W;
  const altura = Math.max(1, Math.round(H * fator));
  const g = await base.clone().resize(PEQ, altura, { fit: "fill" }).toColourspace("b-w").raw().toBuffer();
  const canais = g.length / (PEQ * altura);
  const escuro = (x, y) => {
    if (x < 0 || x >= PEQ) return 0;
    const v = 255 - g[(y * PEQ + x) * canais];
    return v > 45 ? v : 0;
  };

  const a = Math.floor(minX * fator);
  const b = Math.ceil(maxX * fator);
  let melhor = (a + b) / 2;
  let melhorNota = -1;
  // o eixo fica no miolo da área ocupada; procura em meio pixel
  for (let c2 = Math.round((a + (b - a) * 0.3) * 2); c2 <= Math.round((a + (b - a) * 0.7) * 2); c2++) {
    const c = c2 / 2;
    let nota = 0;
    for (let k = 0.5; k <= (b - a); k += 1) {
      const xe = Math.round(c - k);
      const xd = Math.round(c + k);
      for (let y = 0; y < altura; y += 2) nota += Math.min(escuro(xe, y), escuro(xd, y));
    }
    if (nota > melhorNota) {
      melhorNota = nota;
      melhor = c;
    }
  }
  return Math.round(melhor / fator);
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
  const catalogo = await baixarJson("catalog.json");
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
    // onde a foto da Memora vem cortada, a capa e a primeira foto de cada
    // pulseira são trocadas pela foto oficial da marca (fotos-oficiais.json)
    const oficial = fotosOficiais[w.id];
    const principais = [...(w.images || [])];
    if (oficial?.principal) principais[0] = oficial.principal;
    const dasPulseiras = (w.straps || []).flatMap((s, i) => {
      const imgs = [...(s.images || [])];
      if (oficial?.pulseiras?.[i]) imgs[0] = oficial.pulseiras[i];
      return imgs;
    });
    const origem = [...principais, ...dasPulseiras];
    const locais = [];
    origem.forEach((caminho, n) => {
      // nome diferente pra foto oficial: o navegador não reaproveita a antiga em cache
      const arquivo = caminho.startsWith("http") ? `${w.id}-${n}-oficial.webp` : `${w.id}-${n}.webp`;
      locais.push({ caminho, url: `${URL_FOTOS}/${arquivo}` });
      tarefas.push(() => baixarFoto(caminho, path.join(PASTA_FOTOS, arquivo)).then((s) => ({ s, w, arquivo })));
    });
    fotosPorRelogio.set(w.id, locais);
  }

  console.log(`${visiveis.length} relógios, ${tarefas.length} fotos. Baixando...`);
  const resultados = await emParalelo(tarefas, 8);
  const erros = resultados.filter((r) => r?.erro);
  const baixadas = resultados.filter((r) => r?.s?.startsWith("baixada")).length;
  const enquadradas = resultados.filter((r) => r?.s === "baixada-enquadrada").length;
  console.log(`${baixadas} baixadas agora (${enquadradas} reenquadradas), ${tarefas.length - baixadas - erros.length} já existiam, ${erros.length} com erro`);
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
      installmentPrice: parcela12(w.price),
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
