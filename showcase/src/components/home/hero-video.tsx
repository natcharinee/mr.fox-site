"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const HERO_VIDEO_MP4 = "/hero/hero%20banner%20mr.fox.mp4";

const frameClassName = cn(
  "relative mx-auto",
  "w-[240px] sm:w-[280px] md:w-[340px]",
  "lg:mx-0 lg:w-screen lg:max-w-none",
);

const shellClassName = cn(
  "relative",
  "lg:aspect-[21/9] lg:w-screen lg:overflow-hidden lg:bg-black",
);

const mediaClassName = cn(
  "relative w-full [transform:translateZ(0)]",
  "rounded-[2rem] md:rounded-[2.25rem]",
  "h-auto",
  "lg:absolute lg:inset-0 lg:h-full lg:w-full lg:min-h-full lg:min-w-full",
  "lg:rounded-none lg:object-cover lg:object-center lg:scale-[1.2]",
);

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <div className={frameClassName}>
      <div
        className="pointer-events-none absolute -inset-6 rounded-full bg-[var(--fox-gold)]/20 blur-2xl md:-inset-8 lg:hidden"
        aria-hidden
      />

      <div className={shellClassName}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Mr.FOX app preview"
          className={mediaClassName}
        >
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
