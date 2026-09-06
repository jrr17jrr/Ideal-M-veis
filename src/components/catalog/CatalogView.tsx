"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CategorySlug, Product } from "@/types";
import { filterAndSort } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SlidersIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
import { FilterPanel } from "./FilterPanel";
import { SORT_OPTIONS, STYLE_OPTIONS } from "./filterConfig";
import { countActiveFilters, EMPTY_CATALOG_STATE, type CatalogFilterState } from "./types";
import { catalogStateToQuery } from "./catalogParams";

const PAGE_SIZE = 9;

interface Props {
  products: Product[];
  facets: { colors: string[]; materials: string[] };
  initialState: CatalogFilterState;
  /** Trava a categoria (páginas /categoria/[slug]) */
  lockedCategory?: CategorySlug;
  /** Some com a barra de busca interna (ex.: página /busca já tem contexto) */
  showSearch?: boolean;
  syncUrl?: boolean;
}

export function CatalogView({
  products,
  facets,
  initialState,
  lockedCategory,
  showSearch = true,
  syncUrl = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<CatalogFilterState>(initialState);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstRun = useRef(true);

  const effectiveState = useMemo<CatalogFilterState>(
    () =>
      lockedCategory
        ? { ...state, categories: [lockedCategory] }
        : state,
    [state, lockedCategory],
  );

  const results = useMemo(
    () =>
      filterAndSort(
        products,
        {
          category: lockedCategory,
          minPrice: effectiveState.priceMin,
          maxPrice: effectiveState.priceMax,
          colors: effectiveState.colors,
          materials: effectiveState.materials,
          styles: effectiveState.styles,
          availability: effectiveState.availability,
          onSaleOnly: effectiveState.onSaleOnly,
          search: effectiveState.search,
          // categorias múltiplas: aplicadas fora do helper
        },
        effectiveState.sort,
      ).filter((p) =>
        lockedCategory || effectiveState.categories.length === 0
          ? true
          : effectiveState.categories.includes(p.category),
      ),
    [products, effectiveState, lockedCategory],
  );

  // Reseta a paginação e sincroniza a URL quando os filtros mudam.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setVisible(PAGE_SIZE);
    if (syncUrl) {
      router.replace(`${pathname}${catalogStateToQuery(state)}`, {
        scroll: false,
      });
    }
  }, [state, pathname, router, syncUrl]);

  function update(patch: Partial<CatalogFilterState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  const activeCount = countActiveFilters(effectiveState);
  const shown = results.slice(0, visible);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg text-stone-900">Filtros</h2>
            {activeCount > 0 && (
              <button
                onClick={() => setState({ ...EMPTY_CATALOG_STATE, sort: state.sort })}
                className="text-xs text-stone-500 underline-offset-2 hover:underline"
              >
                Limpar ({activeCount})
              </button>
            )}
          </div>
          <FilterPanel
            state={effectiveState}
            onChange={update}
            facets={facets}
            lockedCategory={!!lockedCategory}
          />
        </div>
      </aside>

      <div>
        {showSearch && (
          <div className="mb-4 flex items-center gap-2 rounded-full border border-stone-300 px-4 focus-within:border-stone-900">
            <SearchIcon className="h-4 w-4 text-stone-400" />
            <input
              value={state.search}
              onChange={(e) => update({ search: e.target.value })}
              placeholder="Buscar dentro do catálogo"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              aria-label="Buscar produtos"
            />
            {state.search && (
              <button onClick={() => update({ search: "" })} aria-label="Limpar busca">
                <CloseIcon className="h-4 w-4 text-stone-400" />
              </button>
            )}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            {results.length}{" "}
            {results.length === 1 ? "produto" : "produtos"}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800 lg:hidden"
            >
              <SlidersIcon className="h-4 w-4" />
              Filtros
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-[11px] text-white">
                  {activeCount}
                </span>
              )}
            </button>

            <Select
              aria-label="Ordenar por"
              value={state.sort}
              onChange={(e) =>
                update({ sort: e.target.value as CatalogFilterState["sort"] })
              }
              containerClassName="w-44"
              className="h-10 py-2 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Chips de filtros ativos */}
        {activeCount > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <ActiveChips state={effectiveState} onChange={update} lockedCategory={!!lockedCategory} />
          </div>
        )}

        {results.length === 0 ? (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Ajuste os filtros ou limpe a busca para ver mais opções."
            action={
              <Button
                variant="outline"
                onClick={() => setState({ ...EMPTY_CATALOG_STATE })}
              >
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid products={shown} priorityCount={4} />
            {visible < results.length && (
              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-xs text-stone-400">
                  Exibindo {shown.length} de {results.length}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                >
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawer mobile */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Filtros"
        widthClass="w-[88%] max-w-sm"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setState({ ...EMPTY_CATALOG_STATE, sort: state.sort })}
            >
              Limpar
            </Button>
            <Button fullWidth onClick={() => setDrawerOpen(false)}>
              Ver {results.length} produtos
            </Button>
          </div>
        }
      >
        <div className="px-5">
          <FilterPanel
            state={effectiveState}
            onChange={update}
            facets={facets}
            lockedCategory={!!lockedCategory}
          />
        </div>
      </Drawer>
    </div>
  );
}

function ActiveChips({
  state,
  onChange,
  lockedCategory,
}: {
  state: CatalogFilterState;
  onChange: (patch: Partial<CatalogFilterState>) => void;
  lockedCategory: boolean;
}) {
  const chips: { label: string; clear: () => void }[] = [];

  if (state.onSaleOnly)
    chips.push({ label: "Em oferta", clear: () => onChange({ onSaleOnly: false }) });

  if (state.priceMin != null || state.priceMax != null)
    chips.push({
      label: priceLabel(state.priceMin, state.priceMax),
      clear: () => onChange({ priceMin: undefined, priceMax: undefined }),
    });

  if (!lockedCategory)
    state.categories.forEach((c) =>
      chips.push({
        label: c,
        clear: () => onChange({ categories: state.categories.filter((x) => x !== c) }),
      }),
    );

  state.environments.forEach((e) =>
    chips.push({
      label: e,
      clear: () => onChange({ environments: state.environments.filter((x) => x !== e) }),
    }),
  );
  state.colors.forEach((c) =>
    chips.push({
      label: c,
      clear: () => onChange({ colors: state.colors.filter((x) => x !== c) }),
    }),
  );
  state.materials.forEach((m) =>
    chips.push({
      label: m,
      clear: () => onChange({ materials: state.materials.filter((x) => x !== m) }),
    }),
  );
  state.styles.forEach((st) =>
    chips.push({
      label: STYLE_OPTIONS.find((o) => o.value === st)?.label ?? st,
      clear: () => onChange({ styles: state.styles.filter((x) => x !== st) }),
    }),
  );
  state.availability.forEach((a) =>
    chips.push({
      label: a === "in_stock" ? "Pronta entrega" : a === "low_stock" ? "Últimas unidades" : "Esgotado",
      clear: () => onChange({ availability: state.availability.filter((x) => x !== a) }),
    }),
  );

  return (
    <>
      {chips.map((chip, i) => (
        <button
          key={`${chip.label}-${i}`}
          onClick={chip.clear}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700",
            "transition-colors hover:bg-stone-200",
          )}
        >
          {chip.label}
          <CloseIcon className="h-3 w-3" />
        </button>
      ))}
    </>
  );
}

function priceLabel(min?: number, max?: number): string {
  if (min != null && max != null) return `R$ ${min} – R$ ${max}`;
  if (max != null) return `Até R$ ${max}`;
  return `Acima de R$ ${min}`;
}
