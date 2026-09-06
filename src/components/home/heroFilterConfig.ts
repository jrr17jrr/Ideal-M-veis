/**
 * Opções do filtro sobreposto ao hero.
 *
 * Os `value` daqui viram query params "amigáveis" em `/produtos`
 * (`?categoria=&ambiente=&preco=&estilo=&mat=&cor=&promo=&disp=`) e são
 * interpretados por `components/catalog/catalogParams.ts` — reaproveitando
 * o mesmo sistema de filtros do catálogo.
 */

export interface HeroOption {
  value: string;
  label: string;
}

export const HERO_CATEGORY_OPTIONS: HeroOption[] = [
  { value: "todas", label: "Todas as categorias" },
  { value: "sofas", label: "Sofás" },
  { value: "mesas", label: "Mesas" },
  { value: "cadeiras", label: "Cadeiras" },
  { value: "racks-paineis", label: "Racks e Painéis" },
  { value: "quartos", label: "Quartos" },
  { value: "escritorio", label: "Escritório" },
  { value: "decoracao", label: "Decoração" },
];

export const HERO_ENVIRONMENT_OPTIONS: HeroOption[] = [
  { value: "qualquer", label: "Qualquer ambiente" },
  { value: "sala", label: "Sala" },
  { value: "quarto", label: "Quarto" },
  { value: "cozinha", label: "Cozinha e Jantar" },
  { value: "escritorio", label: "Escritório" },
  { value: "area-externa", label: "Área externa" },
];

export const HERO_PRICE_OPTIONS: HeroOption[] = [
  { value: "qualquer", label: "Qualquer valor" },
  { value: "0-500", label: "Até R$ 500" },
  { value: "500-1000", label: "R$ 500 a R$ 1.000" },
  { value: "1000-2000", label: "R$ 1.000 a R$ 2.000" },
  { value: "2000-5000", label: "R$ 2.000 a R$ 5.000" },
  { value: "5000-", label: "Acima de R$ 5.000" },
];

export const HERO_STYLE_OPTIONS: HeroOption[] = [
  { value: "qualquer", label: "Qualquer estilo" },
  { value: "moderno", label: "Moderno" },
  { value: "minimalista", label: "Minimalista" },
  { value: "classico", label: "Clássico" },
  { value: "industrial", label: "Industrial" },
  { value: "contemporaneo", label: "Contemporâneo" },
  { value: "rustico", label: "Rústico" },
];

/* -------- Busca avançada -------- */

export const HERO_MATERIAL_OPTIONS: HeroOption[] = [
  { value: "qualquer", label: "Qualquer material" },
  { value: "Madeira", label: "Madeira" },
  { value: "MDF", label: "MDF" },
  { value: "Veludo", label: "Veludo" },
  { value: "Linho", label: "Linho" },
  { value: "Couro", label: "Couro sintético" },
  { value: "Metal", label: "Metal" },
];

export const HERO_COLOR_OPTIONS: HeroOption[] = [
  { value: "qualquer", label: "Qualquer cor" },
  { value: "Bege", label: "Bege" },
  { value: "Cinza", label: "Cinza" },
  { value: "Grafite", label: "Grafite" },
  { value: "Caramelo", label: "Caramelo" },
  { value: "Verde", label: "Verde" },
  { value: "Off-white", label: "Off-white" },
  { value: "Preto", label: "Preto" },
];

export const HERO_AVAILABILITY_OPTIONS: HeroOption[] = [
  { value: "qualquer", label: "Qualquer disponibilidade" },
  { value: "in_stock", label: "Pronta entrega" },
  { value: "low_stock", label: "Últimas unidades" },
];

export interface HeroFilterValues {
  categoria: string;
  ambiente: string;
  preco: string;
  estilo: string;
  mat: string;
  cor: string;
  disp: string;
  promo: boolean;
}

export const EMPTY_HERO_FILTER: HeroFilterValues = {
  categoria: "todas",
  ambiente: "qualquer",
  preco: "qualquer",
  estilo: "qualquer",
  mat: "qualquer",
  cor: "qualquer",
  disp: "qualquer",
  promo: false,
};

/** Monta a query string para `/produtos` a partir dos valores do filtro. */
export function heroFilterToQuery(v: HeroFilterValues): string {
  const p = new URLSearchParams();
  if (v.categoria !== "todas") p.set("categoria", v.categoria);
  if (v.ambiente !== "qualquer") p.set("ambiente", v.ambiente);
  if (v.preco !== "qualquer") p.set("preco", v.preco);
  if (v.estilo !== "qualquer") p.set("estilo", v.estilo);
  if (v.mat !== "qualquer") p.set("mat", v.mat);
  if (v.cor !== "qualquer") p.set("cor", v.cor);
  if (v.disp !== "qualquer") p.set("disp", v.disp);
  if (v.promo) p.set("promo", "1");
  const qs = p.toString();
  return qs ? `/produtos?${qs}` : "/produtos";
}
