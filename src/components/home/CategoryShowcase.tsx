import Image from "next/image";
import Link from "next/link";
import { CATEGORY_SHOWCASE } from "@/lib/constants";

/** "Compre por categoria" — cards com foto por tipo de produto. */
export function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
      {CATEGORY_SHOWCASE.map((cat) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-stone-100 p-3 md:aspect-[4/5] lg:aspect-[3/4]"
        >
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 768px) 45vw, (max-width: 1024px) 24vw, 170px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
          <span className="relative text-sm font-medium text-white">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
