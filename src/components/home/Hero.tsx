import { HeroVideo } from "./HeroVideo";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
  return (
    <section className="relative bg-canvas">
      <HeroVideo />

      {/*
        Card de filtros sobreposto ao final do hero.
        - container próprio (mais largo que o do site) com margens laterais
        - `relative z-20` + margin negativa: sobe ~64–96px sobre o vídeo
        - NENHUM ancestral com overflow:hidden -> o card nunca é cortado
      */}
      <div className="relative z-20 mx-auto -mt-16 mb-14 w-full max-w-[1400px] px-4 sm:-mt-20 sm:px-6 lg:-mt-24 lg:mb-20 lg:px-10">
        <HeroSearch />
      </div>
    </section>
  );
}
