import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVGs are used only for local development placeholder art.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Domains liberados para quando as imagens reais forem plugadas
    // (fotos de produtos hospedadas no Supabase Storage, Unsplash, etc).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
