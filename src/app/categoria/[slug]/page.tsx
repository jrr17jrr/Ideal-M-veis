import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogView } from "@/components/catalog/CatalogView";
import { parseCatalogParams } from "@/components/catalog/catalogParams";
import { getAllProducts, getCatalogFacets } from "@/services/products";
import { categories, getCategoryBySlug } from "@/data/categories";
import { STORE_NAME } from "@/lib/constants";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada" };
  return {
    title: `${category.name} — Móveis e decoração`,
    description: category.description,
    openGraph: {
      title: `${category.name} · ${STORE_NAME}`,
      description: category.description,
    },
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const raw = await searchParams;
  const [products, facets] = await Promise.all([
    getAllProducts(),
    getCatalogFacets(),
  ]);

  const count = products.filter((p) => p.category === category.slug).length;

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          { label: "Categorias", href: "/produtos" },
          { label: category.name },
        ]}
      />

      <header className="mt-4 mb-8 max-w-2xl">
        <h1 className="text-3xl text-stone-900 sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-sm text-stone-500 sm:text-base">
          {category.description}
        </p>
        <p className="mt-1 text-xs text-stone-400">{count} produtos</p>
      </header>

      <CatalogView
        products={products}
        facets={facets}
        initialState={parseCatalogParams(raw)}
        lockedCategory={category.slug}
      />
    </Container>
  );
}
