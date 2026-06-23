"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/hero/mrfox-app-mockup@2x.png";
const HERO_VIDEO_MP4 = "/hero/Present-MrFOX-COIN-final.mp4";

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

export function HeroPhoneMockup() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!prefersReduced) {
      setShowVideo(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo || videoFailed) return;

    const tryPlay = () => {
      void video.play().catch(() => setVideoFailed(true));
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, [showVideo, videoFailed]);

  const useVideo = showVideo && !videoFailed;

  return (
    <div className={frameClassName}>
      <div
        className="pointer-events-none absolute -inset-6 rounded-full bg-[var(--fox-gold)]/20 blur-2xl md:-inset-8 lg:hidden"
        aria-hidden
      />

      <div className={shellClassName}>
        {useVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_IMAGE}
            aria-label="Mr.FOX app preview"
            className={mediaClassName}
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO_VIDEO_MP4} type="video/mp4" />
          </video>
        ) : (
          <>
            <Image
              src={HERO_IMAGE}
              alt="Mr.FOX app"
              width={560}
              height={1131}
              priority
              unoptimized
              sizes="(max-width: 1024px) 340px, 100vw"
              className={cn(mediaClassName, "lg:hidden")}
            />
            <Image
              src={HERO_IMAGE}
              alt="Mr.FOX app"
              fill
              priority
              unoptimized
              sizes="100vw"
              className={cn(mediaClassName, "hidden lg:block")}
            />
          </>
        )}
      </div>
    </div>
  );
}
