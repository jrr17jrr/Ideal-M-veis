import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/icons";

/** Segundo banner promocional da home — imagem full-bleed com CTA. */
export function CtaBanner() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-3xl">
        <Image
          src="/images/rooms/cozinha.jpg"
          alt="Sala de jantar montada com mesa e cadeiras"
          fill
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/55" />
        <div className="relative flex flex-col items-center gap-3 px-6 py-16 text-center text-white sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-light">
            Projeto de ambientação
          </p>
          <h2 className="max-w-xl font-display text-3xl sm:text-4xl">
            Receba um projeto 3D gratuito do seu ambiente
          </h2>
          <p className="max-w-md text-sm text-white/80">
            Converse com um dos nossos especialistas e visualize como os móveis
            ficam na sua casa antes de comprar.
          </p>
          <Link
            href="/produtos"
            className="group mt-3 inline-flex items-center gap-2 rounded-full border border-white/70 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            Explorar catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Container>
  );
}
