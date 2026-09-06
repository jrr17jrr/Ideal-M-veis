import Image from "next/image";
import Link from "next/link";
import { CATEGORY_SHOWCASE } from "@/lib/constants";
import { ArrowRight } from "@/components/ui/icons";

/** "Compre por categoria" — cards com foto por tipo de produto. */
export function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-5">
      {CATEGORY_SHOWCASE.map((cat) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-black/5 transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(58,40,28,0.4)] md:aspect-[3/4]"
        >
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 768px) 32vw, (max-width: 1024px) 24vw, 180px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent" />
          <div className="relative flex items-center justify-between gap-1 p-3.5">
            <span className="font-medium text-white">{cat.label}</span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/0 text-white transition-colors group-hover:bg-brand">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
