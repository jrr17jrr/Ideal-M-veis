import Image from "next/image";
import Link from "next/link";
import { SHOP_BY_ROOM } from "@/lib/constants";
import { ArrowRight } from "@/components/ui/icons";

/** "Compre por ambiente" — cards grandes de ambiente. */
export function ShopByRoom() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {SHOP_BY_ROOM.map((room, i) => (
        <Link
          key={room.href}
          href={room.href}
          className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-stone-100 p-5 ${
            i === 0 ? "aspect-[4/5] sm:col-span-2 sm:aspect-[16/9] lg:col-span-2 lg:aspect-[2/1]" : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4]"
          }`}
        >
          <Image
            src={room.image}
            alt={room.label}
            fill
            sizes={
              i === 0
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 640px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/15 to-transparent" />
          <div className="relative">
            <h3 className="font-display text-xl text-white sm:text-2xl">
              {room.label}
            </h3>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/90">
              Ver produtos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
