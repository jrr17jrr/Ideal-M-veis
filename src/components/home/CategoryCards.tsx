import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

export function CategoryCards() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categoria/${cat.slug}`}
          className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-stone-100 p-4"
        >
          <Image
            src={cat.image}
            alt=""
            fill
            sizes="(max-width: 768px) 45vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/10 to-transparent" />
          <span className="relative font-display text-lg text-white">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
