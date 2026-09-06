/**
 * Leitura centralizada das variáveis de ambiente do Supabase.
 *
 * Enquanto o back-end não está ligado, `isSupabaseConfigured` retorna `false`
 * e os `services` continuam usando os dados mockados de `src/data/*`.
 */

export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseEnv.url && supabaseEnv.anonKey);
}
