import type { Address, Customer } from "@/types";

/**
 * Cliente e endereços mockados usados na "Área do cliente" enquanto não há
 * autenticação real. Futuro: tabelas `profiles` e `addresses`.
 */

export const mockCustomer: Customer = {
  id: "cus-demo-01",
  firstName: "Ana",
  lastName: "Ribeiro",
  email: "ana.ribeiro@exemplo.com",
  phone: "(11) 98888-1234",
  cpf: "123.456.789-00",
  createdAt: "2025-11-02T14:30:00.000Z",
};

export const mockAddresses: Address[] = [
  {
    id: "addr-01",
    label: "Casa",
    recipient: "Ana Ribeiro",
    zipCode: "01310-100",
    street: "Avenida Paulista",
    number: "1578",
    complement: "Apto 92",
    district: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    isDefault: true,
  },
  {
    id: "addr-02",
    label: "Trabalho",
    recipient: "Ana Ribeiro",
    zipCode: "04538-133",
    street: "Avenida Brigadeiro Faria Lima",
    number: "3477",
    complement: "10º andar",
    district: "Itaim Bibi",
    city: "São Paulo",
    state: "SP",
  },
];
