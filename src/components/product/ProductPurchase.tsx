"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductVariant } from "@/types";
import { variantPrice } from "@/types";
import { cn } from "@/lib/cn";
import {
  discountPercent,
  formatCurrency,
  formatInstallment,
  pixPrice,
  PIX_DISCOUNT,
} from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { FavoriteButton } from "./FavoriteButton";
import { ShippingSimulator } from "./ShippingSimulator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { CheckIcon } from "@/components/ui/icons";

function availabilityUi(stock: number) {
  if (stock <= 0)
    return { label: "Produto esgotado", cls: "text-red-600" };
  if (stock <= 5)
    return { label: `Últimas ${stock} unidades`, cls: "text-amber-700" };
  return { label: "Em estoque · pronta entrega", cls: "text-emerald-700" };
}

export function ProductPurchase({
  product,
  variant,
  onVariantChange,
}: {
  product: Product;
  variant?: ProductVariant;
  onVariantChange: (v: ProductVariant) => void;
}) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const toast = useToast();

  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (product.options ?? []).map((g) => [g.name, g.values[0]]),
    ),
  );

  const { price, salePrice } = variantPrice(product, variant);
  const current = salePrice ?? price;
  const percent = discountPercent(price, salePrice);
  const stock = variant?.stock ?? product.stock;
  const outOfStock = stock <= 0;
  const ui = availabilityUi(stock);

  const selection = useMemo(
    () => ({
      variant,
      options: Object.keys(options).length ? options : undefined,
    }),
    [variant, options],
  );

  function handleAdd(redirect: boolean) {
    if (outOfStock) return;
    addItem(product, quantity, selection);
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
        <h1 className="mt-1.5 font-display text-2xl text-stone-900 sm:text-[28px]">
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
          {salePrice != null && (
            <span className="text-sm text-stone-400 line-through">
              de {formatCurrency(price)}
            </span>
          )}
          <span className="font-display text-[2rem] font-medium text-stone-900">
            {formatCurrency(current)}
          </span>
          {percent != null && <Badge tone="sale">-{percent}%</Badge>}
        </div>
        <p className="mt-1 text-sm text-stone-600">{formatInstallment(current)}</p>
        <p className="mt-1 text-sm font-semibold text-emerald-700">
          {formatCurrency(pixPrice(current))} no Pix
          <span className="font-normal text-stone-500">
            {" "}
            ({Math.round(PIX_DISCOUNT * 100)}% de desconto)
          </span>
        </p>
      </div>

      <p className={cn("flex items-center gap-1.5 text-sm font-medium", ui.cls)}>
        <CheckIcon className="h-4 w-4" />
        {ui.label}
      </p>

      {/* Cores (variação com imagem) */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <p className="mb-2.5 text-sm font-medium text-stone-900">
            Cor:{" "}
            <span className="font-normal text-stone-500">
              {variant?.color ?? product.variants[0].color}
            </span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const active = (variant?.id ?? product.variants![0].id) === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVariantChange(v)}
                  aria-pressed={active}
                  title={v.color}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/10 transition",
                    active
                      ? "outline outline-2 outline-offset-2 outline-brand"
                      : "hover:ring-black/25",
                  )}
                  style={{ backgroundColor: v.colorHex }}
                >
                  {active && (
                    <CheckIcon
                      className="h-4 w-4"
                      style={{
                        color: isLight(v.colorHex) ? "#1c1917" : "#fff",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Outras opções */}
      {product.options?.map((group) => (
        <div key={group.name}>
          <p className="mb-2 text-sm font-medium text-stone-900">
            {group.name}:{" "}
            <span className="font-normal text-stone-500">
              {options[group.name]}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = options[group.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setOptions((o) => ({ ...o, [group.name]: value }))
                  }
                  className={cn(
                    "min-w-11 rounded-lg border px-3.5 py-2 text-sm transition-colors",
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

      {/* Quantidade */}
      <div className="flex items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={Math.max(1, stock)}
        />
        <span className="text-xs text-stone-400">{stock} disponíveis</span>
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          disabled={outOfStock}
          onClick={() => handleAdd(false)}
        >
          {outOfStock ? "Indisponível" : "Adicionar ao carrinho"}
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

/** Heurística simples de luminância para escolher a cor do check no swatch. */
function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}
