"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useFavorites } from "@/context/FavoritesContext";
import { getProductsByIds } from "@/services/products";
import { ProductGrid } from "./ProductGrid";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/icons";

export function FavoritesContent() {
  const { ids, hydrated } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    getProductsByIds(ids).then((list) => {
      // preserva a ordem de favoritar (mais recente primeiro)
      const order = new Map(ids.map((id, i) => [id, i]));
      setProducts(
        [...list].sort((a, b) => (order.get(b.id) ?? 0) - (order.get(a.id) ?? 0)),
      );
      setLoading(false);
    });
  }, [ids, hydrated]);

  if (!hydrated || loading) return <ProductGridSkeleton count={4} />;

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="h-6 w-6" />}
        title="Nenhum favorito ainda"
        description="Toque no coração dos produtos que você gostou para salvá-los aqui."
        action={<Button href="/produtos">Ver produtos</Button>}
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-stone-500">
        {products.length} {products.length === 1 ? "produto salvo" : "produtos salvos"}
      </p>
      <ProductGrid products={products} />
    </>
  );
}
