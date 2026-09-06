"use client";

import { cn } from "@/lib/cn";
import { MinusIcon, PlusIcon } from "./icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn =
    "flex items-center justify-center text-stone-600 transition-colors hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-600";
  const dims = size === "sm" ? "h-8 w-8" : "h-11 w-11";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-stone-300",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Diminuir quantidade"
        className={cn(btn, dims)}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className={cn(
          "min-w-8 text-center text-sm font-medium tabular-nums",
          size === "sm" && "min-w-6",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        className={cn(btn, dims)}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
