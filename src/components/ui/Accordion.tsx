"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "./icons";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-stone-200 border-y border-stone-200">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${baseId}-panel-${i}`}
                id={`${baseId}-header-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-stone-900"
              >
                {item.title}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={`${baseId}-panel-${i}`}
              role="region"
              aria-labelledby={`${baseId}-header-${i}`}
              hidden={!expanded}
              className="pb-5 text-sm leading-relaxed text-stone-600"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
