import type { Availability, FurnitureStyle, SortOption } from "@/types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "best_sellers", label: "Mais vendidos" },
  { value: "newest", label: "Lançamentos" },
];

export const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
  { value: "in_stock", label: "Pronta entrega" },
  { value: "low_stock", label: "Últimas unidades" },
  { value: "out_of_stock", label: "Esgotado" },
];

export const ENVIRONMENT_OPTIONS: { value: string; label: string }[] = [
  { value: "sala", label: "Sala" },
  { value: "quarto", label: "Quarto" },
  { value: "cozinha", label: "Cozinha e Jantar" },
  { value: "escritorio", label: "Escritório" },
  { value: "home-office", label: "Home office" },
  { value: "varanda", label: "Área externa" },
];

export const STYLE_OPTIONS: { value: FurnitureStyle; label: string }[] = [
  { value: "moderno", label: "Moderno" },
  { value: "minimalista", label: "Minimalista" },
  { value: "classico", label: "Clássico" },
  { value: "industrial", label: "Industrial" },
  { value: "contemporaneo", label: "Contemporâneo" },
  { value: "rustico", label: "Rústico" },
];

export const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: "Até R$ 1.000", max: 1000 },
  { label: "R$ 1.000 a R$ 2.500", min: 1000, max: 2500 },
  { label: "R$ 2.500 a R$ 4.000", min: 2500, max: 4000 },
  { label: "Acima de R$ 4.000", min: 4000 },
];
