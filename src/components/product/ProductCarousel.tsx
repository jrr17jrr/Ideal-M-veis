"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { ProductCard } from "./ProductCard";

/**
 * Trilho de produtos com Embla: swipe no mobile, drag no desktop, setas
 * discretas nas laterais, sem autoplay. ~1,5 por vez no mobile → 4 no desktop.
 */
export function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const arrow =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-700 shadow-md backdrop-blur transition hover:text-stone-900 disabled:pointer-events-none disabled:opacity-0 lg:flex";

  return (
    <div className="group relative">
      <button
        type="button"
        aria-label="Anterior"
        className={`${arrow} -left-4`}
        disabled={!canPrev}
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Próximo"
        className={`${arrow} -right-4`}
        disabled={!canNext}
        onClick={() => emblaApi?.scrollNext()}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex touch-pan-y sm:-ml-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 grow-0 basis-[64%] pl-4 sm:basis-1/3 sm:pl-6 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
