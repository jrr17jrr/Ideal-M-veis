import type { Availability, CategorySlug, SortOption } from "@/types";

export interface CatalogFilterState {
  sort: SortOption;
  categories: CategorySlug[];
  environments: string[];
  colors: string[];
  materials: string[];
  availability: Availability[];
  priceMin?: number;
  priceMax?: number;
  onSaleOnly: boolean;
  search: string;
}

export const EMPTY_CATALOG_STATE: CatalogFilterState = {
  sort: "relevance",
  categories: [],
  environments: [],
  colors: [],
  materials: [],
  availability: [],
  priceMin: undefined,
  priceMax: undefined,
  onSaleOnly: false,
  search: "",
};

export function countActiveFilters(s: CatalogFilterState): number {
  return (
    s.categories.length +
    s.environments.length +
    s.colors.length +
    s.materials.length +
    s.availability.length +
    (s.onSaleOnly ? 1 : 0) +
    (s.priceMin != null || s.priceMax != null ? 1 : 0)
  );
}
