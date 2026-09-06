"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/Checkbox";
import { categories } from "@/data/categories";
import {
  AVAILABILITY_OPTIONS,
  ROOM_OPTIONS,
  PRICE_RANGES,
  STYLE_OPTIONS,
} from "./filterConfig";
import type { CatalogFilterState } from "./types";

function Group({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-medium text-stone-900"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 text-stone-400 transition-transform", open && "rotate-180")}
        />
      </button>
      <div hidden={!open} className="mt-3">
        {children}
      </div>
    </div>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function FilterPanel({
  state,
  onChange,
  facets,
  lockedCategory,
}: {
  state: CatalogFilterState;
  onChange: (next: Partial<CatalogFilterState>) => void;
  facets: { colors: string[]; materials: string[] };
  lockedCategory?: boolean;
}) {
  const activePriceIndex = PRICE_RANGES.findIndex(
    (r) => r.min === state.priceMin && r.max === state.priceMax,
  );

  return (
    <div>
      <Group title="Promoções">
        <Checkbox
          checked={state.onSaleOnly}
          onChange={(c) => onChange({ onSaleOnly: c })}
          label="Somente produtos em oferta"
        />
      </Group>

      {!lockedCategory && (
        <Group title="Categoria">
          {categories.map((c) => (
            <Checkbox
              key={c.slug}
              checked={state.categories.includes(c.slug)}
              onChange={() => onChange({ categories: toggle(state.categories, c.slug) })}
              label={c.name}
            />
          ))}
        </Group>
      )}

      <Group title="Faixa de preço">
        <div className="flex flex-col">
          {PRICE_RANGES.map((r, i) => (
            <Checkbox
              key={r.label}
              checked={activePriceIndex === i}
              onChange={(c) =>
                onChange(
                  c
                    ? { priceMin: r.min, priceMax: r.max }
                    : { priceMin: undefined, priceMax: undefined },
                )
              }
              label={r.label}
            />
          ))}
        </div>
      </Group>

      <Group title="Ambiente">
        {ROOM_OPTIONS.map((e) => (
          <Checkbox
            key={e.value}
            checked={state.rooms.includes(e.value)}
            onChange={() => onChange({ rooms: toggle(state.rooms, e.value) })}
            label={e.label}
          />
        ))}
      </Group>

      <Group title="Estilo">
        {STYLE_OPTIONS.map((s) => (
          <Checkbox
            key={s.value}
            checked={state.styles.includes(s.value)}
            onChange={() => onChange({ styles: toggle(state.styles, s.value) })}
            label={s.label}
          />
        ))}
      </Group>

      <Group title="Cor" defaultOpen={false}>
        <div className="max-h-56 overflow-y-auto pr-1">
          {facets.colors.map((color) => (
            <Checkbox
              key={color}
              checked={state.colors.includes(color)}
              onChange={() => onChange({ colors: toggle(state.colors, color) })}
              label={color}
            />
          ))}
        </div>
      </Group>

      <Group title="Material" defaultOpen={false}>
        <div className="max-h-56 overflow-y-auto pr-1">
          {facets.materials.map((mat) => (
            <Checkbox
              key={mat}
              checked={state.materials.includes(mat)}
              onChange={() => onChange({ materials: toggle(state.materials, mat) })}
              label={mat}
            />
          ))}
        </div>
      </Group>

      <Group title="Disponibilidade" defaultOpen={false}>
        {AVAILABILITY_OPTIONS.map((a) => (
          <Checkbox
            key={a.value}
            checked={state.availability.includes(a.value)}
            onChange={() => onChange({ availability: toggle(state.availability, a.value) })}
            label={a.label}
          />
        ))}
      </Group>
    </div>
  );
}
