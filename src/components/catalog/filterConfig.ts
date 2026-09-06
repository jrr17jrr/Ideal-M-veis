import type {
  Availability,
  FurnitureStyle,
  RoomSlug,
  SortOption,
} from "@/types";

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

export const ROOM_OPTIONS: { value: RoomSlug; label: string }[] = [
  { value: "sala-de-estar", label: "Sala de estar" },
  { value: "sala-de-jantar", label: "Sala de jantar" },
  { value: "quarto", label: "Quarto" },
  { value: "escritorio", label: "Escritório" },
  { value: "area-externa", label: "Área externa" },
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
  { label: "Até R$ 500", max: 500 },
  { label: "R$ 500 a R$ 1.000", min: 500, max: 1000 },
  { label: "R$ 1.000 a R$ 2.000", min: 1000, max: 2000 },
  { label: "R$ 2.000 a R$ 5.000", min: 2000, max: 5000 },
  { label: "Acima de R$ 5.000", min: 5000 },
];
