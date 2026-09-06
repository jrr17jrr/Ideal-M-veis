"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setPlaying(true);
      return;
    }

    video.pause();
    setPlaying(false);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div
      className={cn(
        "relative bg-espresso",
        // Mantém sensação cinematográfica sem empurrar o filtro para fora da primeira tela.
        "min-h-[590px] sm:min-h-[620px] lg:min-h-[630px] xl:min-h-[650px] 2xl:min-h-[690px]",
      )}
    >
      <Image
        src={POSTER}
        alt="Sala de estar moderna mobiliada com sofá, rack e mesa de centro"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

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

      {/* Overlay concentrado na esquerda; o ambiente continua vivo e visível. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,19,13,0.88)_0%,rgba(37,24,16,0.69)_30%,rgba(37,24,16,0.28)_58%,rgba(37,24,16,0.05)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

      {/* Conteúdo mais largo e menos espremido. */}
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-20 xl:px-16 xl:pt-24">
        <div className="max-w-[690px]">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#E3A066] sm:text-[13px]">
            Móveis que transformam
          </p>

          <h1 className="font-display text-[3.25rem] font-medium leading-[0.98] tracking-[-0.025em] text-white sm:text-[4rem] lg:text-[4.85rem] xl:text-[5.35rem]">
            Sua casa,
            <br />
            <span className="text-[#D98243]">do seu jeito.</span>
          </h1>

          <p className="mt-6 max-w-[560px] text-base leading-7 text-white/88 sm:text-lg sm:leading-8">
            Qualidade, conforto e design para transformar cada ambiente da sua casa com mais personalidade.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/produtos"
              className="inline-flex h-13 min-w-[180px] items-center justify-center rounded-xl bg-[#D98243] px-8 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#BF6E34]"
            >
              Ver coleções
            </Link>
            <Link
              href="/ofertas"
              className="inline-flex h-13 min-w-[190px] items-center justify-center rounded-xl border border-white/75 bg-black/10 px-8 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Ofertas especiais
            </Link>
          </div>
        </div>
      </div>

      {showVideo && ready && (
        <div className="absolute bottom-40 right-5 z-10 flex gap-2 sm:right-8 lg:bottom-44 lg:right-10 xl:right-14">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
          >
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Desativar som"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function SoundGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}

function MutedGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  );
}
