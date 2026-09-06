import type { Metadata } from "next";
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

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="text-3xl text-stone-900 sm:text-4xl">Ofertas</h1>
        <p className="mt-2 text-sm text-stone-500 sm:text-base">
          {onSaleCount} produtos com desconto por tempo limitado. Ganhe 10% extra
          pagando no Pix.
        </p>
      </header>

      <CatalogView
        products={products}
        facets={facets}
        initialState={{ ...parseCatalogParams(raw), onSaleOnly: true }}
      />
    </Container>
  );
}
