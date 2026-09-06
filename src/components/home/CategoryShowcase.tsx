import Image from "next/image";
import Link from "next/link";
import { CATEGORY_SHOWCASE } from "@/lib/constants";
import { ArrowRight } from "@/components/ui/icons";

/** "Compre por categoria" — cards com foto por tipo de produto. */
export function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
      {CATEGORY_SHOWCASE.map((cat) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl bg-stone-100"
        >
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 768px) 46vw, (max-width: 1024px) 24vw, 170px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/15 to-transparent" />
          <div className="relative flex items-center justify-between gap-1 p-3">
            <span className="text-sm font-medium text-white">{cat.label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-white/0 transition-all group-hover:text-white" />
          </div>
        </Link>
      ))}
    </div>
  );
}
