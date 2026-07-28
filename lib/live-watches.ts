import { Category, Movement, Product } from "@/data/products";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://admin-vert-sigma-49.vercel.app";

/** prefixo que separa os relógios do admin dos do catálogo estático */
export const LIVE_ID_PREFIX = "admin-";

type LiveWatch = {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categoryName?: string;
  price: number;
  diameter: string;
  movement: string;
  watchType?: string;
  image: string;
  images: string[];
  description: string;
  history?: string;
  buyLink: string | null;
};

function parseDiameter(raw: string): number {
  // aceita "40", "40mm", "38,5mm" e "38.5 mm"
  const match = raw.match(/(\d+([.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : 0;
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
  const images = (w.images ?? []).filter(Boolean);

  return {
    id: `${LIVE_ID_PREFIX}${w.id}`,
    name: w.name,
    brand: w.brandSlug,
    brandName: w.brand,
    category: normalizeCategory(w.category),
    price: w.price,
    caseDiameter: parseDiameter(w.diameter),
    movement: normalizeMovement(w.movement),
    watchType: w.watchType?.trim() || undefined,
    stock: "em-estoque",
    image: w.image,
    images: images.length > 0 ? images : w.image ? [w.image] : [],
    description: w.description,
    history: w.history?.trim() || undefined,
    buyLink: w.buyLink ?? undefined,
    live: true,
  };
}

/** Busca os relógios que o Guilherme cadastrou como disponíveis no admin.
 *  Se o admin estiver fora do ar por qualquer motivo, retorna lista vazia em
 *  vez de quebrar a página. */
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

/** Busca um relógio do admin pelo id dele (sem prefixo). Roda no servidor, na
 *  hora do acesso — por isso a página de um relógio de pronta entrega sempre
 *  reflete o que está cadastrado agora. */
export async function fetchLiveWatch(id: string): Promise<Product | null> {
  const all = await fetchLiveWatches();
  return all.find((p) => p.id === `${LIVE_ID_PREFIX}${id}`) ?? null;
}

/** Endereço da página de detalhes de um relógio (catálogo ou pronta entrega). */
export function detailHref(product: Product): string {
  return product.live
    ? `/pronta-entrega/${product.id.slice(LIVE_ID_PREFIX.length)}`
    : `/relogio/${product.id}`;
}
