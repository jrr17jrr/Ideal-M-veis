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
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
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
            "h-[52px] w-full appearance-none rounded-xl border border-stone-200 bg-[#FCFAF7] pr-10 text-[14px] text-stone-900 outline-none transition hover:border-stone-300 focus:border-[#D98243] focus:bg-white",
            icon ? "pl-11" : "pl-4",
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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

  function set<K extends keyof HeroFilterValues>(key: K, value: HeroFilterValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(heroFilterToQuery(values));
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(58,40,28,0.48)] sm:p-6 lg:px-7 lg:py-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-[1.6rem] font-medium leading-tight text-stone-900 sm:text-[1.85rem]">
            Encontre o móvel ideal para você
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Busque por categoria, ambiente, estilo e muito mais.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdvanced((open) => !open)}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 transition hover:border-[#D98243] hover:text-[#B9652F] md:self-center"
          aria-expanded={advanced}
        >
          <SlidersIcon className="h-3.5 w-3.5" />
          Busca avançada
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_220px] lg:gap-4">
        <HeroSelect
          label="Categoria"
          value={values.categoria}
          options={HERO_CATEGORY_OPTIONS}
          onChange={(value) => set("categoria", value)}
        />
        <HeroSelect
          label="Ambiente"
          value={values.ambiente}
          options={HERO_ENVIRONMENT_OPTIONS}
          onChange={(value) => set("ambiente", value)}
        />
        <HeroSelect
          label="Faixa de preço"
          value={values.preco}
          options={HERO_PRICE_OPTIONS}
          onChange={(value) => set("preco", value)}
        />
        <HeroSelect
          label="Estilo"
          value={values.estilo}
          options={HERO_STYLE_OPTIONS}
          onChange={(value) => set("estilo", value)}
        />
        <button
          type="submit"
          className="flex h-[52px] items-center justify-center gap-2 self-end rounded-xl bg-[#D98243] px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#BF6E34] sm:col-span-2 lg:col-span-1"
        >
          <SearchIcon className="h-4 w-4" />
          Buscar móveis
        </button>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 gap-3 overflow-hidden transition-all duration-300 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4",
          advanced ? "mt-4 max-h-[28rem] opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!advanced}
      >
        <HeroSelect
          label="Material"
          value={values.mat}
          options={HERO_MATERIAL_OPTIONS}
          onChange={(value) => set("mat", value)}
        />
        <HeroSelect
          label="Cor"
          value={values.cor}
          options={HERO_COLOR_OPTIONS}
          onChange={(value) => set("cor", value)}
        />
        <HeroSelect
          label="Disponibilidade"
          value={values.disp}
          options={HERO_AVAILABILITY_OPTIONS}
          onChange={(value) => set("disp", value)}
        />
        <label className="flex items-center gap-2.5 self-end pb-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={values.promo}
            onChange={(e) => set("promo", e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-[#D98243] focus:ring-[#D98243]"
          />
          Somente em promoção
        </label>
      </div>
    </form>
  );
}
