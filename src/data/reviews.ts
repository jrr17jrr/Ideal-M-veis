/**
 * Avaliações mockadas. Futuro: tabela `reviews` (fora do escopo inicial do
 * backend-plan, mas fácil de acrescentar).
 */

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

const SAMPLE_REVIEWS: Omit<Review, "id">[] = [
  {
    author: "Marina C.",
    rating: 5,
    date: "2026-07-12",
    title: "Superou a expectativa",
    body: "Chegou antes do prazo, muito bem embalado. O acabamento é lindo e o conforto é real. Recomendo demais.",
  },
  {
    author: "Rafael T.",
    rating: 4,
    date: "2026-06-28",
    title: "Ótimo custo-benefício",
    body: "Produto firme e bonito. Tirei uma estrela porque a montagem deu um pouco de trabalho, mas o resultado ficou ótimo.",
  },
  {
    author: "Juliana M.",
    rating: 5,
    date: "2026-06-15",
    title: "Exatamente como nas fotos",
    body: "A cor é fiel e combinou perfeitamente com a minha sala. Atendimento da loja foi atencioso quando tirei dúvidas.",
  },
  {
    author: "Eduardo P.",
    rating: 5,
    date: "2026-05-30",
    title: "Compraria de novo",
    body: "Segunda vez que compro na loja. Qualidade consistente e entrega bem organizada, com agendamento.",
  },
  {
    author: "Camila R.",
    rating: 4,
    date: "2026-05-08",
    title: "Muito bonito",
    body: "Peça elegante e bem construída. Só achei a embalagem um pouco difícil de descartar por ser grande.",
  },
];

export function getReviewsForProduct(productId: string, count = 3): Review[] {
  // Seleção estável baseada no id do produto (mesmo produto -> mesmas reviews).
  const seed = productId
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Array.from({ length: Math.min(count, SAMPLE_REVIEWS.length) }, (_, i) => {
    const base = SAMPLE_REVIEWS[(seed + i) % SAMPLE_REVIEWS.length];
    return { ...base, id: `${productId}-rev-${i + 1}` };
  });
}
