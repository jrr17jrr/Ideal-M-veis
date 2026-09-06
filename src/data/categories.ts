import type { Category } from "@/types";

/**
 * Categorias da loja (mockado).
 * Futuro: tabela `categories` do Supabase.
 */
export const categories: Category[] = [
  {
    slug: "sala",
    name: "Sala",
    description:
      "Sofás, poltronas, racks e painéis para montar uma sala de estar acolhedora.",
    image: "/images/categories/cat-sala.jpg",
  },
  {
    slug: "quarto",
    name: "Quarto",
    description:
      "Camas, guarda-roupas, cabeceiras e criados-mudos com design atemporal.",
    image: "/images/categories/cat-quarto.jpg",
  },
  {
    slug: "cozinha",
    name: "Cozinha",
    description:
      "Mesas de jantar, cadeiras, aparadores e buffets para reunir a família.",
    image: "/images/categories/cat-cozinha.jpg",
  },
  {
    slug: "escritorio",
    name: "Escritório",
    description:
      "Escrivaninhas, cadeiras ergonômicas e estantes para um home office produtivo.",
    image: "/images/categories/cat-escritorio.jpg",
  },
  {
    slug: "decoracao",
    name: "Decoração",
    description:
      "Luminárias, espelhos, tapetes e objetos para dar personalidade ao ambiente.",
    image: "/images/categories/cat-decoracao.jpg",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
