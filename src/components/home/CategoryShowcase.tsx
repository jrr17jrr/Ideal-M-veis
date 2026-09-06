import Image from "next/image";
import Link from "next/link";
import { CATEGORY_SHOWCASE } from "@/lib/constants";
import { ArrowRight } from "@/components/ui/icons";

/** "Compre por categoria" — cards com foto por tipo de móvel. */
export function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {CATEGORY_SHOWCASE.map((cat) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="group relative flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-black/5 transition-shadow hover:shadow-[0_22px_50px_-22px_rgba(58,40,28,0.45)]"
        >
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent" />
          <div className="relative flex items-center justify-between gap-1 p-4">
            <span className="font-display text-lg text-white">{cat.label}</span>
            <span className="flex h-7 w-7 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-white/0 text-white opacity-0 transition-all group-hover:translate-x-0 group-hover:bg-brand group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
