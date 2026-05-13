import type { Indicador } from "../types";

export function pctAvance(row: Indicador): number {
  if (row.meta <= 0) return 0;
  return Math.min(100, Math.round((row.valor / row.meta) * 1000) / 10);
}

export function fmtValor(row: Indicador): string {
  if (row.nombre.includes("CLP") || row.valor > 10_000) {
    return new Intl.NumberFormat("es-CL", {
      maximumFractionDigits: 0,
    }).format(row.valor);
  }
  return new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 1,
  }).format(row.valor);
}

export function fmtMeta(row: Indicador): string {
  if (row.meta > 10_000) {
    return new Intl.NumberFormat("es-CL", {
      maximumFractionDigits: 0,
    }).format(row.meta);
  }
  return new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 1,
  }).format(row.meta);
}

export function promedioAvance(rows: Indicador[]): number {
  if (rows.length === 0) return 0;
  const sum = rows.reduce((acc, r) => acc + pctAvance(r), 0);
  return Math.round((sum / rows.length) * 10) / 10;
}
