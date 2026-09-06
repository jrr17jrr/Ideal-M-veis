import type { Product, RoomSlug } from "@/types";
import { Accordion } from "@/components/ui/Accordion";
import { getReviewsForProduct } from "@/data/reviews";
import { getRoomBySlug } from "@/data/rooms";
import { Rating } from "@/components/ui/Rating";
import { formatDate } from "@/lib/format";

function roomLabel(slug?: RoomSlug): string | undefined {
  return slug ? getRoomBySlug(slug)?.name : undefined;
}

function SpecRow({ label, value }: { label: string; value?: string | number }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 border-b border-stone-100 py-2.5 last:border-0">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium text-stone-900">{value}</dd>
    </div>
  );
}

export function ProductDetailsTabs({ product }: { product: Product }) {
  const reviews = getReviewsForProduct(product.id, 3);
  const d = product.dimensions;

  return (
    <Accordion
      defaultOpen={0}
      items={[
        {
          title: "Descrição",
          content: (
            <div className="space-y-3">
              <p>{product.description}</p>
              {product.assembly && (
                <p>
                  <strong className="font-medium text-stone-900">Montagem:</strong>{" "}
                  {product.assembly}
                </p>
              )}
            </div>
          ),
        },
        {
          title: "Especificações e dimensões",
          content: (
            <dl className="text-sm">
              <SpecRow label="Material" value={product.material} />
              <SpecRow
                label="Cores disponíveis"
                value={product.colors?.join(", ")}
              />
              {d && (
                <>
                  <SpecRow label="Largura" value={`${d.width} cm`} />
                  <SpecRow label="Altura" value={`${d.height} cm`} />
                  <SpecRow label="Profundidade" value={`${d.depth} cm`} />
                </>
              )}
              <SpecRow
                label="Peso"
                value={product.weightKg ? `${product.weightKg} kg` : undefined}
              />
              <SpecRow label="Ambiente indicado" value={roomLabel(product.room)} />
              <SpecRow label="SKU" value={product.sku} />
            </dl>
          ),
        },
        {
          title: "Garantia e montagem",
          content: (
            <ul className="list-inside list-disc space-y-1.5">
              <li>Garantia: {product.warranty ?? "12 meses contra defeitos de fabricação"}.</li>
              <li>{product.assembly ?? "Acompanha manual de montagem e ferragens."}</li>
              <li>Serviço de montagem disponível na finalização da compra (regiões selecionadas).</li>
              <li>Direito de arrependimento: devolução gratuita em até 7 dias corridos.</li>
            </ul>
          ),
        },
        {
          title: `Avaliações (${product.reviewsCount ?? reviews.length})`,
          content: (
            <div className="space-y-5">
              {product.rating != null && (
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-stone-900">
                    {product.rating.toFixed(1)}
                  </span>
                  <Rating value={product.rating} count={product.reviewsCount} />
                </div>
              )}
              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="border-t border-stone-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-900">
                        {r.author}
                      </span>
                      <span className="text-xs text-stone-400">
                        {formatDate(r.date)}
                      </span>
                    </div>
                    <Rating value={r.rating} className="mt-1" />
                    <p className="mt-2 text-sm font-medium text-stone-800">
                      {r.title}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">{r.body}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-400">
                Avaliações fictícias para demonstração.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
