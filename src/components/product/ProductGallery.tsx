"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  // Ao trocar a lista de imagens (ex.: seleção de cor), volta para a primeira.
  useEffect(() => {
    setIndex(0);
  }, [images]);

  const go = (next: number) => setIndex((next + total) % total);
  const src = images[Math.min(index, total - 1)] ?? images[0];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {total > 1 && (
        <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
          {images.map((thumb, i) => (
            <button
              key={`${thumb}-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagem ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100 ring-2 transition sm:h-20 sm:w-20",
                i === index
                  ? "ring-brand"
                  : "ring-transparent hover:ring-stone-300",
              )}
            >
              <Image src={thumb} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative order-1 aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 lg:order-2 lg:flex-1">
        <Image
          key={src}
          src={src}
          alt={`${alt} — imagem ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover animate-fade-in"
        />

        {total > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para imagem ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-5 bg-stone-900" : "w-1.5 bg-stone-400",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
