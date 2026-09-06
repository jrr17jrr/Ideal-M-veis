"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const POSTER = "/images/hero/hero-poster.jpg";
const VIDEO_DESKTOP = "/videos/hero-moveis.mp4";
const VIDEO_MOBILE = "/videos/hero-moveis-360.mp4";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [src, setSrc] = useState(VIDEO_DESKTOP);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Sem movimento => apenas o poster.
    if (reduce) return;
    setSrc(isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP);
    setShowVideo(true);
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <section className="relative flex min-h-[540px] items-center overflow-hidden bg-stone-900 sm:min-h-[600px] lg:h-[660px]">
      {/* Poster — camada base, sempre presente (nunca fica "quebrado") */}
      <Image
        src={POSTER}
        alt="Sala de estar moderna mobiliada com sofá, rack e mesa de centro"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Vídeo de fundo */}
      {showVideo && (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          onCanPlay={() => setReady(true)}
          onError={() => setShowVideo(false)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Overlay para legibilidade — sem escurecer demais */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/45 to-stone-950/10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950/50 to-transparent" />

      {/* Conteúdo */}
      <Container className="relative z-10 py-16 lg:py-0">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-light">
            Móveis que transformam
          </p>
          <h1 className="font-display text-[2.75rem] leading-[1.03] text-white sm:text-6xl lg:text-[4.25rem]">
            Sua casa,
            <br />
            <span className="text-brand-light">do seu jeito.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-stone-200 sm:text-lg">
            Qualidade, conforto e design para todos os ambientes da sua casa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/produtos"
              className="inline-flex h-13 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-wide text-stone-900 transition-colors hover:bg-stone-100"
            >
              Ver coleções
            </Link>
            <Link
              href="/ofertas"
              className="inline-flex h-13 items-center justify-center rounded-full border border-white/70 px-8 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Ofertas especiais
            </Link>
          </div>
        </div>
      </Container>

      {/* Controles personalizados do vídeo */}
      {showVideo && ready && (
        <div className="absolute bottom-5 right-4 z-10 flex gap-2 sm:right-6 lg:bottom-20">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Desativar som"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            {muted ? <MutedGlyph /> : <SoundGlyph />}
          </button>
        </div>
      )}
    </section>
  );
}

function PlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function SoundGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
function MutedGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  );
}
