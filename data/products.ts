// DADOS DE EXEMPLO: placeholder pra validar a estrutura do site.
// Guilherme substitui por catálogo real (fotos, preços, specs) antes de publicar.

export type Stock = "em-estoque" | "sob-encomenda";
export type Category = "masculino" | "unissex";
export type Movement = "automático" | "quartzo" | "manual";

export type Product = {
  id: string;
  name: string;
  brand: string; // slug, ver data/brands.ts
  category: Category;
  price: number;
  caseDiameter: number; // mm
  movement: Movement;
  stock: Stock;
  image: string;
  description: string;
  featured?: boolean;
  bestseller?: boolean;
};

export const products: Product[] = [
  {
    id: "seiko-presage-cocktail",
    name: "Seiko Presage Cocktail Time",
    brand: "seiko",
    category: "masculino",
    price: 3490,
    caseDiameter: 40,
    movement: "automático",
    stock: "em-estoque",
    image: "/img/produtos/seiko-presage-cocktail.webp",
    description: "Mostrador acetinado, caixa em aço inoxidável, movimento automático visível pelo fundo de vidro.",
    featured: true,
  },
  {
    id: "citizen-promaster-diver",
    name: "Citizen Promaster Diver",
    brand: "citizen",
    category: "masculino",
    price: 4290,
    caseDiameter: 44,
    movement: "quartzo",
    stock: "em-estoque",
    image: "/img/produtos/citizen-promaster-diver.webp",
    description: "Resistente a 200m, movimento Eco-Drive a energia solar, mostrador de alto contraste.",
    bestseller: true,
  },
  {
    id: "tag-heuer-carrera",
    name: "TAG Heuer Carrera",
    brand: "tag-heuer",
    category: "masculino",
    price: 18900,
    caseDiameter: 41,
    movement: "automático",
    stock: "sob-encomenda",
    image: "/img/produtos/tag-heuer-carrera.webp",
    description: "Cronógrafo icônico da TAG Heuer, caixa em aço polido e acabamento escovado.",
    featured: true,
  },
  {
    id: "tudor-black-bay-58",
    name: "Tudor Black Bay 58",
    brand: "tudor",
    category: "masculino",
    price: 24900,
    caseDiameter: 39,
    movement: "automático",
    stock: "sob-encomenda",
    image: "/img/produtos/tudor-black-bay-58.webp",
    description: "Reedição fiel ao design de 1958, movimento manufatura com 70h de autonomia.",
    featured: true,
  },
  {
    id: "longines-hydroconquest",
    name: "Longines HydroConquest",
    brand: "longines",
    category: "unissex",
    price: 9890,
    caseDiameter: 41,
    movement: "automático",
    stock: "em-estoque",
    image: "/img/produtos/longines-hydroconquest.jpeg",
    description: "Resistente a 300m, bezel cerâmico unidirecional, acabamento robusto e elegante.",
    bestseller: true,
  },
  {
    id: "mido-ocean-star",
    name: "Mido Ocean Star",
    brand: "mido",
    category: "masculino",
    price: 5290,
    caseDiameter: 36,
    movement: "automático",
    stock: "em-estoque",
    image: "/img/produtos/mido-ocean-star.webp",
    description: "Caixa compacta de 36mm, mostrador madrepérola e pulseira ajustável.",
    bestseller: true,
  },
  {
    id: "baltic-bicompax",
    name: "Baltic Bicompax 002",
    brand: "baltic",
    category: "masculino",
    price: 6490,
    caseDiameter: 38,
    movement: "manual",
    stock: "sob-encomenda",
    image: "/img/produtos/baltic-bicompax.jpeg",
    description: "Cronógrafo vintage de corda manual, caixa compacta e visor duplo contador.",
    bestseller: true,
  },
  {
    id: "venezianico-nereide",
    name: "Venezianico Nereide 3121",
    brand: "venezianico",
    category: "masculino",
    price: 7890,
    caseDiameter: 33,
    movement: "automático",
    stock: "em-estoque",
    image: "/img/produtos/venezianico-nereide.webp",
    description: "Caixa compacta inspirada no patrimônio veneziano, mostrador texturizado.",
    featured: true,
  },
  {
    id: "christopher-ward-c63-sealander-gmt",
    name: "Christopher Ward C63 Sealander GMT",
    brand: "christopher-ward",
    category: "masculino",
    price: 14499,
    caseDiameter: 36,
    movement: "automático",
    stock: "sob-encomenda",
    image: "/img/produtos/christopher-ward-c63-sealander-gmt.jpeg",
    description: "GMT suíço com mostrador azul-claro, pulseira de aço e função de segundo fuso horário.",
  },
];
