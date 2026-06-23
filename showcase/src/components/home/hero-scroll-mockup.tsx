"use client";

import { useEffect, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/home/hero-phone-mockup";

function getScrollProgress(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const scrollRange = Math.max(rect.height * 0.7, 420);
  return Math.min(Math.max(-rect.top / scrollRange, 0), 1);
}

export function HeroScrollMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    let ticking = false;

    const update = () => {
      const section = containerRef.current?.closest("section");
      if (!section) return;
      setProgress(getScrollProgress(section));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  const activeProgress = reduceMotion ? 0 : progress;
  const mockupTranslateY = -activeProgress * 320;
  const mockupScale = 1 - activeProgress * 0.06;
  const mockupOpacity = 1 - activeProgress * 0.45;

  return (
    <div ref={containerRef} className="relative w-full overflow-visible py-2 sm:py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,194,14,0.22)_0%,rgba(255,194,14,0.06)_42%,transparent_72%)] blur-2xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl justify-center overflow-visible px-2 sm:px-4">
        <div
          className="relative z-10 will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{
            transform: `translateY(${mockupTranslateY}px) scale(${mockupScale})`,
            opacity: mockupOpacity,
          }}
        >
          <HeroPhoneMockup />
        </div>
      </div>
    </div>
  );
}
