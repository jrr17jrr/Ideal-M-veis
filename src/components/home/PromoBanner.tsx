import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/** Banner intermediário "Renove sua casa" — composição imagem + texto. */
export function PromoBanner() {
  return (
    <Container>
      <div className="grid overflow-hidden rounded-2xl border border-stone-200 bg-white lg:grid-cols-2">
        <div className="relative min-h-[240px] lg:min-h-[420px]">
          <Image
            src="/images/banners/renove-sua-casa.jpg"
            alt="Ambiente de sala elegante com poltrona e iluminação aconchegante"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-4 p-8 sm:p-12 lg:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Semana do design
          </p>
          <h2 className="text-3xl text-stone-900 sm:text-4xl">
            Renove sua casa com até{" "}
            <span className="text-brand">30% OFF</span>
          </h2>
          <p className="text-sm text-stone-600 sm:text-base">
            Aproveite condições especiais em sofás, mesas e estantes selecionados
            para transformar seus ambientes. Parcele em até 12x sem juros ou
            economize 10% no Pix.
          </p>
          <Button href="/ofertas" size="lg" className="mt-2">
            Ver ofertas
          </Button>
        </div>
      </div>
    </Container>
  );
}
