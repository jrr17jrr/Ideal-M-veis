import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Sacola",
  robots: { index: false, follow: false },
};

export default function CarrinhoPage() {
  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Sacola" }]} />
      <h1 className="mt-4 mb-8 text-3xl text-stone-900 sm:text-4xl">
        Sua sacola
      </h1>
      <CartPageContent />
    </Container>
  );
}
