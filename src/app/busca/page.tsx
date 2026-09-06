import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogView } from "@/components/catalog/CatalogView";
import { parseCatalogParams } from "@/components/catalog/catalogParams";
import { getAllProducts, getCatalogFacets } from "@/services/products";
import { matchesText } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Busca",
  robots: { index: false, follow: true },
};

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const term = (Array.isArray(raw.q) ? raw.q[0] : raw.q) ?? "";

  const [products, facets] = await Promise.all([
    getAllProducts(),
    getCatalogFacets(),
  ]);

  const count = term ? products.filter((p) => matchesText(p, term)).length : 0;

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Busca" }]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="text-3xl text-stone-900 sm:text-4xl">
          {term ? (
            <>
              Resultados para{" "}
              <span className="text-brand">“{term}”</span>
            </>
          ) : (
            "Buscar produtos"
          )}
        </h1>
        {term && (
          <p className="mt-2 text-sm text-stone-500">
            {count} {count === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        )}
      </header>

      <CatalogView
        products={products}
        facets={facets}
        initialState={parseCatalogParams(raw)}
      />
    </Container>
  );
}
