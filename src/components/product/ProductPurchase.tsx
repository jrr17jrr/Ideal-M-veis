"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { cn } from "@/lib/cn";
import {
  discountPercent,
  formatCurrency,
  formatInstallment,
  pixPrice,
  PIX_DISCOUNT,
} from "@/lib/format";
import { availabilityOf } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { FavoriteButton } from "./FavoriteButton";
import { ShippingSimulator } from "./ShippingSimulator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { CheckIcon } from "@/components/ui/icons";

const AVAILABILITY_UI = {
  in_stock: { label: "Em estoque · pronta entrega", cls: "text-emerald-700" },
  low_stock: { label: "Últimas unidades", cls: "text-amber-700" },
  out_of_stock: { label: "Produto esgotado", cls: "text-red-600" },
} as const;

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const toast = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (product.variants ?? []).map((v) => [v.name, v.values[0]]),
    ),
  );

  const current = product.salePrice ?? product.price;
  const percent = discountPercent(product.price, product.salePrice);
  const availability = availabilityOf(product);
  const outOfStock = availability === "out_of_stock";
  const ui = AVAILABILITY_UI[availability];

  const options = useMemo(
    () => (product.variants?.length ? selected : undefined),
    [product.variants, selected],
  );

  function handleAdd(redirect: boolean) {
    if (outOfStock) return;
    addItem(product, quantity, options);
    if (redirect) {
      router.push("/checkout");
      return;
    }
    toast.success(`${product.name} adicionado à sacola`);
    openDrawer();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
          SKU {product.sku}
        </p>
        <h1 className="mt-1.5 text-2xl text-stone-900 sm:text-3xl">
          {product.name}
        </h1>
        {product.rating != null && (
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewsCount} />
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="border-y border-stone-200 py-4">
        <div className="flex flex-wrap items-baseline gap-3">
          {product.salePrice != null && (
            <span className="text-sm text-stone-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
          <span className="font-display text-3xl text-stone-900">
            {formatCurrency(current)}
          </span>
          {percent != null && <Badge tone="sale">-{percent}%</Badge>}
        </div>
        <p className="mt-1 text-sm text-stone-600">{formatInstallment(current)}</p>
        <p className="mt-1 text-sm font-medium text-emerald-700">
          {formatCurrency(pixPrice(current))} no Pix
          <span className="font-normal text-stone-500">
            {" "}
            ({Math.round(PIX_DISCOUNT * 100)}% de desconto)
          </span>
        </p>
      </div>

      {/* Estoque */}
      <p className={cn("flex items-center gap-1.5 text-sm font-medium", ui.cls)}>
        <CheckIcon className="h-4 w-4" />
        {ui.label}
      </p>

      {/* Variações */}
      {product.variants?.map((variant) => (
        <div key={variant.name}>
          <p className="mb-2 text-sm font-medium text-stone-900">
            {variant.name}:{" "}
            <span className="font-normal text-stone-500">
              {selected[variant.name]}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {variant.values.map((value) => {
              const active = selected[variant.name] === value;
              return (
                <button
                  key={value}
                  onClick={() =>
                    setSelected((s) => ({ ...s, [variant.name]: value }))
                  }
                  className={cn(
                    "min-w-11 rounded-full border px-4 py-2 text-sm transition-colors",
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 text-stone-700 hover:border-stone-900",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quantidade + ações */}
      <div className="flex items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} />
        <span className="text-xs text-stone-400">
          {product.stock} disponíveis
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          fullWidth
          disabled={outOfStock}
          onClick={() => handleAdd(false)}
        >
          {outOfStock ? "Indisponível" : "Adicionar à sacola"}
        </Button>
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            fullWidth
            disabled={outOfStock}
            onClick={() => handleAdd(true)}
            className="sm:w-44"
          >
            Comprar agora
          </Button>
          <FavoriteButton
            productId={product.id}
            productName={product.name}
            variant="inline"
            className="h-13 w-13 shrink-0"
          />
        </div>
      </div>

      <ShippingSimulator price={current} />

      <ul className="grid grid-cols-2 gap-2 text-xs text-stone-500">
        <li>✓ Garantia: {product.warranty ?? "12 meses"}</li>
        <li>✓ Troca grátis em 7 dias</li>
        <li>✓ Nota fiscal eletrônica</li>
        <li>✓ Embalagem reforçada</li>
      </ul>
    </div>
  );
}
