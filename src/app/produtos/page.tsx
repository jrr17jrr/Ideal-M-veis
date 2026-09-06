import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogView } from "@/components/catalog/CatalogView";
import { parseCatalogParams } from "@/components/catalog/catalogParams";
import { getAllProducts, getCatalogFacets } from "@/services/products";

export const metadata: Metadata = {
  title: "Todos os produtos",
  description:
    "Catálogo completo de móveis e decoração: sofás, mesas, cadeiras, guarda-roupas, estantes e mais. Filtre por ambiente, cor, material e preço.",
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const [products, facets] = await Promise.all([
    getAllProducts(),
    getCatalogFacets(),
  ]);
  const initialState = parseCatalogParams(raw);

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Todos os produtos" }]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="text-3xl text-stone-900 sm:text-4xl">Todos os produtos</h1>
        <p className="mt-2 text-sm text-stone-500 sm:text-base">
          {products.length} peças com design autoral, prontas para transformar
          a sua casa.
        </p>
      </header>

      <CatalogView
        products={products}
        facets={facets}
        initialState={initialState}
      />
    </Container>
  );
}
