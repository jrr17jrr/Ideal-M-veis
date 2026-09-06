"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/types";
import { formatCurrency } from "@/lib/format";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { TrashIcon } from "@/components/ui/icons";
import { useCart } from "@/context/CartContext";

export function CartLineItem({
  item,
  compact = false,
  onNavigate,
}: {
  item: CartItem;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { updateQuantity, removeItem } = useCart();
  const optionText = item.options
    ? Object.entries(item.options)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ")
    : null;

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/produto/${item.slug}`}
        onClick={onNavigate}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100 sm:h-24 sm:w-24"
      >
        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/produto/${item.slug}`}
            onClick={onNavigate}
            className="line-clamp-2 text-sm font-medium text-stone-900 hover:underline"
          >
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.productId, item.options)}
            aria-label={`Remover ${item.name}`}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {optionText && (
          <p className="mt-0.5 text-xs text-stone-500">{optionText}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onChange={(q) => updateQuantity(item.productId, q, item.options)}
          />
          <div className="text-right">
            {item.listPrice > item.unitPrice && !compact && (
              <p className="text-xs text-stone-400 line-through">
                {formatCurrency(item.listPrice * item.quantity)}
              </p>
            )}
            <p className="text-sm font-semibold text-stone-900">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
