"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HERO_IMAGE = "/hero/mrfox-app-mockup@2x.png";
const HERO_VIDEO_MP4 = "/hero/Present-MrFOX-COIN-final.mp4";

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
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      <div className="pointer-events-none absolute -inset-6 rounded-full bg-[var(--fox-gold)]/20 blur-2xl" />

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
          className="relative h-auto w-full rounded-[2rem] [transform:translateZ(0)]"
          onError={() => setVideoFailed(true)}
        >
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={HERO_IMAGE}
          alt="Mr.FOX app"
          width={560}
          height={1131}
          priority
          unoptimized
          sizes="(max-width: 640px) 240px, 280px"
          className="relative h-auto w-full [transform:translateZ(0)]"
        />
      )}
    </div>
  );
}
