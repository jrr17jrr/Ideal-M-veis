import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FavoritesContent } from "@/components/product/FavoritesContent";

export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false, follow: true },
};

export default function FavoritosPage() {
  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Favoritos" }]}
      />
      <h1 className="mt-4 mb-8 text-3xl text-stone-900 sm:text-4xl">
        Meus favoritos
      </h1>
      <FavoritesContent />
    </Container>
  );
}
