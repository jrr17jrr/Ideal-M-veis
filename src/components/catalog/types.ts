import type {
  Availability,
  CategorySlug,
  FurnitureStyle,
  RoomSlug,
  SortOption,
} from "@/types";

export interface CatalogFilterState {
  sort: SortOption;
  categories: CategorySlug[];
  rooms: RoomSlug[];
  colors: string[];
  materials: string[];
  styles: FurnitureStyle[];
  availability: Availability[];
  priceMin?: number;
  priceMax?: number;
  onSaleOnly: boolean;
  search: string;
}

export const EMPTY_CATALOG_STATE: CatalogFilterState = {
  sort: "relevance",
  categories: [],
  rooms: [],
  colors: [],
  materials: [],
  styles: [],
  availability: [],
  priceMin: undefined,
  priceMax: undefined,
  onSaleOnly: false,
  search: "",
};

export function countActiveFilters(s: CatalogFilterState): number {
  return (
    s.categories.length +
    s.rooms.length +
    s.colors.length +
    s.materials.length +
    s.styles.length +
    s.availability.length +
    (s.onSaleOnly ? 1 : 0) +
    (s.priceMin != null || s.priceMax != null ? 1 : 0)
  );
}
