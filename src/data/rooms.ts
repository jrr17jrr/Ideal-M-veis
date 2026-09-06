import type { ProductRoom } from "@/types";

/**
 * Ambientes da loja. Mockado — futuro: coluna/tabela de `rooms`.
 */
export const rooms: ProductRoom[] = [
  {
    slug: "sala-de-estar",
    name: "Sala de estar",
    description: "Sofás, poltronas, racks, mesas de centro e iluminação.",
    image: "/images/rooms/sala.jpg",
  },
  {
    slug: "sala-de-jantar",
    name: "Sala de jantar",
    description: "Mesas, cadeiras, aparadores e buffets para receber bem.",
    image: "/images/rooms/jantar.jpg",
  },
  {
    slug: "quarto",
    name: "Quarto",
    description: "Camas, cabeceiras, guarda-roupas, cômodas e criados-mudos.",
    image: "/images/rooms/quarto.jpg",
  },
  {
    slug: "escritorio",
    name: "Escritório",
    description: "Escrivaninhas, cadeiras ergonômicas e estantes para o home office.",
    image: "/images/rooms/escritorio.jpg",
  },
  {
    slug: "area-externa",
    name: "Área externa",
    description: "Móveis para varanda, quintal e beira de piscina.",
    image: "/images/rooms/varanda.jpg",
  },
];

export function getRoomBySlug(slug: string): ProductRoom | undefined {
  return rooms.find((r) => r.slug === slug);
}
