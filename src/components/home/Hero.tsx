import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative">
      <Container className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            Coleção 2026 · Inverno
          </p>
          <h1 className="text-4xl leading-[1.08] text-stone-900 sm:text-5xl lg:text-6xl">
            Ambientes que acolhem, feitos para durar
          </h1>
          <p className="mt-5 max-w-md text-base text-stone-600">
            Sofás, mesas e estantes com design autoral e madeira de manejo
            responsável. Montagem e entrega com hora marcada nas capitais.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/produtos" size="lg">
              Comprar agora
            </Button>
            <Button href="/ofertas" size="lg" variant="outline">
              Ver coleção
            </Button>
          </div>
          <dl className="mt-10 flex gap-8 border-t border-stone-200 pt-6 text-sm">
            <div>
              <dt className="font-display text-2xl text-stone-900">12x</dt>
              <dd className="text-stone-500">sem juros</dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-stone-900">+2.400</dt>
              <dd className="text-stone-500">avaliações 5★</dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-stone-900">5 anos</dt>
              <dd className="text-stone-500">de garantia</dd>
            </div>
          </dl>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-100 sm:aspect-[3/2] lg:aspect-[4/5]">
            <Image
              src="/images/lifestyle/hero.svg"
              alt="Sala de estar mobiliada com sofá, mesa de centro e estante"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
