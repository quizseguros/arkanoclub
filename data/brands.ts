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
  { slug: "christopher-ward", name: "Christopher Ward", logo: "", hasLogo: false },
  { slug: "hamilton", name: "Hamilton", logo: "/img/marcas/hamilton.svg", hasLogo: true },
  { slug: "bulova", name: "Bulova", logo: "/img/marcas/bulova.svg", hasLogo: true },
  { slug: "oris", name: "Oris", logo: "/img/marcas/oris.svg", hasLogo: true },
  { slug: "certina", name: "Certina", logo: "/img/marcas/certina.svg", hasLogo: true },
  { slug: "frederique-constant", name: "Frederique Constant", logo: "/img/marcas/frederique-constant.svg", hasLogo: true },
  { slug: "orient", name: "Orient", logo: "", hasLogo: false },
  { slug: "omega", name: "Omega", logo: "/img/marcas/omega.svg", hasLogo: true },
  { slug: "breitling", name: "Breitling", logo: "/img/marcas/breitling.svg", hasLogo: true },
  { slug: "glycine", name: "Glycine", logo: "", hasLogo: false },
  { slug: "sinn", name: "Sinn", logo: "", hasLogo: false },
  { slug: "nomos", name: "Nomos", logo: "", hasLogo: false },
  { slug: "tissot", name: "Tissot", logo: "", hasLogo: false },
  { slug: "swatch", name: "Swatch", logo: "/img/marcas/swatch.svg", hasLogo: true },
  { slug: "invicta", name: "Invicta", logo: "", hasLogo: false },
  { slug: "rado", name: "Rado", logo: "", hasLogo: false },
  { slug: "maurice-lacroix", name: "Maurice Lacroix", logo: "", hasLogo: false },
  { slug: "victorinox", name: "Victorinox", logo: "", hasLogo: false },
  { slug: "doxa", name: "Doxa", logo: "", hasLogo: false },
  { slug: "bremont", name: "Bremont", logo: "", hasLogo: false },
  { slug: "baume-mercier", name: "Baume & Mercier", logo: "", hasLogo: false },
  { slug: "geckota", name: "Geckota", logo: "", hasLogo: false },
  { slug: "knis", name: "Knis", logo: "", hasLogo: false },
  { slug: "nubeo", name: "Nubeo", logo: "", hasLogo: false },
  { slug: "beaubleu", name: "Beaubleu", logo: "", hasLogo: false },
  { slug: "studio-underdog", name: "Studio Underd0g", logo: "", hasLogo: false },
  { slug: "hoffman", name: "Hoffman", logo: "", hasLogo: false },
];
