/**
 * Lógica PURA de catálogo (filtro/ordenação/busca).
 * Sem dependência de React ou de data source — usada tanto pelo
 * `services/products.ts` quanto pela UI de catálogo no client.
 */
import type {
  Availability,
  Product,
  ProductFilters,
  SortOption,
} from "@/types";

export function availabilityOf(p: Product): Availability {
  if (p.stock <= 0) return "out_of_stock";
  if (p.stock <= 5) return "low_stock";
  return "in_stock";
}

export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function matchesText(p: Product, term: string): boolean {
  const t = term.trim().toLowerCase();
  if (!t) return true;
  return [
    p.name,
    p.category,
    p.material ?? "",
    p.environment ?? "",
    ...(p.colors ?? []),
    p.description,
  ]
    .join(" ")
    .toLowerCase()
    .includes(t);
}

export function filterProducts(
  list: Product[],
  filters: ProductFilters,
): Product[] {
  return list.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.environment && p.environment !== filters.environment) return false;
    if (filters.minPrice != null && effectivePrice(p) < filters.minPrice)
      return false;
    if (filters.maxPrice != null && effectivePrice(p) > filters.maxPrice)
      return false;
    if (filters.onSaleOnly && p.salePrice == null) return false;
    if (
      filters.colors?.length &&
      !filters.colors.some((c) => p.colors?.includes(c))
    )
      return false;
    if (
      filters.materials?.length &&
      !filters.materials.some((m) =>
        (p.material ?? "").toLowerCase().includes(m.toLowerCase()),
      )
    )
      return false;
    if (
      filters.styles?.length &&
      (!p.style || !filters.styles.includes(p.style))
    )
      return false;
    if (
      filters.availability?.length &&
      !filters.availability.includes(availabilityOf(p))
    )
      return false;
    if (filters.search && !matchesText(p, filters.search)) return false;
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price_desc":
      return copy.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "best_sellers":
      return copy.sort(
        (a, b) =>
          Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false) ||
          (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0),
      );
    case "newest":
      return copy.sort((a, b) => Number(b.new ?? false) - Number(a.new ?? false));
    case "relevance":
    default:
      return copy.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          (b.rating ?? 0) - (a.rating ?? 0),
      );
  }
}

export function filterAndSort(
  list: Product[],
  filters: ProductFilters,
  sort: SortOption,
): Product[] {
  return sortProducts(filterProducts(list, filters), sort);
}
