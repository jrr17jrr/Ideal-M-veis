import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // As fotos ficam versionadas em `public/images/` (baixadas por
    // `scripts/fetch-photos.mjs`). Os domínios abaixo ficam liberados para
    // quando as imagens reais forem servidas do Supabase Storage / CDN.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
