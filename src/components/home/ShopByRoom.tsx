import Image from "next/image";
import Link from "next/link";
import { SHOP_BY_ROOM } from "@/lib/constants";
import { ArrowRight } from "@/components/ui/icons";

export function ShopByRoom() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SHOP_BY_ROOM.map((room) => (
        <Link
          key={room.href}
          href={room.href}
          className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-stone-100 p-5 sm:aspect-[4/3] lg:aspect-[3/4]"
        >
          <Image
            src={room.image}
            alt={room.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
          <div className="relative">
            <h3 className="font-display text-xl text-white">{room.label}</h3>
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
