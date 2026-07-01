import { Movement, Product, Stock } from "@/data/products";

export type CategoryTab = "todos" | "masculino";

export type Filters = {
  search: string;
  category: CategoryTab;
  brands: Set<string>;
  stock: Set<Stock>;
  movement: Set<Movement>;
  priceMax: number;
  diameterMax: number;
  styleCategory: string; // "" = todos
};

export function defaultFilters(products: Product[]): Filters {
  return {
    search: "",
    category: "todos",
    brands: new Set(),
    stock: new Set(),
    movement: new Set(),
    priceMax: Math.max(...products.map((p) => p.price)),
    diameterMax: Math.max(...products.map((p) => p.caseDiameter)),
    styleCategory: "",
  };
}

export function applyFilters(products: Product[], filters: Filters): Product[] {
  const search = filters.search.trim().toLowerCase();

  return products.filter((p) => {
    if (search && !`${p.name} ${p.brand}`.toLowerCase().includes(search)) return false;
    if (filters.category !== "todos" && p.category !== filters.category) return false;
    if (filters.brands.size > 0 && !filters.brands.has(p.brand)) return false;
    if (filters.stock.size > 0 && !filters.stock.has(p.stock)) return false;
    if (filters.movement.size > 0 && !filters.movement.has(p.movement)) return false;
    if (p.price > filters.priceMax) return false;
    if (p.caseDiameter > filters.diameterMax) return false;
    if (filters.styleCategory && p.styleCategory !== filters.styleCategory) return false;
    return true;
  });
}
