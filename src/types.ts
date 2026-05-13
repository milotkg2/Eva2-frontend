export type Indicador = {
  id: number;
  categoria: string;
  nombre: string;
  valor: number;
  meta: number;
  actualizado: string;
};

/** Datos locales solo para capturas si no hay API configurada en el build */
export const DEMO_INDICADORES: Indicador[] = [
  {
    id: 1,
    categoria: "Infra EP1",
    nombre: "Capas desplegadas (demo local)",
    valor: 3,
    meta: 3,
    actualizado: "2026-05-13",
  },
  {
    id: 2,
    categoria: "Marca Lumina",
    nombre: "Órdenes canal digital (demo local)",
    valor: 189,
    meta: 220,
    actualizado: "2026-05-13",
  },
  {
    id: 3,
    categoria: "Marca Lumina",
    nombre: "Ingreso neto canal digital (CLP) — demo local",
    valor: 8_420_000,
    meta: 9_500_000,
    actualizado: "2026-05-13",
  },
];
