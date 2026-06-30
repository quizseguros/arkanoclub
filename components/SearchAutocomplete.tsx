"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import { searchProducts } from "@/lib/product-search";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type Props = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export default function SearchAutocomplete({ variant, onNavigate }: Props) {
  const { search, setSearch } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = showSuggestions ? searchProducts(search) : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToCatalog() {
    setShowSuggestions(false);
    if (pathname === "/") {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#catalogo");
    }
    onNavigate?.();
  }

  function selectSuggestion(href: string) {
    setShowSuggestions(false);
    setSearch("");
    router.push(href);
    onNavigate?.();
  }

  const isMobile = variant === "mobile";

  return (
    <div ref={containerRef} className={`relative ${isMobile ? "w-full" : "w-44 xl:w-56"}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToCatalog();
        }}
        className={`flex items-center gap-2 rounded-full border border-white/10 bg-arkano-graphite transition focus-within:border-arkano-gold/50 ${
          isMobile ? "px-4 py-2.5" : "px-3 py-2"
        }`}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Buscar relógio"
          className={`w-full bg-transparent text-arkano-champagne placeholder:text-arkano-champagne/40 focus:outline-none ${
            isMobile ? "text-sm" : "text-xs"
          }`}
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="flex shrink-0 items-center justify-center text-arkano-gold transition hover:text-arkano-gold-light"
        >
          <Search size={isMobile ? 17 : 15} />
        </button>
      </form>

      {showSuggestions && search.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-arkano-graphite shadow-xl">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((item) => (
                <button
                  key={item.href}
                  onClick={() => selectSuggestion(item.href)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/5"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-black">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-arkano-champagne">{item.name}</p>
                    <p className="text-xs text-arkano-champagne/50">{item.brand}</p>
                  </div>
                  <span className="shrink-0 text-xs text-arkano-gold/80">{currency.format(item.price)}</span>
                </button>
              ))}
              <button
                onClick={goToCatalog}
                className="w-full border-t border-white/10 px-3 py-2.5 text-center text-xs text-arkano-champagne/60 transition hover:text-arkano-gold"
              >
                Ver todos os resultados pra &quot;{search}&quot;
              </button>
            </>
          ) : (
            <p className="px-3 py-3 text-center text-xs text-arkano-champagne/50">
              Nenhum relógio encontrado pra &quot;{search}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
