import Image from "next/image";
import Link from "next/link";
import { SHOP_BY_ROOM } from "@/lib/constants";

export function ShopByRoom() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SHOP_BY_ROOM.map((room) => (
        <Link
          key={room.href}
          href={room.href}
          className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-xl bg-stone-100"
        >
          <Image
            src={room.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/55 to-transparent" />
          <span className="relative m-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-stone-900">
            {room.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
