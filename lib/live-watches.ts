import { Category, Movement, Product } from "@/data/products";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://admin-vert-sigma-49.vercel.app";

type LiveWatch = {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  price: number;
  diameter: string;
  movement: string;
  image: string;
  images: string[];
  description: string;
  buyLink: string | null;
};

function parseDiameter(raw: string): number {
  const match = raw.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function normalizeMovement(raw: string): Movement {
  const value = raw.trim().toLowerCase();
  if (value.startsWith("quart")) return "quartzo";
  if (value.startsWith("manual") || value.includes("corda manual")) return "manual";
  return "automático";
}

function normalizeCategory(raw: string): Category {
  return raw === "unissex" ? "unissex" : "masculino";
}

function mapLiveWatch(w: LiveWatch): Product {
  return {
    id: `admin-${w.id}`,
    name: w.name,
    brand: w.brandSlug,
    category: normalizeCategory(w.category),
    price: w.price,
    caseDiameter: parseDiameter(w.diameter),
    movement: normalizeMovement(w.movement),
    stock: "em-estoque",
    image: w.image,
    description: w.description,
    buyLink: w.buyLink ?? undefined,
    live: true,
  };
}

/** Busca os relógios que o Guilherme cadastrou como disponíveis no admin.
 *  Roda só no navegador (fetch client-side) — se o admin estiver fora do ar
 *  por qualquer motivo, retorna lista vazia em vez de quebrar a página. */
export async function fetchLiveWatches(): Promise<Product[]> {
  try {
    const res = await fetch(`${ADMIN_API_URL}/api/public/watches`, { cache: "no-store" });
    if (!res.ok) return [];
    const data: LiveWatch[] = await res.json();
    return data.map(mapLiveWatch);
  } catch {
    return [];
  }
}
