/**
 * Gera imagens SVG placeholder para desenvolvimento.
 *
 *   node scripts/gen-placeholders.mjs
 *
 * As imagens ficam em `public/images/**`. Substitua por fotos reais (Unsplash,
 * Supabase Storage, etc.) quando disponível — os caminhos em `src/data/products.ts`
 * e `src/lib/constants.ts` já apontam para cá.
 *
 * Se você adicionar/renomear produtos em `src/data/products.ts`, atualize a
 * lista PRODUCTS abaixo e rode o script de novo.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");

/* Paletas neutras e elegantes (fundo, piso, móvel, sombra) */
const PALETTES = [
  ["#efe9e1", "#e2d8cb", "#c8b6a0", "#b7a48c"],
  ["#e9e6e1", "#dcd7cf", "#b9b1a4", "#a79d8d"],
  ["#f0ece6", "#e4ddd2", "#cdbfa9", "#bcaa92"],
  ["#e6e7e4", "#d8dad4", "#b3b7ae", "#a2a699"],
  ["#f1ebe6", "#e6dcd2", "#d2b9a3", "#c1a68d"],
];

const W = 1200;
const H = 1200;

/* ----------------------------- Silhuetas ----------------------------- */

function sofa(c) {
  return `
    <rect x="150" y="640" width="900" height="230" rx="34" fill="${c[2]}"/>
    <rect x="180" y="470" width="840" height="240" rx="40" fill="${c[2]}"/>
    <rect x="210" y="600" width="780" height="120" rx="26" fill="${c[3]}" opacity="0.55"/>
    <rect x="140" y="560" width="120" height="300" rx="30" fill="${c[3]}"/>
    <rect x="940" y="560" width="120" height="300" rx="30" fill="${c[3]}"/>
    <rect x="240" y="860" width="40" height="70" fill="${c[3]}"/>
    <rect x="920" y="860" width="40" height="70" fill="${c[3]}"/>
  `;
}

function armchair(c) {
  return `
    <rect x="380" y="560" width="440" height="320" rx="40" fill="${c[2]}"/>
    <rect x="410" y="430" width="380" height="220" rx="44" fill="${c[2]}"/>
    <rect x="350" y="520" width="90" height="340" rx="26" fill="${c[3]}"/>
    <rect x="760" y="520" width="90" height="340" rx="26" fill="${c[3]}"/>
    <rect x="430" y="875" width="34" height="70" fill="${c[3]}"/>
    <rect x="736" y="875" width="34" height="70" fill="${c[3]}"/>
  `;
}

function table(c) {
  return `
    <rect x="220" y="520" width="760" height="46" rx="12" fill="${c[2]}"/>
    <rect x="270" y="566" width="34" height="330" fill="${c[3]}"/>
    <rect x="896" y="566" width="34" height="330" fill="${c[3]}"/>
    <rect x="300" y="700" width="600" height="20" fill="${c[3]}" opacity="0.5"/>
  `;
}

function roundTable(c) {
  return `
    <ellipse cx="600" cy="540" rx="330" ry="70" fill="${c[2]}"/>
    <rect x="560" y="560" width="80" height="300" fill="${c[3]}"/>
    <ellipse cx="600" cy="880" rx="150" ry="34" fill="${c[3]}"/>
  `;
}

function chair(c) {
  return `
    <rect x="470" y="600" width="260" height="40" rx="10" fill="${c[2]}"/>
    <rect x="470" y="380" width="46" height="260" rx="12" fill="${c[2]}"/>
    <rect x="520" y="400" width="180" height="150" rx="18" fill="${c[3]}"/>
    <rect x="486" y="640" width="24" height="240" fill="${c[3]}"/>
    <rect x="690" y="640" width="24" height="240" fill="${c[3]}"/>
  `;
}

function officeChair(c) {
  return `
    <rect x="470" y="430" width="260" height="240" rx="40" fill="${c[2]}"/>
    <rect x="500" y="660" width="200" height="50" rx="14" fill="${c[2]}"/>
    <rect x="588" y="705" width="24" height="120" fill="${c[3]}"/>
    <path d="M480 900 L720 900 L600 820 Z" fill="${c[3]}"/>
    <circle cx="490" cy="905" r="18" fill="${c[3]}"/>
    <circle cx="710" cy="905" r="18" fill="${c[3]}"/>
  `;
}

function cabinet(c) {
  return `
    <rect x="260" y="470" width="680" height="380" rx="18" fill="${c[2]}"/>
    <line x1="600" y1="480" x2="600" y2="840" stroke="${c[3]}" stroke-width="6"/>
    <rect x="300" y="510" width="260" height="300" rx="8" fill="${c[3]}" opacity="0.35"/>
    <rect x="640" y="510" width="260" height="300" rx="8" fill="${c[3]}" opacity="0.35"/>
    <rect x="300" y="850" width="30" height="50" fill="${c[3]}"/>
    <rect x="870" y="850" width="30" height="50" fill="${c[3]}"/>
  `;
}

function lowCabinet(c) {
  return `
    <rect x="220" y="620" width="760" height="200" rx="16" fill="${c[2]}"/>
    <rect x="260" y="650" width="200" height="140" rx="8" fill="${c[3]}" opacity="0.35"/>
    <rect x="500" y="650" width="200" height="140" rx="8" fill="${c[3]}" opacity="0.35"/>
    <rect x="740" y="650" width="200" height="140" rx="8" fill="${c[3]}" opacity="0.35"/>
    <rect x="250" y="820" width="26" height="46" fill="${c[3]}"/>
    <rect x="924" y="820" width="26" height="46" fill="${c[3]}"/>
  `;
}

function shelf(c) {
  return `
    <rect x="330" y="330" width="540" height="560" rx="10" fill="none" stroke="${c[2]}" stroke-width="26"/>
    <line x1="343" y1="520" x2="857" y2="520" stroke="${c[2]}" stroke-width="20"/>
    <line x1="343" y1="700" x2="857" y2="700" stroke="${c[2]}" stroke-width="20"/>
    <rect x="380" y="410" width="60" height="90" fill="${c[3]}" opacity="0.5"/>
    <rect x="470" y="560" width="60" height="120" fill="${c[3]}" opacity="0.5"/>
  `;
}

function bed(c) {
  return `
    <rect x="180" y="560" width="840" height="300" rx="26" fill="${c[2]}"/>
    <rect x="180" y="380" width="840" height="220" rx="24" fill="${c[3]}"/>
    <rect x="250" y="600" width="300" height="150" rx="20" fill="${c[1]}"/>
    <rect x="650" y="600" width="300" height="150" rx="20" fill="${c[1]}"/>
    <rect x="200" y="860" width="34" height="70" fill="${c[3]}"/>
    <rect x="966" y="860" width="34" height="70" fill="${c[3]}"/>
  `;
}

function headboard(c) {
  return `
    <rect x="280" y="360" width="640" height="360" rx="26" fill="${c[2]}"/>
    <line x1="400" y1="370" x2="400" y2="710" stroke="${c[3]}" stroke-width="4" opacity="0.5"/>
    <line x1="520" y1="370" x2="520" y2="710" stroke="${c[3]}" stroke-width="4" opacity="0.5"/>
    <line x1="640" y1="370" x2="640" y2="710" stroke="${c[3]}" stroke-width="4" opacity="0.5"/>
    <line x1="760" y1="370" x2="760" y2="710" stroke="${c[3]}" stroke-width="4" opacity="0.5"/>
    <rect x="240" y="720" width="720" height="120" rx="14" fill="${c[3]}"/>
  `;
}

function nightstand(c) {
  return `
    <rect x="430" y="560" width="340" height="280" rx="16" fill="${c[2]}"/>
    <rect x="460" y="600" width="280" height="90" rx="8" fill="${c[3]}" opacity="0.4"/>
    <rect x="460" y="710" width="280" height="90" rx="8" fill="${c[3]}" opacity="0.4"/>
    <rect x="450" y="840" width="26" height="60" fill="${c[3]}"/>
    <rect x="724" y="840" width="26" height="60" fill="${c[3]}"/>
  `;
}

function lamp(c) {
  return `
    <path d="M360 880 C 360 500, 840 460, 840 380" fill="none" stroke="${c[2]}" stroke-width="20"/>
    <ellipse cx="360" cy="890" rx="90" ry="26" fill="${c[3]}"/>
    <path d="M800 330 L880 330 L910 420 L770 420 Z" fill="${c[2]}"/>
  `;
}

function mirror(c) {
  return `
    <circle cx="600" cy="600" r="230" fill="none" stroke="${c[2]}" stroke-width="26"/>
    <circle cx="600" cy="600" r="196" fill="${c[1]}"/>
    <path d="M470 720 L560 560 L620 640 L700 520 L740 720 Z" fill="${c[3]}" opacity="0.3"/>
  `;
}

function rug(c) {
  return `
    <rect x="240" y="470" width="720" height="470" rx="12" fill="${c[2]}"/>
    <rect x="290" y="520" width="620" height="370" rx="8" fill="none" stroke="${c[3]}" stroke-width="10"/>
    <path d="M300 700 L600 520 L900 700 L600 880 Z" fill="none" stroke="${c[3]}" stroke-width="10" opacity="0.6"/>
  `;
}

const KIND_FN = {
  sofa, armchair, table, roundTable, chair, officeChair, cabinet,
  lowCabinet, shelf, bed, headboard, nightstand, lamp, mirror, rug,
};

/* --------------------------- Composição SVG -------------------------- */

function scene({ kind, variant = 0, label = "", w = W, h = H }) {
  const c = PALETTES[variant % PALETTES.length];
  const draw = (KIND_FN[kind] ?? sofa)(c);
  const floorY = Math.round(h * 0.78);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 1200 1200" fill="none">
  <rect width="1200" height="1200" fill="${c[0]}"/>
  <rect y="${floorY}" width="1200" height="${1200 - floorY}" fill="${c[1]}"/>
  <circle cx="920" cy="230" r="120" fill="#ffffff" opacity="0.35"/>
  <g transform="translate(0, ${variant % 2 === 0 ? 0 : 12})">${draw}</g>
  ${label ? `<text x="60" y="1140" font-family="Georgia, serif" font-size="34" fill="${c[3]}" opacity="0.8">${label}</text>` : ""}
</svg>`;
}

function write(path, svg) {
  const full = join(OUT, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, svg.trim());
}

/* --------------------------- Manifesto ------------------------------ */

const PRODUCTS = [
  ["sofa-retratil-copenhague-3-lugares", "sofa"],
  ["sofa-oslo-3-lugares-boucle", "sofa"],
  ["sofa-lisboa-2-lugares", "sofa"],
  ["poltrona-nordica-com-puff", "armchair"],
  ["poltrona-giratoria-pod-couro-sintetico", "armchair"],
  ["rack-munique-tv-65", "lowCabinet"],
  ["painel-ripado-berlim-220", "shelf"],
  ["estante-bauhaus-5-prateleiras", "shelf"],
  ["aparador-vienna-palhinha", "cabinet"],
  ["mesa-centro-tokyo-redonda", "roundTable"],
  ["mesa-jantar-provence-6-lugares", "table"],
  ["mesa-jantar-redonda-milano-4-lugares", "roundTable"],
  ["kit-2-cadeiras-wishbone-trigo", "chair"],
  ["cadeira-estofada-charlotte", "chair"],
  ["buffet-toscana-4-portas", "cabinet"],
  ["kit-2-banquetas-bar-copenhague", "chair"],
  ["cama-box-casal-estocolmo-bau", "bed"],
  ["cama-queen-amsterdam-cabeceira-ripada", "bed"],
  ["guarda-roupa-madri-6-portas-espelho", "cabinet"],
  ["cabeceira-estofada-veludo-casal", "headboard"],
  ["par-criados-mudos-nordico-2-gavetas", "nightstand"],
  ["comoda-retro-4-gavetas", "lowCabinet"],
  ["escrivaninha-home-office-nova", "table"],
  ["cadeira-escritorio-ergonomica-ergo-pro", "officeChair"],
  ["estante-modular-grid-escritorio", "shelf"],
  ["luminaria-piso-arco", "lamp"],
  ["espelho-redondo-sol-80", "mirror"],
  ["tapete-berbere-geometrico-200x250", "rug"],
];

let count = 0;

for (const [slug, kind] of PRODUCTS) {
  for (let i = 1; i <= 3; i++) {
    write(`products/${slug}-${i}.svg`, scene({ kind, variant: i - 1 }));
    count++;
  }
}

const CATEGORY = [
  ["sala", "sofa", "Sala"],
  ["quarto", "bed", "Quarto"],
  ["cozinha", "table", "Cozinha"],
  ["escritorio", "officeChair", "Escritório"],
  ["decoracao", "lamp", "Decoração"],
];
for (const [slug, kind, label] of CATEGORY) {
  write(`categories/${slug}.svg`, scene({ kind, variant: 2, label, w: 900, h: 1200 }));
  count++;
}

const ROOMS = [
  ["sala", "sofa"],
  ["quarto", "bed"],
  ["cozinha", "table"],
  ["escritorio", "officeChair"],
];
for (const [slug, kind] of ROOMS) {
  write(`rooms/${slug}.svg`, scene({ kind, variant: 1 }));
  count++;
}

write("lifestyle/hero.svg", scene({ kind: "sofa", variant: 0 }));
write("lifestyle/promo.svg", scene({ kind: "armchair", variant: 3 }));
count += 2;

console.log(`✓ ${count} imagens placeholder geradas em public/images/`);
