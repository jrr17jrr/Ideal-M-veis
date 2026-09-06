import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/icons";

/** Banner intermediário "Renove seus ambientes" — composição imagem + texto. */
export function PromoBanner() {
  return (
    <Container>
      <div className="grid overflow-hidden rounded-3xl bg-olive lg:grid-cols-2">
        <div className="relative min-h-[240px] lg:min-h-[440px]">
          <Image
            src="/images/banners/renove-sua-casa.jpg"
            alt="Sala de jantar sofisticada com mesa de madeira e cadeiras estofadas"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-4 p-8 text-white sm:p-12 lg:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-light">
            Renove seus ambientes
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Até 30% OFF
          </h2>
          <p className="text-sm text-white/80 sm:text-base">
            em móveis selecionados. Parcele em até 12x sem juros ou economize
            mais 5% pagando no Pix.
          </p>
          <Link
            href="/ofertas"
            className="group mt-3 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold uppercase tracking-wide text-stone-900 transition-colors hover:bg-stone-100"
          >
            Aproveitar ofertas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Container>
  );
}
