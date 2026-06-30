import { products } from "@/data/products";
import { productsSobEncomenda } from "@/data/products-sob-encomenda";
import { brands } from "@/data/brands";

export type SearchableProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  href: string;
};

const catalogIndex: SearchableProduct[] = products.map((p) => ({
  id: p.id,
  name: p.name,
  brand: brands.find((b) => b.slug === p.brand)?.name ?? p.brand,
  price: p.price,
  image: p.image,
  href: `/relogio/${p.id}`,
}));

const sobEncomendaIndex: SearchableProduct[] = productsSobEncomenda.map((p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.image,
  href: `/sob-encomenda/${p.id}`,
}));

export const searchIndex: SearchableProduct[] = [...catalogIndex, ...sobEncomendaIndex];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function searchProducts(query: string, limit = 6): SearchableProduct[] {
  const q = normalize(query.trim());
  if (!q) return [];

  const starts: SearchableProduct[] = [];
  const includes: SearchableProduct[] = [];

  for (const item of searchIndex) {
    const name = normalize(item.name);
    const brand = normalize(item.brand);
    if (name.startsWith(q) || brand.startsWith(q)) {
      starts.push(item);
    } else if (name.includes(q) || brand.includes(q)) {
      includes.push(item);
    }
  }

  return [...starts, ...includes].slice(0, limit);
}
