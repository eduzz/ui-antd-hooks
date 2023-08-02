const formatter = new Intl.NumberFormat('pt-BR');

export function formatNumber(value: string | number) {
  return formatter.format(Number(value));
}
