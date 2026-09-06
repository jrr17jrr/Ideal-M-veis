import type { Availability, CategorySlug, SortOption } from "@/types";
import { SORT_OPTIONS } from "./filterConfig";
import { EMPTY_CATALOG_STATE, type CatalogFilterState } from "./types";

type RawParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : value.split(",").filter(Boolean);
}

const VALID_SORT = new Set(SORT_OPTIONS.map((o) => o.value));
const VALID_AVAILABILITY: Availability[] = ["in_stock", "low_stock", "out_of_stock"];

export function parseCatalogParams(raw: RawParams): CatalogFilterState {
  const sortRaw = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
  const sort: SortOption =
    sortRaw && VALID_SORT.has(sortRaw as SortOption)
      ? (sortRaw as SortOption)
      : "relevance";

  const min = Number(Array.isArray(raw.min) ? raw.min[0] : raw.min);
  const max = Number(Array.isArray(raw.max) ? raw.max[0] : raw.max);

  return {
    ...EMPTY_CATALOG_STATE,
    sort,
    categories: toArray(raw.cat) as CategorySlug[],
    environments: toArray(raw.env),
    colors: toArray(raw.cor),
    materials: toArray(raw.mat),
    availability: toArray(raw.disp).filter((v) =>
      VALID_AVAILABILITY.includes(v as Availability),
    ) as Availability[],
    priceMin: Number.isFinite(min) && min > 0 ? min : undefined,
    priceMax: Number.isFinite(max) && max > 0 ? max : undefined,
    onSaleOnly: raw.promo === "1" || raw.promo === "true",
    search: (Array.isArray(raw.q) ? raw.q[0] : raw.q) ?? "",
  };
}

export function catalogStateToQuery(s: CatalogFilterState): string {
  const params = new URLSearchParams();
  if (s.sort !== "relevance") params.set("sort", s.sort);
  if (s.categories.length) params.set("cat", s.categories.join(","));
  if (s.environments.length) params.set("env", s.environments.join(","));
  if (s.colors.length) params.set("cor", s.colors.join(","));
  if (s.materials.length) params.set("mat", s.materials.join(","));
  if (s.availability.length) params.set("disp", s.availability.join(","));
  if (s.priceMin != null) params.set("min", String(s.priceMin));
  if (s.priceMax != null) params.set("max", String(s.priceMax));
  if (s.onSaleOnly) params.set("promo", "1");
  if (s.search.trim()) params.set("q", s.search.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
