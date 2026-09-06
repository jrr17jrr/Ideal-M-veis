"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { cn } from "@/lib/cn";
import {
  discountPercent,
  formatCurrency,
  formatInstallment,
  pixPrice,
} from "@/lib/format";
import { categories } from "@/data/categories";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "./FavoriteButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const catName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem, openDrawer } = useCart();
  const toast = useToast();

  const href = `/produto/${product.slug}`;
  const percent = discountPercent(product.price, product.salePrice);
  const current = product.salePrice ?? product.price;
  const outOfStock = product.stock <= 0;
  const needsChoice =
    (product.variants?.length ?? 0) > 0 || (product.options?.length ?? 0) > 0;
  const swatches = product.variants ?? [];

  function quickAdd(e: React.MouseEvent) {
    // Com cor/opção obrigatória, deixa o clique seguir para a página do produto.
    if (needsChoice || outOfStock) return;
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} adicionado à sacola`);
    openDrawer();
  }

  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-black/5">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 300px"
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]",
              outOfStock && "opacity-60",
            )}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 300px"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {percent != null && <Badge tone="sale">-{percent}%</Badge>}
            {product.new && <Badge tone="new">Novo</Badge>}
          </div>

          <div className="absolute right-3 top-3">
            <FavoriteButton productId={product.id} productName={product.name} />
          </div>

          {outOfStock ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-white">
              Esgotado
            </span>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-stone-900 py-2.5 text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition-all duration-300 hover:bg-stone-800 group-hover:translate-y-0 group-hover:opacity-100 lg:block"
            >
              {needsChoice ? "Escolher opções" : "Adicionar à sacola"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
            {catName(product.category)}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-stone-900">
            {product.name}
          </h3>

          {swatches.length > 0 && (
            <div className="mt-0.5 flex items-center gap-1">
              {swatches.slice(0, 4).map((v) => (
                <span
                  key={v.id}
                  title={v.color}
                  className="inline-block h-3 w-3 rounded-full ring-1 ring-black/15"
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
              {swatches.length > 4 && (
                <span className="text-[11px] text-stone-400">
                  +{swatches.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="mt-1.5">
            {product.salePrice != null && (
              <span className="text-xs text-stone-400 line-through">
                de {formatCurrency(product.price)}
              </span>
            )}
            <p className="text-lg font-semibold text-stone-900">
              {formatCurrency(current)}
            </p>
          </div>
          <p className="text-xs text-stone-500">{formatInstallment(current)}</p>
          <p className="text-xs font-medium text-emerald-700">
            {formatCurrency(pixPrice(current))} no Pix
          </p>
        </div>
      </Link>
    </article>
  );
}
