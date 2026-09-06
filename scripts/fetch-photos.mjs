/**
 * Baixa os ASSETS de mídia da loja para `public/`:
 *  - Fotos (Pexels — licença livre para uso, sem atribuição obrigatória)
 *  - Vídeo do hero (Mixkit — Mixkit License, uso livre inclusive comercial,
 *    permitido como fundo de site)
 *
 * Uso:  node scripts/fetch-photos.mjs   (--force para rebaixar tudo)
 *
 * Tudo é versionado no repositório para o site não depender de CDN externo.
 * Para trocar um asset: altere o ID/URL no MANIFEST/VIDEOS e rode de novo.
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images");
const PUBLIC = join(ROOT, "public");

const px = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

/* -------------------------------------------------------------------------- */
/*  MANIFEST — { caminho relativo em public/images : url }                     */
/* -------------------------------------------------------------------------- */

const SQ = [900, 900]; // produto (quadrado)
const TILE = [900, 1125]; // card de categoria / ambiente (4:5)
const WIDE = [1600, 1000]; // hero / banner (16:10)
const WBAN = [1200, 900]; // banner lateral (4:3)

const MANIFEST = {
  /* ---------------- Hero + banners + ambientes ---------------- */
  "banners/renove-sua-casa.jpg": px(2343469, ...WBAN),
  "banners/ofertas.jpg": px(34277650, ...WIDE),

  "rooms/sala.jpg": px(34688219, ...TILE),
  "rooms/jantar.jpg": px(14598479, ...TILE),
  "rooms/quarto.jpg": px(8082562, ...TILE),
  "rooms/cozinha.jpg": px(6310320, ...TILE),
  "rooms/escritorio.jpg": px(10922370, ...TILE),
  "rooms/varanda.jpg": px(3063047, ...TILE),
  "rooms/decoracao.jpg": px(34438566, ...TILE),

  /* ---------------- Cards "compre por categoria" ---------------- */
  "categories/sofas.jpg": px(276746, ...TILE),
  "categories/poltronas.jpg": px(33646085, ...TILE),
  "categories/mesas.jpg": px(2995012, ...TILE),
  "categories/cadeiras.jpg": px(30650069, ...TILE),
  "categories/camas.jpg": px(19980080, ...TILE),
  "categories/guarda-roupas.jpg": px(3315286, ...TILE),
  "categories/racks-paineis.jpg": px(1714433, ...TILE),
  "categories/quartos.jpg": px(6903157, ...TILE),
  "categories/escritorio.jpg": px(22711217, ...TILE),
  "categories/decoracao.jpg": px(38094563, ...TILE),

  /* Cards das 5 categorias reais do catálogo (data/categories.ts) */
  "categories/cat-sala.jpg": px(6980724, ...TILE),
  "categories/cat-quarto.jpg": px(6186822, ...TILE),
  "categories/cat-cozinha.jpg": px(6748972, ...TILE),
  "categories/cat-escritorio.jpg": px(5824550, ...TILE),
  "categories/cat-decoracao.jpg": px(5490337, ...TILE),

  /* ---------------------------- Produtos ---------------------------- */
  // Sala
  "products/sofa-retratil-copenhague-3-lugares.jpg": px(16501662, ...SQ),
  "products/sofa-retratil-copenhague-3-lugares-2.jpg": px(36816986, ...SQ),
  "products/sofa-oslo-3-lugares-boucle.jpg": px(8135275, ...SQ),
  "products/sofa-oslo-3-lugares-boucle-2.jpg": px(3105219, ...SQ),
  "products/sofa-lisboa-2-lugares.jpg": px(7018400, ...SQ),
  "products/sofa-lisboa-2-lugares-2.jpg": px(6588592, ...SQ),
  "products/poltrona-nordica-com-puff.jpg": px(4278985, ...SQ),
  "products/poltrona-nordica-com-puff-2.jpg": px(8066334, ...SQ),
  "products/poltrona-giratoria-pod-couro-sintetico.jpg": px(14110168, ...SQ),
  "products/poltrona-giratoria-pod-couro-sintetico-2.jpg": px(33646085, ...SQ),
  "products/rack-munique-tv-65.jpg": px(5710708, ...SQ),
  "products/rack-munique-tv-65-2.jpg": px(5755711, ...SQ),
  "products/painel-ripado-berlim-220.jpg": px(6636320, ...SQ),
  "products/painel-ripado-berlim-220-2.jpg": px(6580372, ...SQ),
  "products/estante-bauhaus-5-prateleiras.jpg": px(32471851, ...SQ),
  "products/estante-bauhaus-5-prateleiras-2.jpg": px(1565245, ...SQ),
  "products/aparador-vienna-palhinha.jpg": px(6480207, ...SQ),
  "products/aparador-vienna-palhinha-2.jpg": px(6963787, ...SQ),
  "products/mesa-centro-tokyo-redonda.jpg": px(6661224, ...SQ),
  "products/mesa-centro-tokyo-redonda-2.jpg": px(30440152, ...SQ),

  // Cozinha / jantar
  "products/mesa-jantar-provence-6-lugares.jpg": px(4221404, ...SQ),
  "products/mesa-jantar-provence-6-lugares-2.jpg": px(6310320, ...SQ),
  "products/mesa-jantar-redonda-milano-4-lugares.jpg": px(2995012, ...SQ),
  "products/mesa-jantar-redonda-milano-4-lugares-2.jpg": px(34357853, ...SQ),
  "products/kit-2-cadeiras-wishbone-trigo.jpg": px(7180275, ...SQ),
  "products/kit-2-cadeiras-wishbone-trigo-2.jpg": px(29962487, ...SQ),
  "products/cadeira-estofada-charlotte.jpg": px(33058942, ...SQ),
  "products/cadeira-estofada-charlotte-2.jpg": px(38750873, ...SQ),
  "products/buffet-toscana-4-portas.jpg": px(7195588, ...SQ),
  "products/buffet-toscana-4-portas-2.jpg": px(7195582, ...SQ),
  "products/kit-2-banquetas-bar-copenhague.jpg": px(5530255, ...SQ),
  "products/kit-2-banquetas-bar-copenhague-2.jpg": px(38369488, ...SQ),

  // Quarto
  "products/cama-box-casal-estocolmo-bau.jpg": px(6903214, ...SQ),
  "products/cama-box-casal-estocolmo-bau-2.jpg": px(6489093, ...SQ),
  "products/cama-queen-amsterdam-cabeceira-ripada.jpg": px(6934170, ...SQ),
  "products/cama-queen-amsterdam-cabeceira-ripada-2.jpg": px(8135505, ...SQ),
  "products/guarda-roupa-madri-6-portas-espelho.jpg": px(6508343, ...SQ),
  "products/guarda-roupa-madri-6-portas-espelho-2.jpg": px(7535012, ...SQ),
  "products/cabeceira-estofada-veludo-casal.jpg": px(34574606, ...SQ),
  "products/cabeceira-estofada-veludo-casal-2.jpg": px(7511702, ...SQ),
  "products/par-criados-mudos-nordico-2-gavetas.jpg": px(9819647, ...SQ),
  "products/par-criados-mudos-nordico-2-gavetas-2.jpg": px(2082095, ...SQ),
  "products/comoda-retro-4-gavetas.jpg": px(11643074, ...SQ),
  "products/comoda-retro-4-gavetas-2.jpg": px(17271982, ...SQ),

  // Escritório
  "products/escrivaninha-home-office-nova.jpg": px(36123565, ...SQ),
  "products/escrivaninha-home-office-nova-2.jpg": px(373904, ...SQ),
  "products/cadeira-escritorio-ergonomica-ergo-pro.jpg": px(12269763, ...SQ),
  "products/cadeira-escritorio-ergonomica-ergo-pro-2.jpg": px(5483245, ...SQ),
  "products/estante-modular-grid-escritorio.jpg": px(7167083, ...SQ),
  "products/estante-modular-grid-escritorio-2.jpg": px(34438566, ...SQ),

  // Decoração
  "products/luminaria-piso-arco.jpg": px(11850174, ...SQ),
  "products/luminaria-piso-arco-2.jpg": px(6078545, ...SQ),
  "products/espelho-redondo-sol-80.jpg": px(15269290, ...SQ),
  "products/espelho-redondo-sol-80-2.jpg": px(8218186, ...SQ),
  "products/tapete-berbere-geometrico-200x250.jpg": px(6835168, ...SQ),
  "products/tapete-berbere-geometrico-200x250-2.jpg": px(18038065, ...SQ),
  "products/jogo-almofadas-decorativas.jpg": px(1239221, ...SQ),
  "products/jogo-almofadas-decorativas-2.jpg": px(6312055, ...SQ),
  "products/trio-vasos-ceramicos-fosco.jpg": px(33126633, ...SQ),
  "products/trio-vasos-ceramicos-fosco-2.jpg": px(6969835, ...SQ),
  "products/kit-3-quadros-decorativos-moldura.jpg": px(32106611, ...SQ),
  "products/kit-3-quadros-decorativos-moldura-2.jpg": px(707580, ...SQ),

  // Área externa
  "products/conjunto-varanda-firenze-4-lugares.jpg": px(8041135, ...SQ),
  "products/conjunto-varanda-firenze-4-lugares-2.jpg": px(12715508, ...SQ),
  "products/espreguicadeira-deck-malibu.jpg": px(2771923, ...SQ),
  "products/espreguicadeira-deck-malibu-2.jpg": px(2961945, ...SQ),

  /* ---- Fotos por variação de cor (galeria acompanha a cor escolhida) ---- */
  "products/variants/sofa-copenhague-cinza.jpg": px(1239298, ...SQ),
  "products/variants/sofa-copenhague-grafite.jpg": px(6970049, ...SQ),
  "products/variants/sofa-oslo-verde-musgo.jpg": px(4846097, ...SQ),
  "products/variants/poltrona-nordica-mostarda.jpg": px(14100420, ...SQ),

  /* Poster do vídeo do hero (frame extraído do próprio vídeo Mixkit 3090) */
  "hero/hero-poster.jpg": "https://assets.mixkit.co/videos/3090/3090-thumb-720-0.jpg",
};

/* ---------------------------------------------------------------------------
 *  Vídeo de fundo do hero — Mixkit "Modern living room with wooden furniture".
 *  Alternativas: 3091 (minimalist room with wooden furniture), 3110 (gray sofa).
 *  Basta trocar o ID e rodar de novo.
 * ------------------------------------------------------------------------- */
const VIDEOS = {
  "videos/hero-moveis.mp4": "https://assets.mixkit.co/videos/3090/3090-720.mp4",
  "videos/hero-moveis-360.mp4": "https://assets.mixkit.co/videos/3090/3090-360.mp4",
};

/* -------------------------------------------------------------------------- */

async function download(url, dest, tries = 3, minBytes = 5000) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (build script)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < minBytes)
        throw new Error(`arquivo muito pequeno (${buf.length}b)`);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, buf);
      return buf.length;
    } catch (err) {
      if (i === tries) throw err;
      await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
}

const force = process.argv.includes("--force");
let ok = 0;
let bytes = 0;
const failed = [];

const jobs = [
  ...Object.entries(MANIFEST).map(([rel, url]) => ({ base: OUT, rel, url })),
  ...Object.entries(VIDEOS).map(([rel, url]) => ({
    base: PUBLIC,
    rel,
    url,
    min: 100_000,
  })),
];

for (const { base, rel, url, min } of jobs) {
  const dest = join(base, rel);
  if (!force && existsSync(dest) && statSync(dest).size > (min ?? 5000)) {
    ok++;
    bytes += statSync(dest).size;
    continue;
  }
  try {
    const size = await download(url, dest, 3, min ?? 5000);
    ok++;
    bytes += size;
    process.stdout.write(".");
  } catch (err) {
    failed.push(`${rel}  <-  ${url}\n    ${err.message}`);
    process.stdout.write("x");
  }
}

console.log(
  `\n\n✓ ${ok}/${jobs.length} assets (${(bytes / 1e6).toFixed(1)} MB) em public/`,
);
if (failed.length) {
  console.log(`\n✗ ${failed.length} falharam:\n` + failed.join("\n"));
  process.exit(1);
}
