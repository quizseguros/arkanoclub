/** Diâmetro no padrão brasileiro: 40 vira "40mm", 38.5 vira "38,5mm". */
export function formatDiameter(mm: number): string {
  return `${String(mm).replace(".", ",")}mm`;
}
