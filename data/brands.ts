export type Brand = {
  slug: string;
  name: string;
  logo: string;
  /** true = logo é arquivo de imagem; false = sem logo disponível, usar wordmark em texto */
  hasLogo: boolean;
};

export const brands: Brand[] = [
  { slug: "seiko", name: "Seiko", logo: "/img/marcas/seiko.svg", hasLogo: true },
  { slug: "citizen", name: "Citizen", logo: "/img/marcas/citizen.svg", hasLogo: true },
  { slug: "tag-heuer", name: "TAG Heuer", logo: "/img/marcas/tag-heuer.png", hasLogo: true },
  { slug: "tudor", name: "Tudor", logo: "/img/marcas/tudor.svg", hasLogo: true },
  { slug: "longines", name: "Longines", logo: "/img/marcas/longines.svg", hasLogo: true },
  { slug: "mido", name: "Mido", logo: "/img/marcas/mido.svg", hasLogo: true },
  { slug: "baltic", name: "Baltic", logo: "/img/marcas/baltic.svg", hasLogo: true },
  { slug: "venezianico", name: "Venezianico", logo: "/img/marcas/venezianico.png", hasLogo: true },
];
