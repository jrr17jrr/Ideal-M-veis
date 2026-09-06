/**
 * PLACEHOLDER dos tipos do banco.
 *
 * Substituir pelo output de:
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * A forma abaixo apenas documenta as tabelas planejadas (ver docs/backend-plan.md).
 */

export interface Database {
  public: {
    Tables: {
      profiles: Record<string, unknown>;
      addresses: Record<string, unknown>;
      categories: Record<string, unknown>;
      products: Record<string, unknown>;
      product_images: Record<string, unknown>;
      product_variants: Record<string, unknown>;
      favorites: Record<string, unknown>;
      carts: Record<string, unknown>;
      cart_items: Record<string, unknown>;
      orders: Record<string, unknown>;
      order_items: Record<string, unknown>;
      payments: Record<string, unknown>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
