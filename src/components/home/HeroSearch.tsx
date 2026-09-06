"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { SearchIcon, ChevronDown, SlidersIcon } from "@/components/ui/icons";
import {
  EMPTY_HERO_FILTER,
  heroFilterToQuery,
  type HeroFilterValues,
  type HeroOption,
  HERO_CATEGORY_OPTIONS,
  HERO_ENVIRONMENT_OPTIONS,
  HERO_PRICE_OPTIONS,
  HERO_STYLE_OPTIONS,
  HERO_MATERIAL_OPTIONS,
  HERO_COLOR_OPTIONS,
  HERO_AVAILABILITY_OPTIONS,
} from "./heroFilterConfig";

function HeroSelect({
  label,
  icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: HeroOption[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-14 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50/60 pr-11 text-[15px] text-stone-900 transition-colors hover:border-stone-300 focus:border-brand focus:bg-white focus:outline-none",
            icon ? "pl-11" : "pl-4",
          )}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      </div>
    </label>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [values, setValues] = useState<HeroFilterValues>(EMPTY_HERO_FILTER);
  const [advanced, setAdvanced] = useState(false);

  function set<K extends keyof HeroFilterValues>(
    key: K,
    value: HeroFilterValues[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(heroFilterToQuery(values));
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(58,40,28,0.45)] sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-stone-900 sm:text-[26px]">
            Encontre o móvel ideal para você
          </h2>
          <p className="mt-1.5 text-sm text-stone-500">
            Busque por categoria, ambiente, estilo e muito mais.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdvanced((a) => !a)}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-stone-200 px-3.5 py-2 text-xs font-medium text-stone-600 transition-colors hover:border-brand hover:text-brand"
          aria-expanded={advanced}
        >
          <SlidersIcon className="h-3.5 w-3.5" />
          Busca avançada
        </button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:gap-5">
        <HeroSelect
          label="Categoria"
          value={values.categoria}
          options={HERO_CATEGORY_OPTIONS}
          onChange={(v) => set("categoria", v)}
        />
        <HeroSelect
          label="Ambiente"
          value={values.ambiente}
          options={HERO_ENVIRONMENT_OPTIONS}
          onChange={(v) => set("ambiente", v)}
        />
        <HeroSelect
          label="Faixa de preço"
          value={values.preco}
          options={HERO_PRICE_OPTIONS}
          onChange={(v) => set("preco", v)}
        />
        <HeroSelect
          label="Estilo"
          value={values.estilo}
          options={HERO_STYLE_OPTIONS}
          onChange={(v) => set("estilo", v)}
        />
        <button
          type="submit"
          className="flex h-14 items-center justify-center gap-2 self-end rounded-xl bg-brand px-8 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark sm:col-span-2 lg:col-span-1"
        >
          <SearchIcon className="h-4 w-4" />
          Buscar móveis
        </button>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-4 overflow-hidden transition-all sm:grid-cols-2 lg:grid-cols-4 lg:gap-5",
          advanced ? "mt-5 max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!advanced}
      >
        <HeroSelect
          label="Material"
          value={values.mat}
          options={HERO_MATERIAL_OPTIONS}
          onChange={(v) => set("mat", v)}
        />
        <HeroSelect
          label="Cor"
          value={values.cor}
          options={HERO_COLOR_OPTIONS}
          onChange={(v) => set("cor", v)}
        />
        <HeroSelect
          label="Disponibilidade"
          value={values.disp}
          options={HERO_AVAILABILITY_OPTIONS}
          onChange={(v) => set("disp", v)}
        />
        <label className="flex items-center gap-2.5 self-end pb-4 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={values.promo}
            onChange={(e) => set("promo", e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-brand focus:ring-brand"
          />
          Somente em promoção
        </label>
      </div>
    </form>
  );
}
