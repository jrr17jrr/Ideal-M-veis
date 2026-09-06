import { Container } from "@/components/ui/Container";
import { HeroVideo } from "./HeroVideo";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
  return (
    <section>
      <HeroVideo />

      {/* Card de filtros sobreposto ao final do hero (no mobile flui abaixo) */}
      <Container className="relative z-20 -mt-6 sm:-mt-12 lg:-mt-24">
        <HeroSearch />
      </Container>
    </section>
  );
}
