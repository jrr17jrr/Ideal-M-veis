"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/types";
import { galleryImages } from "@/types";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";

/**
 * Une galeria + compra: mantém a variação de cor selecionada e faz a galeria
 * acompanhar a cor.
 */
export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0],
  );

  const images = useMemo(
    () => galleryImages(product, variant),
    [product, variant],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.12fr_1fr] lg:gap-14">
      <ProductGallery images={images} alt={product.name} />
      <ProductPurchase
        product={product}
        variant={variant}
        onVariantChange={setVariant}
      />
    </div>
  );
}
