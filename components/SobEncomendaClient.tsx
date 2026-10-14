"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { products } from "@/data/products";
import { useSearch } from "@/lib/search-context";
import ProductCard from "./ProductCard";

// 24 por página, igual ao catálogo da Memora: os 345 relógios dão as mesmas 15 páginas
const POR_PAGINA = 24;

const ORDENS = [
  { value: "pedidos", label: "Mais pedidos" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
  { value: "az", label: "Nome A-Z" },
] as const;
type Ordem = (typeof ORDENS)[number]["value"];

const nomeDaMarca = (p: (typeof products)[number]) => p.brandName ?? p.brand;

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const marcas = Array.from(new Set(products.map(nomeDaMarca))).sort((a, b) => a.localeCompare(b, "pt-BR"));

const selectClass =
  "rounded-full border border-white/10 bg-arkano-graphite px-4 py-2 text-sm text-arkano-champagne focus:border-arkano-gold focus:outline-none";

/** Grade paginada da aba Sob encomenda. "Mais pedidos" é a ordem em que os
 *  relógios já vêm do importador, então não precisa reordenar. */
export default function SobEncomendaClient({ titulo = "h1" }: { titulo?: "h1" | "h2" }) {
  const [marca, setMarca] = useState("todas");
  const [ordem, setOrdem] = useState<Ordem>("pedidos");
  const [pagina, setPagina] = useState(1);
  // texto digitado na busca do topo ("ver todos os resultados")
  const { search, setSearch } = useSearch();
  const busca = normalizar(search.trim());

  const lista = useMemo(() => {
    let filtrada = marca === "todas" ? products : products.filter((p) => nomeDaMarca(p) === marca);
    if (busca) {
      filtrada = filtrada.filter((p) =>
        normalizar(`${p.name} ${nomeDaMarca(p)} ${p.ref ?? ""}`).includes(busca)
      );
    }
    if (ordem === "menor") return [...filtrada].sort((a, b) => a.price - b.price);
    if (ordem === "maior") return [...filtrada].sort((a, b) => b.price - a.price);
    if (ordem === "az") return [...filtrada].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return filtrada;
  }, [marca, ordem, busca]);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const atual = Math.min(pagina, totalPaginas);
  const inicio = (atual - 1) * POR_PAGINA;
  const itens = lista.slice(inicio, inicio + POR_PAGINA);

  function irPara(n: number) {
    setPagina(n);
    document.getElementById("sob-encomenda")?.scrollIntoView({ behavior: "smooth" });
  }

  const Titulo = titulo;

  return (
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
            value={marca}
            onChange={(e) => {
              setMarca(e.target.value);
              setPagina(1);
            }}
            className={selectClass}
          >
            <option value="todas">Todas as marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
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
              ? `Mostrando ${inicio + 1}–${Math.min(inicio + POR_PAGINA, lista.length)} de ${lista.length} relógios`
              : "Nenhum relógio encontrado com esses filtros."}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {itens.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
  );
}
