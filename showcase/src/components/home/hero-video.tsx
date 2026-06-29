"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const HERO_VIDEO_MP4 = "/hero/hero%20banner%20mr.fox.mp4";

const frameClassName = cn(
  "relative mx-auto w-full",
  "lg:mx-0 lg:w-screen lg:max-w-none",
);

const shellClassName = cn(
  "relative w-full overflow-hidden bg-black",
  "aspect-[16/10] min-h-[min(58vh,520px)]",
  "md:mx-auto md:aspect-auto md:min-h-0 md:w-[340px] md:overflow-visible md:bg-transparent",
  "lg:aspect-[21/9] lg:w-screen lg:max-w-none lg:overflow-hidden lg:bg-black",
);

const mediaClassName = cn(
  "h-full w-full object-cover object-center [transform:translateZ(0)]",
  "rounded-none",
  "md:relative md:h-auto md:w-full md:rounded-[2.25rem] md:object-contain",
  "lg:absolute lg:inset-0 lg:h-full lg:w-full lg:min-h-full lg:min-w-full lg:rounded-none lg:object-cover lg:scale-[1.2]",
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
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-[var(--fox-gold)]/10 to-transparent blur-2xl md:hidden"
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
