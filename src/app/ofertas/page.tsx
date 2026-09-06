import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogView } from "@/components/catalog/CatalogView";
import { parseCatalogParams } from "@/components/catalog/catalogParams";
import { getAllProducts, getCatalogFacets } from "@/services/products";

export const metadata: Metadata = {
  title: "Ofertas",
  description:
    "Móveis com desconto real: sofás, mesas, guarda-roupas e decoração em promoção, com parcelamento em até 12x sem juros.",
};

export default async function OfertasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const [products, facets] = await Promise.all([
    getAllProducts(),
    getCatalogFacets(),
  ]);

  const onSaleCount = products.filter((p) => p.salePrice != null).length;

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Ofertas" }]}
      />

      <div className="relative mt-4 mb-8 overflow-hidden rounded-2xl bg-stone-900">
        <Image
          src="/images/banners/ofertas.jpg"
          alt=""
          fill
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-cover opacity-45"
        />
        <div className="relative px-6 py-12 sm:px-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-light">
            Ofertas da semana
          </p>
          <h1 className="mt-2 max-w-xl text-3xl text-white sm:text-4xl">
            Até 30% OFF em móveis selecionados
          </h1>
          <p className="mt-2 max-w-lg text-sm text-stone-300">
            {onSaleCount} produtos com desconto por tempo limitado — em até 12x
            sem juros ou com 5% extra no Pix.
          </p>
        </div>
      </div>

      <CatalogView
        products={products}
        facets={facets}
        initialState={{ ...parseCatalogParams(raw), onSaleOnly: true }}
      />
    </Container>
  );
}
