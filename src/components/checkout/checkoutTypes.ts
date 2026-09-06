import type { PaymentMethod } from "@/types";
import {
  isValidCEP,
  isValidCPF,
  isValidEmail,
  onlyDigits,
} from "@/lib/masks";

export interface IdentificationForm {
  firstName: string;
  lastName: string;
  cpf: string;
  email: string;
  phone: string;
}

export interface DeliveryForm {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export interface CardForm {
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutState {
  identification: IdentificationForm;
  delivery: DeliveryForm;
  shippingOptionId: string | null;
  paymentMethod: PaymentMethod;
  installments: number;
  card: CardForm;
}

export const EMPTY_CHECKOUT: CheckoutState = {
  identification: { firstName: "", lastName: "", cpf: "", email: "", phone: "" },
  delivery: {
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
  },
  shippingOptionId: null,
  paymentMethod: "pix",
  installments: 1,
  card: { number: "", holder: "", expiry: "", cvv: "" },
};

export type Errors<T> = Partial<Record<keyof T, string>>;

export function validateIdentification(
  f: IdentificationForm,
): Errors<IdentificationForm> {
  const e: Errors<IdentificationForm> = {};
  if (!f.firstName.trim()) e.firstName = "Informe o nome";
  if (!f.lastName.trim()) e.lastName = "Informe o sobrenome";
  if (!isValidCPF(f.cpf)) e.cpf = "CPF incompleto";
  if (!isValidEmail(f.email)) e.email = "E-mail inválido";
  if (onlyDigits(f.phone).length < 10) e.phone = "Telefone incompleto";
  return e;
}

export function validateDelivery(f: DeliveryForm): Errors<DeliveryForm> {
  const e: Errors<DeliveryForm> = {};
  if (!isValidCEP(f.zipCode)) e.zipCode = "CEP incompleto";
  if (!f.street.trim()) e.street = "Informe a rua";
  if (!f.number.trim()) e.number = "Nº";
  if (!f.district.trim()) e.district = "Informe o bairro";
  if (!f.city.trim()) e.city = "Informe a cidade";
  if (!f.state.trim()) e.state = "UF";
  return e;
}

export function validateCard(f: CardForm): Errors<CardForm> {
  const e: Errors<CardForm> = {};
  if (onlyDigits(f.number).length < 13) e.number = "Número do cartão inválido";
  if (!f.holder.trim()) e.holder = "Informe o nome impresso";
  if (!/^\d{2}\/\d{2}$/.test(f.expiry)) e.expiry = "MM/AA";
  if (onlyDigits(f.cvv).length < 3) e.cvv = "CVV";
  return e;
}

export function hasErrors(e: Record<string, string | undefined>): boolean {
  return Object.values(e).some(Boolean);
}
