"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Product, products } from "@/data/products";
import { brands } from "@/data/brands";
import { useSearch } from "@/lib/search-context";
import BrandLogoCarousel from "./BrandLogoCarousel";
import ProductCard from "./ProductCard";

// Layout pedido pelo Guilherme (14/10/2026):
// - desktop: fileiras de 5 e de 4 intercaladas; 27 por página fecha 3 pares
//   de fileiras sem sobrar relógio solto
// - celular: grade simples de 2 por linha. O slider de 6 + fileira de 2 foi
//   testado e ele não gostou (15/10/2026)
const FILEIRAS_DESKTOP = [5, 4];
const POR_PAGINA_DESKTOP = 27;
const POR_PAGINA_CELULAR = 24;

const ORDENS = [
  { value: "pedidos", label: "Mais pedidos" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
  { value: "az", label: "Nome A-Z" },
] as const;
type Ordem = (typeof ORDENS)[number]["value"];

const nomeDaMarca = (p: Product) => brands.find((b) => b.slug === p.brand)?.name ?? p.brandName ?? p.brand;

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// marcas do catálogo, da que tem mais relógio pra que tem menos (ordem da esteira)
const marcas = (() => {
  const conta = new Map<string, number>();
  products.forEach((p) => conta.set(p.brand, (conta.get(p.brand) ?? 0) + 1));
  return [...conta.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => ({ slug, nome: nomeDaMarca(products.find((p) => p.brand === slug)!) }));
})();

// paginação em quadrados com degradê (pedido do Gabriel, 15/10/2026): a página
// atual em degradê dourado, as outras em degradê grafite que acende no hover
const QUADRADO_BASE =
  "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm transition duration-200";
const QUADRADO = `${QUADRADO_BASE} border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.01] text-arkano-champagne/70 hover:border-arkano-gold/50 hover:from-arkano-gold/25 hover:to-transparent hover:text-arkano-gold`;
const QUADRADO_ATUAL = `${QUADRADO_BASE} bg-gradient-to-br from-arkano-gold-light via-arkano-gold to-[#8f6f2a] font-medium text-arkano-black shadow-[0_4px_14px_rgba(201,162,75,0.35)]`;
const QUADRADO_SETA = `${QUADRADO} disabled:pointer-events-none disabled:opacity-30`;

const selectClass =
  "rounded-full border border-white/10 bg-arkano-graphite px-4 py-2 text-sm text-arkano-champagne focus:border-arkano-gold focus:outline-none";

function useDesktop() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const atualizar = () => setDesktop(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);
  return desktop;
}

/** Grade paginada da aba Sob encomenda, com a esteira de marcas em cima.
 *  "Mais pedidos" é a ordem em que os relógios já vêm do importador. */
export default function SobEncomendaClient({ titulo = "h1" }: { titulo?: "h1" | "h2" }) {
  const [marca, setMarca] = useState<string | null>(null);
  const [ordem, setOrdem] = useState<Ordem>("pedidos");
  const [pagina, setPagina] = useState(1);
  const desktop = useDesktop();
  // texto digitado na busca do topo ("ver todos os resultados")
  const { search, setSearch } = useSearch();
  const busca = normalizar(search.trim());

  const lista = useMemo(() => {
    let filtrada = marca ? products.filter((p) => p.brand === marca) : products;
    if (busca) {
      filtrada = filtrada.filter((p) => normalizar(`${p.name} ${nomeDaMarca(p)} ${p.ref ?? ""}`).includes(busca));
    }
    if (ordem === "menor") return [...filtrada].sort((a, b) => a.price - b.price);
    if (ordem === "maior") return [...filtrada].sort((a, b) => b.price - a.price);
    if (ordem === "az") return [...filtrada].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return filtrada;
  }, [marca, ordem, busca]);


  const porPagina = desktop ? POR_PAGINA_DESKTOP : POR_PAGINA_CELULAR;
  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const atual = Math.min(pagina, totalPaginas);

  const inicio = (atual - 1) * porPagina;
  const itensDaPagina = lista.slice(inicio, inicio + porPagina);
  const fileirasDesktop: Product[][] = [];
  for (let i = 0, f = 0; i < itensDaPagina.length; f++) {
    const tamanho = FILEIRAS_DESKTOP[f % FILEIRAS_DESKTOP.length];
    fileirasDesktop.push(itensDaPagina.slice(i, i + tamanho));
    i += tamanho;
  }
  const mostrados = itensDaPagina.length;

  function irPara(n: number) {
    setPagina(n);
    document.getElementById("sob-encomenda")?.scrollIntoView({ behavior: "smooth" });
  }

  function escolherMarca(slug: string | null) {
    setMarca((atualMarca) => (atualMarca === slug ? null : slug));
    setPagina(1);
  }

  const Titulo = titulo;
  const marcaAtiva = marcas.find((m) => m.slug === marca);

  return (
    <>
      <BrandLogoCarousel
        activeBrand={marca}
        onSelectBrand={(slug) => escolherMarca(slug)}
        scrollToId="sob-encomenda"
        brandSlugs={marcas.map((m) => m.slug)}
      />

      <section id="sob-encomenda" className="scroll-mt-24 border-b border-white/10 bg-arkano-black px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest2 text-arkano-gold">Catálogo</p>
          <Titulo className="mt-2 text-3xl font-light text-arkano-champagne sm:text-4xl">Sob encomenda</Titulo>
          <p className="mt-3 max-w-2xl text-sm text-arkano-champagne/60 sm:text-base">
            Escolha o modelo e a gente encomenda pra você. Relógio original, com garantia e envio pra
            todo o Brasil.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <select
              aria-label="Filtrar por marca"
              value={marca ?? "todas"}
              onChange={(e) => {
                setMarca(e.target.value === "todas" ? null : e.target.value);
                setPagina(1);
              }}
              className={selectClass}
            >
              <option value="todas">Todas as marcas</option>
              {[...marcas]
                .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                .map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.nome}
                  </option>
                ))}
            </select>

            <select
              aria-label="Ordenar"
              value={ordem}
              onChange={(e) => {
                setOrdem(e.target.value as Ordem);
                setPagina(1);
              }}
              className={selectClass}
            >
              {ORDENS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {marcaAtiva && (
              <button
                type="button"
                onClick={() => escolherMarca(null)}
                className="inline-flex items-center gap-2 rounded-full border border-arkano-gold/50 px-4 py-2 text-xs text-arkano-gold transition hover:bg-arkano-gold/10"
              >
                Só {marcaAtiva.nome}
                <X size={14} />
              </button>
            )}

            {busca && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPagina(1);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-arkano-gold/50 px-4 py-2 text-xs text-arkano-gold transition hover:bg-arkano-gold/10"
              >
                Buscando &quot;{search.trim()}&quot;
                <X size={14} />
              </button>
            )}

            <span className="text-xs text-arkano-champagne/50 sm:ml-auto">
              {lista.length
                ? `Mostrando ${mostrados} de ${lista.length} relógios`
                : "Nenhum relógio encontrado com esses filtros."}
            </span>
          </div>

          {desktop ? (
            <div className="mt-8 flex flex-col gap-6">
              {fileirasDesktop.map((fileira, i) => (
                <div
                  key={i}
                  className={`grid gap-6 ${
                    FILEIRAS_DESKTOP[i % FILEIRAS_DESKTOP.length] === 5 ? "grid-cols-5" : "grid-cols-4"
                  }`}
                >
                  {fileira.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6">
              {itensDaPagina.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPaginas > 1 && (
            <nav aria-label="Páginas" className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={atual === 1}
                onClick={() => irPara(atual - 1)}
                className={QUADRADO_SETA}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === atual ? "page" : undefined}
                  onClick={() => irPara(n)}
                  className={n === atual ? QUADRADO_ATUAL : QUADRADO}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                aria-label="Próxima página"
                disabled={atual === totalPaginas}
                onClick={() => irPara(atual + 1)}
                className={QUADRADO_SETA}
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
