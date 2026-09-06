/**
 * Entidades de cliente / conta.
 *
 * Mapeiam para as futuras tabelas do Supabase:
 *  - `profiles`   -> Customer
 *  - `addresses`  -> Address
 */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cpf?: string;
  createdAt: string;
}

export type BrazilianState =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO"
  | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI"
  | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";

export interface Address {
  id: string;
  label?: string;
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: BrazilianState | string;
  isDefault?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthSession {
  user: AuthUser;
  /** Placeholder — o Supabase devolverá um access token real aqui. */
  accessToken: string;
  expiresAt: number;
}
