import type {
  Availability,
  CategorySlug,
  FurnitureStyle,
  RoomSlug,
  SortOption,
} from "@/types";
import { categories } from "@/data/categories";
import { rooms } from "@/data/rooms";
import { SORT_OPTIONS, STYLE_OPTIONS } from "./filterConfig";
import { EMPTY_CATALOG_STATE, type CatalogFilterState } from "./types";

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").filter(Boolean);
}

const VALID_SORT = new Set(SORT_OPTIONS.map((o) => o.value));
const VALID_STYLES = new Set(STYLE_OPTIONS.map((o) => o.value));
const VALID_AVAILABILITY: Availability[] = ["in_stock", "low_stock", "out_of_stock"];
const VALID_CATEGORIES = new Set(categories.map((c) => c.slug));
const VALID_ROOMS = new Set(rooms.map((r) => r.slug));

/** `preco=` do hero (ex.: "1000-2000", "5000-") → faixa numérica. */
function parsePriceRange(value?: string): { min?: number; max?: number } {
  if (!value || value === "qualquer") return {};
  const [rawMin, rawMax] = value.split("-");
  const min = Number(rawMin);
  const max = Number(rawMax);
  return {
    min: Number.isFinite(min) && min > 0 ? min : undefined,
    max: Number.isFinite(max) && max > 0 ? max : undefined,
  };
}

export function parseCatalogParams(raw: RawParams): CatalogFilterState {
  const sortRaw = first(raw.sort);
  const sort: SortOption =
    sortRaw && VALID_SORT.has(sortRaw as SortOption)
      ? (sortRaw as SortOption)
      : "relevance";

  // categorias: `cat` (interno) + `categoria` (amigável, hero) — mesmos slugs
  const categoriesSet = new Set<CategorySlug>();
  for (const raw2 of [...toArray(raw.cat), ...toArray(raw.categoria)]) {
    if (raw2 !== "todas" && VALID_CATEGORIES.has(raw2 as CategorySlug)) {
      categoriesSet.add(raw2 as CategorySlug);
    }
  }

  // ambientes: `room` (interno) + `ambiente` (amigável)
  const roomsSet = new Set<RoomSlug>();
  for (const raw2 of [...toArray(raw.room), ...toArray(raw.ambiente)]) {
    if (raw2 !== "qualquer" && VALID_ROOMS.has(raw2 as RoomSlug)) {
      roomsSet.add(raw2 as RoomSlug);
    }
  }

  const heroPrice = parsePriceRange(first(raw.preco));
  const min = Number(first(raw.min));
  const max = Number(first(raw.max));
  const priceMin =
    heroPrice.min ?? (Number.isFinite(min) && min > 0 ? min : undefined);
  const priceMax =
    heroPrice.max ?? (Number.isFinite(max) && max > 0 ? max : undefined);

  const styles = toArray(raw.estilo).filter((s) =>
    VALID_STYLES.has(s as FurnitureStyle),
  ) as FurnitureStyle[];

  return {
    ...EMPTY_CATALOG_STATE,
    sort,
    categories: [...categoriesSet],
    rooms: [...roomsSet],
    colors: toArray(raw.cor),
    materials: toArray(raw.mat),
    styles,
    availability: toArray(raw.disp).filter((v) =>
      VALID_AVAILABILITY.includes(v as Availability),
    ) as Availability[],
    priceMin,
    priceMax,
    onSaleOnly: raw.promo === "1" || raw.promo === "true",
    search: (first(raw.q) ?? "").trim(),
  };
}

export function catalogStateToQuery(s: CatalogFilterState): string {
  const params = new URLSearchParams();
  if (s.sort !== "relevance") params.set("sort", s.sort);
  if (s.categories.length) params.set("cat", s.categories.join(","));
  if (s.rooms.length) params.set("room", s.rooms.join(","));
  if (s.colors.length) params.set("cor", s.colors.join(","));
  if (s.materials.length) params.set("mat", s.materials.join(","));
  if (s.styles.length) params.set("estilo", s.styles.join(","));
  if (s.availability.length) params.set("disp", s.availability.join(","));
  if (s.priceMin != null) params.set("min", String(s.priceMin));
  if (s.priceMax != null) params.set("max", String(s.priceMax));
  if (s.onSaleOnly) params.set("promo", "1");
  if (s.search.trim()) params.set("q", s.search.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
