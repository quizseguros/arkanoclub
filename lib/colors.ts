export const COLOR_HEX: Record<string, string> = {
  preto: "#1a1a1a",
  branco: "#f5f5f0",
  prata: "#c7c9cc",
  prateado: "#c7c9cc",
  cinza: "#8a8d91",
  dourado: "#c9a24b",
  ouro: "#c9a24b",
  champagne: "#d9c9a3",
  azul: "#1f3a63",
  "azul-claro": "#5b84b1",
  "azul-gelo": "#a9c4d9",
  marinho: "#14213d",
  verde: "#2f5233",
  "verde-oliva": "#5c5c3d",
  vermelho: "#7a2020",
  bordo: "#5e1f2e",
  borgonha: "#5e1f2e",
  marrom: "#5a3a24",
  bege: "#d8c7a8",
  rosa: "#c98fa0",
  salmao: "#e0917a",
  roxo: "#5b3a6e",
  violeta: "#6a4c8c",
  amarelo: "#d8b13a",
  laranja: "#c96a2e",
  turquesa: "#2f8a8a",
  madreperola: "#e4dfd6",
  antracite: "#3a3a3d",
  titanio: "#8f8f8a",
  esqueleto: "#4a4a4a",
};

export function colorToHex(name: string): string {
  const key = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
  return COLOR_HEX[key] ?? "#8a8d91";
}
