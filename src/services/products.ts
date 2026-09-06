/**
 * Serviço de produtos — ÚNICO ponto por onde o front acessa o catálogo.
 *
 * HOJE: lê de `src/data/products.ts` (mock em memória).
 * FUTURO: trocar o corpo destas funções por consultas ao Supabase
 *         (`from("products").select(...)`), mantendo as MESMAS assinaturas.
 *         Nenhum componente precisará mudar.
 *
 * As funções são `async` de propósito, já no formato que o Supabase exige.
 */
import {
  products as ALL_PRODUCTS,
  ALL_COLORS,
  ALL_MATERIALS,
} from "@/data/products";
import { filterAndSort, effectivePrice, matchesText } from "@/lib/catalog";
import type { Paginated, Product, ProductQuery } from "@/types";

const DEFAULT_PAGE_SIZE = 9;

export async function getProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  const {
    filters = {},
    sort = "relevance",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = query;

  const list = filterAndSort(ALL_PRODUCTS, filters, sort);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages };
}

/** Retorna todos os produtos (usado para hidratar a UI de catálogo no client). */
export async function getAllProducts(): Promise<Product[]> {
  return ALL_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return ALL_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  return ALL_PRODUCTS.map((p) => p.slug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return ALL_PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  return ALL_PRODUCTS.filter((p) => p.bestSeller).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return ALL_PRODUCTS.filter((p) => p.new).slice(0, limit);
}

export async function getTopRatedProducts(limit = 8): Promise<Product[]> {
  return [...ALL_PRODUCTS]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}

export async function getOnSaleProducts(limit = 8): Promise<Product[]> {
  const discount = (p: Product) => 1 - (p.salePrice ?? p.price) / p.price;
  return ALL_PRODUCTS.filter((p) => p.salePrice != null)
    .sort((a, b) => discount(b) - discount(a))
    .slice(0, limit);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, limit);
}

export async function getRecommendedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const sameCategory = new Set(
    ALL_PRODUCTS.filter((p) => p.category === product.category).map((p) => p.id),
  );
  return ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && !sameCategory.has(p.id) && p.featured,
  ).slice(0, limit);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const set = new Set(ids);
  return ALL_PRODUCTS.filter((p) => set.has(p.id));
}

export async function searchProducts(
  term: string,
  limit = 8,
): Promise<Product[]> {
  return ALL_PRODUCTS.filter((p) => matchesText(p, term)).slice(0, limit);
}

/** Faixas e opções para montar a UI de filtros. */
export async function getCatalogFacets(): Promise<{
  minPrice: number;
  maxPrice: number;
  colors: string[];
  materials: string[];
}> {
  const prices = ALL_PRODUCTS.map(effectivePrice);
  return {
    minPrice: Math.floor(Math.min(...prices) / 100) * 100,
    maxPrice: Math.ceil(Math.max(...prices) / 100) * 100,
    colors: ALL_COLORS,
    materials: ALL_MATERIALS,
  };
}
