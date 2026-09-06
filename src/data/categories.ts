import type { ProductCategory } from "@/types";

/**
 * Categorias da loja (por TIPO de móvel). Mockado — futuro: tabela `categories`.
 * A ordem aqui define a ordem no menu e nas listagens.
 */
export const categories: ProductCategory[] = [
  {
    slug: "sofas",
    name: "Sofás",
    description:
      "Sofás retráteis, fixos e de canto para montar uma sala confortável do seu jeito.",
    image: "/images/categories/sofas.jpg",
    position: 1,
  },
  {
    slug: "poltronas",
    name: "Poltronas",
    description:
      "Poltronas de leitura, giratórias e decorativas para completar o ambiente.",
    image: "/images/categories/poltronas.jpg",
    position: 2,
  },
  {
    slug: "mesas",
    name: "Mesas",
    description:
      "Mesas de jantar, de centro e laterais em madeira, laca e tampos redondos.",
    image: "/images/categories/mesas.jpg",
    position: 3,
  },
  {
    slug: "cadeiras",
    name: "Cadeiras",
    description:
      "Cadeiras de jantar estofadas, de madeira e banquetas altas para bancada.",
    image: "/images/categories/cadeiras.jpg",
    position: 4,
  },
  {
    slug: "camas",
    name: "Camas",
    description:
      "Camas box, com baú e cabeceiras estofadas ou ripadas para todos os tamanhos.",
    image: "/images/categories/camas.jpg",
    position: 5,
  },
  {
    slug: "guarda-roupas",
    name: "Guarda-roupas",
    description:
      "Guarda-roupas, cômodas e criados-mudos para um quarto sempre organizado.",
    image: "/images/categories/guarda-roupas.jpg",
    position: 6,
  },
  {
    slug: "racks-paineis",
    name: "Racks e Painéis",
    description:
      "Racks, painéis ripados, estantes, aparadores e buffets para sala e jantar.",
    image: "/images/categories/racks-paineis.jpg",
    position: 7,
  },
  {
    slug: "escritorio",
    name: "Escritório",
    description:
      "Escrivaninhas, cadeiras ergonômicas e estantes modulares para o home office.",
    image: "/images/categories/escritorio.jpg",
    position: 8,
  },
  {
    slug: "decoracao",
    name: "Decoração",
    description:
      "Luminárias, espelhos, tapetes, vasos e quadros para dar personalidade à casa.",
    image: "/images/categories/decoracao.jpg",
    position: 9,
  },
];

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return categories.find((c) => c.slug === slug);
}
