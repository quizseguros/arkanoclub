"use client";

import { StyleCategory } from "@/data/products";

const CATEGORIES: { value: StyleCategory | "todos"; label: string; emoji: string }[] = [
  { value: "todos",      label: "Todos",        emoji: "⌚" },
  { value: "sport",      label: "Sport / Diver", emoji: "🤿" },
  { value: "dress",      label: "Dress Watch",  emoji: "🎩" },
  { value: "casual",     label: "Casual",       emoji: "☀️" },
  { value: "cronógrafo", label: "Cronógrafo",   emoji: "⏱" },
  { value: "vintage",    label: "Vintage",      emoji: "🕰" },
  { value: "gmt",        label: "GMT",          emoji: "🌍" },
];

type Props = {
  selected: string;
  onSelect: (cat: string) => void;
};

export default function CategoriesSection({ selected, onSelect }: Props) {
  return (
    <section className="border-b border-white/10 bg-arkano-black px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-sm uppercase tracking-widest2 text-arkano-gold/70">
          Explorar por estilo
        </h2>

        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const active = selected === cat.value || (cat.value === "todos" && !selected);
            return (
              <button
                key={cat.value}
                onClick={() => {
                  onSelect(cat.value === "todos" ? "" : cat.value);
                  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                  active
                    ? "border-arkano-gold bg-arkano-gold/10 text-arkano-gold"
                    : "border-white/10 text-arkano-champagne/60 hover:border-arkano-gold/40 hover:text-arkano-gold"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
