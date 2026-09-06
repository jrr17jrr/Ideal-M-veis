import type {
  Availability,
  CategorySlug,
  FurnitureStyle,
  SortOption,
} from "@/types";
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
const VALID_AVAILABILITY: Availability[] = [
  "in_stock",
  "low_stock",
  "out_of_stock",
];
const VALID_CATEGORIES: CategorySlug[] = [
  "sala",
  "quarto",
  "cozinha",
  "escritorio",
  "decoracao",
];

/* --------- Mapeamentos dos parâmetros "amigáveis" do filtro do hero -------- */

/** `categoria=` do hero → categoria real do catálogo OU termo de busca. */
const HERO_CATEGORY: Record<
  string,
  { category?: CategorySlug; search?: string }
> = {
  sofas: { search: "sofá" },
  mesas: { search: "mesa" },
  cadeiras: { search: "cadeira" },
  "racks-paineis": { search: "rack" },
  quartos: { category: "quarto" },
  escritorio: { category: "escritorio" },
  decoracao: { category: "decoracao" },
};

/** `ambiente=` do hero → slug de ambiente do produto. */
const HERO_ENVIRONMENT: Record<string, string> = {
  sala: "sala",
  quarto: "quarto",
  cozinha: "cozinha",
  escritorio: "escritorio",
  "area-externa": "varanda",
};

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

  /* Categorias: internas (`cat`) + amigável (`categoria`) */
  const categories = new Set<CategorySlug>(
    toArray(raw.cat).filter((c) =>
      VALID_CATEGORIES.includes(c as CategorySlug),
    ) as CategorySlug[],
  );
  let heroSearch = "";
  const categoriaRaw = first(raw.categoria);
  if (categoriaRaw && categoriaRaw !== "todas") {
    const mapped = HERO_CATEGORY[categoriaRaw];
    if (mapped?.category) categories.add(mapped.category);
    if (mapped?.search) heroSearch = mapped.search;
  }

  /* Ambientes: internos (`env`) + amigável (`ambiente`) */
  const environments = new Set<string>(toArray(raw.env));
  const ambienteRaw = first(raw.ambiente);
  if (ambienteRaw && HERO_ENVIRONMENT[ambienteRaw]) {
    environments.add(HERO_ENVIRONMENT[ambienteRaw]);
  }

  /* Preço: internos (`min`/`max`) + amigável (`preco`) */
  const heroPrice = parsePriceRange(first(raw.preco));
  const min = Number(first(raw.min));
  const max = Number(first(raw.max));
  const priceMin =
    heroPrice.min ?? (Number.isFinite(min) && min > 0 ? min : undefined);
  const priceMax =
    heroPrice.max ?? (Number.isFinite(max) && max > 0 ? max : undefined);

  /* Estilo: `estilo=` (mesmo nome interno e amigável) */
  const styles = toArray(raw.estilo).filter((s) =>
    VALID_STYLES.has(s as FurnitureStyle),
  ) as FurnitureStyle[];

  const search = (first(raw.q) ?? heroSearch ?? "").trim();

  return {
    ...EMPTY_CATALOG_STATE,
    sort,
    categories: [...categories],
    environments: [...environments],
    colors: toArray(raw.cor),
    materials: toArray(raw.mat),
    styles,
    availability: toArray(raw.disp).filter((v) =>
      VALID_AVAILABILITY.includes(v as Availability),
    ) as Availability[],
    priceMin,
    priceMax,
    onSaleOnly: raw.promo === "1" || raw.promo === "true",
    search,
  };
}

export function catalogStateToQuery(s: CatalogFilterState): string {
  const params = new URLSearchParams();
  if (s.sort !== "relevance") params.set("sort", s.sort);
  if (s.categories.length) params.set("cat", s.categories.join(","));
  if (s.environments.length) params.set("env", s.environments.join(","));
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
