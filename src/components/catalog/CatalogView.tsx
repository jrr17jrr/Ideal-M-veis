"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CategorySlug, Product } from "@/types";
import { filterAndSort } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SlidersIcon, CloseIcon, SearchIcon, ChevronDown } from "@/components/ui/icons";
import { FilterPanel } from "./FilterPanel";
import { SORT_OPTIONS, STYLE_OPTIONS, ROOM_OPTIONS } from "./filterConfig";
import {
  countActiveFilters,
  EMPTY_CATALOG_STATE,
  type CatalogFilterState,
} from "./types";
import { catalogStateToQuery } from "./catalogParams";

const PAGE_SIZE = 12;

interface Props {
  products: Product[];
  facets: { colors: string[]; materials: string[] };
  initialState: CatalogFilterState;
  /** Trava a categoria (páginas /categoria/[slug]) */
  lockedCategory?: CategorySlug;
  showSearch?: boolean;
  syncUrl?: boolean;
}

const catName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;
const roomName = (slug: string) =>
  ROOM_OPTIONS.find((r) => r.value === slug)?.label ?? slug;

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
      lockedCategory ? { ...state, categories: [lockedCategory] } : state,
    [state, lockedCategory],
  );

  const results = useMemo(
    () =>
      filterAndSort(
        products,
        {
          categories: effectiveState.categories,
          rooms: effectiveState.rooms,
          minPrice: effectiveState.priceMin,
          maxPrice: effectiveState.priceMax,
          colors: effectiveState.colors,
          materials: effectiveState.materials,
          styles: effectiveState.styles,
          availability: effectiveState.availability,
          onSaleOnly: effectiveState.onSaleOnly,
          search: effectiveState.search,
        },
        effectiveState.sort,
      ),
    [products, effectiveState],
  );

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
  const clearAll = () =>
    setState({ ...EMPTY_CATALOG_STATE, sort: state.sort });

  const activeCount = countActiveFilters(effectiveState);
  const shown = results.slice(0, visible);

  return (
    <div className="grid gap-8 lg:grid-cols-[264px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-32 rounded-2xl border border-stone-200 bg-white px-5 pb-2 pt-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-lg text-stone-900">Filtros</h2>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-medium text-brand underline-offset-2 hover:underline"
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
          <div className="mb-4 flex items-center gap-2 rounded-full border border-stone-300 px-4 focus-within:border-brand">
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

        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            <span className="font-medium text-stone-900">{results.length}</span>{" "}
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
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] text-white">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                aria-label="Ordenar por"
                value={state.sort}
                onChange={(e) =>
                  update({ sort: e.target.value as CatalogFilterState["sort"] })
                }
                className="h-10 appearance-none rounded-full border border-stone-300 bg-white pl-4 pr-9 text-sm text-stone-800 outline-none focus:border-brand"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <ActiveChips
              state={effectiveState}
              onChange={update}
              lockedCategory={!!lockedCategory}
            />
            <button
              onClick={clearAll}
              className="text-xs font-medium text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline"
            >
              limpar tudo
            </button>
          </div>
        )}

        {results.length === 0 ? (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Ajuste os filtros ou limpe a busca para ver mais opções."
            action={
              <Button variant="outline" onClick={clearAll}>
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
                <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Filtros"
        widthClass="w-[88%] max-w-sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={clearAll}>
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
        label: catName(c),
        clear: () => onChange({ categories: state.categories.filter((x) => x !== c) }),
      }),
    );

  state.rooms.forEach((r) =>
    chips.push({
      label: roomName(r),
      clear: () => onChange({ rooms: state.rooms.filter((x) => x !== r) }),
    }),
  );
  state.styles.forEach((st) =>
    chips.push({
      label: STYLE_OPTIONS.find((o) => o.value === st)?.label ?? st,
      clear: () => onChange({ styles: state.styles.filter((x) => x !== st) }),
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
  state.availability.forEach((a) =>
    chips.push({
      label:
        a === "in_stock"
          ? "Pronta entrega"
          : a === "low_stock"
            ? "Últimas unidades"
            : "Esgotado",
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
            "inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-dark",
            "transition-colors hover:bg-brand/20",
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
