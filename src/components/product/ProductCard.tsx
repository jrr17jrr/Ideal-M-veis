"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { cn } from "@/lib/cn";
import { discountPercent, formatCurrency, formatInstallment } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "./FavoriteButton";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

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
  const hasVariants = (product.variants?.length ?? 0) > 0;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, 1);
    toast.success(`${product.name} adicionado à sacola`);
    openDrawer();
  }

  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              outOfStock && "opacity-60",
            )}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
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
              className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-stone-900 py-2.5 text-xs font-medium tracking-wide text-white opacity-0 transition-all duration-300 hover:bg-stone-800 group-hover:translate-y-0 group-hover:opacity-100 lg:block"
            >
              {hasVariants ? "Escolher opções" : "Adicionar à sacola"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
            {product.category}
          </p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-stone-900">
            {product.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            {product.salePrice != null && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-base font-semibold text-stone-900">
              {formatCurrency(current)}
            </span>
          </div>
          <p className="text-xs text-stone-500">{formatInstallment(current)}</p>
        </div>
      </Link>

      {hasVariants && !outOfStock && (
        <Link
          href={href}
          className="mt-2 text-xs font-medium text-brand underline-offset-4 hover:underline lg:hidden"
        >
          Ver opções
        </Link>
      )}
    </article>
  );
}
