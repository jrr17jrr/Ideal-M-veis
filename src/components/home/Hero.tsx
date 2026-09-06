import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:gap-14 lg:py-14">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            Ideal Móveis · Coleção 2026
          </p>
          <h1 className="text-[2.5rem] leading-[1.05] text-stone-900 sm:text-5xl lg:text-[3.5rem]">
            Sua casa, do seu jeito.
          </h1>
          <p className="mt-5 max-w-md text-base text-stone-600 sm:text-lg">
            Móveis que unem conforto, estilo e qualidade para transformar cada
            ambiente — com entrega e montagem para todo o Brasil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/produtos" size="lg" className="sm:px-9">
              Comprar agora
            </Button>
            <Button href="/ofertas" size="lg" variant="outline">
              Ver ofertas
            </Button>
          </div>
          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-stone-200 pt-6 text-sm">
            <div>
              <dt className="font-display text-xl text-stone-900">12x sem juros</dt>
              <dd className="text-stone-500">em todo o site</dd>
            </div>
            <div>
              <dt className="font-display text-xl text-stone-900">+2.400</dt>
              <dd className="text-stone-500">avaliações 5 estrelas</dd>
            </div>
            <div>
              <dt className="font-display text-xl text-stone-900">5 anos</dt>
              <dd className="text-stone-500">de garantia</dd>
            </div>
          </dl>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 sm:aspect-[16/10] lg:aspect-[5/4]">
            <Image
              src="/images/hero/sala-ampla.jpg"
              alt="Sala de estar moderna mobiliada com sofá, mesa de centro e poltronas"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
