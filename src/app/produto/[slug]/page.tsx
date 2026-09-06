import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductDetailsTabs } from "@/components/product/ProductDetailsTabs";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
  getRecommendedProducts,
} from "@/services/products";
import { getCategoryBySlug } from "@/data/categories";
import { STORE_NAME, SITE_URL } from "@/lib/constants";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };

  const price = product.salePrice ?? product.price;
  const description = product.description.slice(0, 155);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} · ${STORE_NAME}`,
      description,
      url: `${SITE_URL}/produto/${product.slug}`,
      images: [{ url: product.images[0], width: 1200, height: 1200, alt: product.name }],
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "BRL",
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, recommended] = await Promise.all([
    getRelatedProducts(product, 4),
    getRecommendedProducts(product, 4),
  ]);

  const category = getCategoryBySlug(product.category);
  const price = product.salePrice ?? product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => `${SITE_URL}${i}`),
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: STORE_NAME },
    ...(product.rating != null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewsCount ?? 0,
      },
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/produto/${product.slug}`,
    },
  };

  return (
    <Container className="py-6 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Início", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/categoria/${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductPurchase product={product} />
      </div>

      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="mb-4 font-display text-xl text-stone-900">
          Informações do produto
        </h2>
        <ProductDetailsTabs product={product} />
      </section>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeader
            title="Produtos relacionados"
            linkHref={`/categoria/${product.category}`}
          />
          <div className="mt-8">
            <ProductCarousel products={related} />
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="Você também pode gostar" />
          <div className="mt-8">
            <ProductCarousel products={recommended} />
          </div>
        </section>
      )}
    </Container>
  );
}
