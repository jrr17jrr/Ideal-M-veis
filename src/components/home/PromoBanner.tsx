import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-2xl bg-stone-900">
        <Image
          src="/images/lifestyle/promo.svg"
          alt=""
          fill
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-cover opacity-60"
        />
        <div className="relative flex flex-col items-start gap-4 px-6 py-14 sm:px-14 sm:py-20 lg:max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-light">
            Semana do design
          </p>
          <h2 className="text-3xl text-white sm:text-4xl">
            Até 30% off em sofás e poltronas selecionados
          </h2>
          <p className="text-sm text-stone-300">
            Condições válidas enquanto durarem os estoques. Parcele em até 12x
            sem juros ou economize 10% pagando no Pix.
          </p>
          <Button href="/ofertas" size="lg" variant="secondary" className="mt-2">
            Aproveitar ofertas
          </Button>
        </div>
      </div>
    </Container>
  );
}
