import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

/**
 * Trilho de produtos: scroll horizontal com snap no mobile,
 * vira grade responsiva a partir de sm.
 */
export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex snap-x snap-mandatory gap-4 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[46%] shrink-0 snap-start sm:w-auto"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
