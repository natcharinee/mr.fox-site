"use client";

import { useEffect, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/home/hero-phone-mockup";
import { cn } from "@/lib/utils";

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
  const mockupTranslateY = -activeProgress * 120;
  const mockupScale = 1 - activeProgress * 0.03;
  const mockupOpacity = 1 - activeProgress * 0.25;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-visible py-1 sm:py-2",
        "lg:ml-[calc(50%-50vw)] lg:w-screen lg:max-w-[100vw] lg:overflow-hidden lg:py-0",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,194,14,0.22)_0%,rgba(255,194,14,0.06)_42%,transparent_72%)] blur-2xl",
          "h-[min(90vw,520px)] w-[min(90vw,520px)]",
          "md:h-[min(85vw,580px)] md:w-[min(85vw,580px)]",
          "lg:hidden",
        )}
      />

      <div
        className="relative z-10 w-full will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] lg:max-w-none"
        style={{
          transform: `translateY(${mockupTranslateY}px) scale(${mockupScale})`,
          opacity: mockupOpacity,
        }}
      >
        <HeroPhoneMockup />
      </div>
    </div>
  );
}
