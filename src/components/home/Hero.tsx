import { HeroVideo } from "./HeroVideo";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
  return (
    <section className="relative bg-canvas pb-8 sm:pb-10 lg:pb-12">
      <HeroVideo />

      {/*
        O filtro sobe bastante sobre o hero para permanecer inteiro na primeira dobra
        em notebooks/desktops, sem ser cortado por overflow.
      */}
      <div className="relative z-20 mx-auto -mt-28 w-full max-w-[1480px] px-4 sm:-mt-32 sm:px-6 lg:-mt-36 lg:px-8 xl:px-10">
        <HeroSearch />
      </div>
    </section>
  );
}
