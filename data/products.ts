export type Stock = "em-estoque" | "sob-encomenda";
export type Category = "masculino" | "unissex";
export type Movement = "automático" | "quartzo" | "manual";
export type StyleCategory = "casual" | "sport" | "dress" | "gmt" | "vintage" | "cronógrafo";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  caseDiameter: number;
  movement: Movement;
  stock: Stock;
  image: string;
  description: string;
  history?: string;
  styleCategory?: StyleCategory;
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
    description: "Mostrador acetinado inspirado na cultura de cocktails japonesa, caixa em aço inoxidável e movimento automático visível pelo fundo de vidro. Uma das entradas mais elegantes no universo dos automáticos.",
    history: "Lançado em 2014, o Presage é a linha premium de entrada da Seiko — cada mostrador é inspirado num drinque artesanal específico. O movimento automático 4R35 oferece 41 horas de reserva de marcha com rotor bidirecional.",
    styleCategory: "dress",
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
    description: "Resistente a 200m, certificação ISO 6425 para mergulho profissional e tecnologia Eco-Drive que converte luz em energia — sem bateria. Mostrador de alto contraste com leitura luminosa excepcional.",
    history: "A linha Promaster existe desde 1989 e é o braço profissional da Citizen. O Eco-Drive, tecnologia exclusiva da marca desde 1995, elimina a necessidade de troca de bateria ao usar qualquer fonte de luz como energia.",
    styleCategory: "sport",
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
    description: "Cronógrafo icônico em aço polido e escovado, mostrador limpo com sub-dials precisos. Um dos designs de cronógrafo mais reconhecidos da história, equilibrando esporte e elegância.",
    history: "Criado em 1963 por Jack Heuer, o Carrera homenageia a Carrera Panamericana — uma das corridas mais perigosas do século XX. A versão atual usa o Calibre Heuer 02, movimento manufatura com 80 horas de reserva de marcha.",
    styleCategory: "cronógrafo",
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
    description: "Reedição fiel ao design vintage de 1958, caixa de 39mm com coroa de mergulho oversized e movimento manufatura com 70 horas de reserva. O diver vintage mais procurado do mercado atual.",
    history: "Lançado em 2018, o Black Bay 58 revisita a referência 7923 da Tudor de 1958 — o primeiro relógio de mergulho da marca. O tamanho reduzido de 39mm o distingue do Black Bay principal e o torna ideal para pulsos menores.",
    styleCategory: "sport",
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
    description: "Resistente a 300m, bezel cerâmico unidirecional e acabamento que combina superfícies polidas e escovadas. Movimento automático com âncora em silício, resistente a campos magnéticos.",
    history: "A família HydroConquest existe desde os anos 1960 e é o diver mais bem-sucedido da Longines. O calibre L888 com componentes em silício garante maior precisão e dispensa lubrificação frequente.",
    styleCategory: "sport",
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
    description: "Diver compacto de 36mm com mostrador em madrepérola — raro em relógios sport dessa categoria. Pulseira ajustável de aço e 200m de resistência à água com visual que vai do mergulho ao escritório.",
    history: "Inspirado pelas formas orgânicas do oceano, o Ocean Star é a resposta da Mido ao mercado de divers compactos. O movimento automático Calibre 80 oferece 80 horas de reserva, acima da média da categoria.",
    styleCategory: "sport",
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
    description: "Cronógrafo bi-compax de corda manual com dois sub-dials simétricos, caixa de aço de 38mm e cristal sintético. Layout clássico dos anos 1940 com produção contemporânea e preço acessível.",
    history: "A Baltic é uma marca francesa independente fundada em 2017 em Paris com proposta vintage acessível. O Bicompax usa o movimento ETA 7753 de corda manual — o mesmo utilizado em cronógrafos clássicos das décadas anteriores.",
    styleCategory: "vintage",
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
    description: "Caixa compacta de 33mm inspirada no patrimônio veneziano, mostrador texturizado com profundidade visual única. Versátil o suficiente para ir do casual ao semiformal sem perder personalidade.",
    history: "A Venezianico nasceu em Veneza em 2017 com o objetivo de resgatar a tradição italiana na relojoaria. O nome Nereide vem das ninfas do mar da mitologia grega — referência ao laço histórico de Veneza com o Mediterrâneo.",
    styleCategory: "casual",
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
    description: "GMT suíço com mostrador azul-claro e ponteiro de segundo fuso horário independente. Pulseira de aço integrada, 150m de resistência à água e acabamento premium a preço direto da marca.",
    history: "A Christopher Ward foi fundada em 2004 no Reino Unido com o propósito de oferecer qualidade suíça sem o prêmio das grandes marcas. O calibre MHMC01, desenvolvido pela Synergies Horlogères, indica dois fusos horários simultaneamente com ponteiro GMT ajustável hora a hora.",
    styleCategory: "gmt",
  },
];
