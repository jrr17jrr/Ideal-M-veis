import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Benefits } from "@/components/home/Benefits";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ShopByRoom } from "@/components/home/ShopByRoom";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import {
  getFeaturedProducts,
  getBestSellers,
  getOnSaleProducts,
} from "@/services/products";

export default async function HomePage() {
  const [featured, bestSellers, onSale] = await Promise.all([
    getFeaturedProducts(8),
    getBestSellers(4),
    getOnSaleProducts(8),
  ]);

  return (
    <>
      <Hero />

      <Container className="py-12 lg:py-16">
        <SectionHeader
          eyebrow="Explore"
          title="Compre por categoria"
          description="Encontre rápido o que você precisa para cada cômodo."
        />
        <div className="mt-8">
          <CategoryShowcase />
        </div>
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHeader
          eyebrow="Seleção da casa"
          title="Produtos em destaque"
          linkHref="/produtos"
        />
        <div className="mt-8">
          <ProductCarousel products={featured} />
        </div>
      </Container>

      <section className="py-6 lg:py-8">
        <PromoBanner />
      </section>

      <Container className="py-12 lg:py-16">
        <SectionHeader
          eyebrow="Só por tempo limitado"
          title="Ofertas da semana"
          linkHref="/ofertas"
          linkLabel="Ver todas as ofertas"
        />
        <div className="mt-8">
          <ProductCarousel products={onSale} />
        </div>
      </Container>

      <Benefits />

      <Container className="py-12 lg:py-16">
        <SectionHeader
          eyebrow="Preferidos dos clientes"
          title="Mais vendidos"
          linkHref="/produtos?sort=best_sellers"
        />
        <div className="mt-8">
          <ProductCarousel products={bestSellers} />
        </div>
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHeader
          eyebrow="Inspire-se"
          title="Compre por ambiente"
          description="Composições pensadas para cada espaço da casa."
        />
        <div className="mt-8">
          <ShopByRoom />
        </div>
      </Container>
    </>
  );
}
