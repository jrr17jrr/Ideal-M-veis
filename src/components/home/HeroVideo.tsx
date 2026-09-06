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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
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
    <div
      className={cn(
        "relative flex items-start bg-espresso",
        // altura: mobile ~560, tablet ~640, desktop 720-760 (full width)
        "min-h-[560px] pt-16 sm:min-h-[650px] sm:pt-20",
        "lg:min-h-[740px] lg:pt-24 xl:min-h-[770px] xl:pt-28",
        // espaço embaixo para o card de filtro sobrepor sem encostar no texto
        "pb-32 sm:pb-36 lg:pb-44",
      )}
    >
      {/* Poster — camada base, sempre presente */}
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

      {/* Overlay — escuro à esquerda (onde fica o texto), limpo à direita */}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-espresso/50 to-transparent" />

      {/* Conteúdo — mais alto e com mais respiro */}
      <Container className="relative z-10">
        <div className="max-w-[560px] lg:max-w-[640px]">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.3em] text-brand-light">
            Móveis que transformam
          </p>
          <h1 className="font-display text-[2.9rem] font-medium leading-[1.02] text-white sm:text-[3.75rem] lg:text-[4.75rem] xl:text-[5rem]">
            Sua casa,
            <br />
            <span className="text-brand">do seu jeito.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-stone-200 sm:text-lg">
            Qualidade, conforto e design para todos os ambientes da sua casa.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/produtos"
              className="inline-flex h-13 items-center justify-center rounded-full bg-brand px-9 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
            >
              Ver coleções
            </Link>
            <Link
              href="/ofertas"
              className="inline-flex h-13 items-center justify-center rounded-full border border-white/70 px-9 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Ofertas especiais
            </Link>
          </div>
        </div>
      </Container>

      {/* Controles do vídeo — discretos, à direita */}
      {showVideo && ready && (
        <div className="absolute bottom-32 right-4 z-10 flex gap-2 sm:bottom-36 sm:right-6 lg:bottom-48">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Desativar som"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            {muted ? <MutedGlyph /> : <SoundGlyph />}
          </button>
        </div>
      )}
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function SoundGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
function MutedGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  );
}
