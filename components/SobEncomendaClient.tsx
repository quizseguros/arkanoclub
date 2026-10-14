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
// - celular: um slider de 6 relógios, depois uma fileira de 2 só com os mais
//   comprados, e repete; 24 por página = 3 desses blocos
const FILEIRAS_DESKTOP = [5, 4];
const POR_PAGINA_DESKTOP = 27;
const NO_SLIDER = 6;
const NA_DUPLA = 2;
const BLOCOS_POR_PAGINA_CELULAR = 3;
const POR_PAGINA_CELULAR = BLOCOS_POR_PAGINA_CELULAR * (NO_SLIDER + NA_DUPLA);

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

  // celular: as fileiras de 2 levam os mais comprados da lista atual; os
  // sliders, o resto na ordem escolhida
  const blocosCelular = useMemo(() => {
    const totalBlocos = Math.ceil(lista.length / (NO_SLIDER + NA_DUPLA));
    const maisComprados = [...lista]
      .sort((a, b) => (b.pedidos ?? 0) - (a.pedidos ?? 0))
      .slice(0, totalBlocos * NA_DUPLA);
    const separados = new Set(maisComprados.map((p) => p.id));
    const resto = lista.filter((p) => !separados.has(p.id));
    return Array.from({ length: totalBlocos }, (_, i) => ({
      slider: resto.slice(i * NO_SLIDER, (i + 1) * NO_SLIDER),
      dupla: maisComprados.slice(i * NA_DUPLA, (i + 1) * NA_DUPLA),
    })).filter((b) => b.slider.length || b.dupla.length);
  }, [lista]);

  const totalPaginas = desktop
    ? Math.max(1, Math.ceil(lista.length / POR_PAGINA_DESKTOP))
    : Math.max(1, Math.ceil(blocosCelular.length / BLOCOS_POR_PAGINA_CELULAR));
  const atual = Math.min(pagina, totalPaginas);

  const inicio = (atual - 1) * POR_PAGINA_DESKTOP;
  const itensDesktop = lista.slice(inicio, inicio + POR_PAGINA_DESKTOP);
  const fileirasDesktop: Product[][] = [];
  for (let i = 0, f = 0; i < itensDesktop.length; f++) {
    const tamanho = FILEIRAS_DESKTOP[f % FILEIRAS_DESKTOP.length];
    fileirasDesktop.push(itensDesktop.slice(i, i + tamanho));
    i += tamanho;
  }
  const blocosDaPagina = blocosCelular.slice(
    (atual - 1) * BLOCOS_POR_PAGINA_CELULAR,
    atual * BLOCOS_POR_PAGINA_CELULAR
  );
  const mostrados = desktop
    ? itensDesktop.length
    : blocosDaPagina.reduce((n, b) => n + b.slider.length + b.dupla.length, 0);

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
            <div className="mt-8 flex flex-col gap-6">
              {blocosDaPagina.map((bloco, i) => (
                <div key={i} className="flex flex-col gap-6">
                  {bloco.slider.length > 0 && (
                    <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6">
                      {bloco.slider.map((product) => (
                        // [&>div]:h-full: todos os cards do slider na mesma altura
                        <div key={product.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] [&>div]:h-full">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  )}
                  {bloco.dupla.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {bloco.dupla.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-arkano-champagne/70 transition hover:border-arkano-gold/50 hover:text-arkano-gold disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === atual ? "page" : undefined}
                  onClick={() => irPara(n)}
                  className={`h-9 min-w-9 rounded-full px-3 text-sm transition ${
                    n === atual
                      ? "bg-arkano-gold font-medium text-arkano-black"
                      : "border border-white/10 text-arkano-champagne/70 hover:border-arkano-gold/50 hover:text-arkano-gold"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                aria-label="Próxima página"
                disabled={atual === totalPaginas}
                onClick={() => irPara(atual + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-arkano-champagne/70 transition hover:border-arkano-gold/50 hover:text-arkano-gold disabled:opacity-30"
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
