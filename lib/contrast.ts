/**
 * Retorna a melhor cor de texto (branco ou tinta escura)
 * para garantir contraste sobre um fundo hexadecimal.
 */
export function contrastText(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#FFFFFF";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#0E1A2D" : "#FFFFFF";
}
