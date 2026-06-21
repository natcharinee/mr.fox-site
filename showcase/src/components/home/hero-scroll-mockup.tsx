"use client";

import { useEffect, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/home/hero-phone-mockup";

function getScrollProgress(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const scrollRange = Math.max(rect.height * 0.7, 420);
  return Math.min(Math.max(-rect.top / scrollRange, 0), 1);
}

const backdropTextClass =
  "whitespace-nowrap font-black leading-none tracking-[-0.05em] text-[#ffc20e]/55 sm:text-[#ffe08a]/60 text-[clamp(2.25rem,9vw,6.5rem)]";

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
  const textOpacity = 0.5 + activeProgress * 0.5;
  const textScale = 1 + activeProgress * 0.03;

  const backdropStyle = {
    opacity: textOpacity,
    transform: `scale(${textScale})`,
    WebkitTextStroke: "1px rgba(184, 134, 11, 0.18)",
  } as const;

  return (
    <div ref={containerRef} className="relative w-full overflow-visible py-4">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5 lg:gap-8">
        <p
          className={`${backdropTextClass} pointer-events-none justify-self-end select-none`}
          style={backdropStyle}
          aria-hidden
        >
          Mr.
        </p>

        <div
          className="relative z-10 justify-self-center will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{
            transform: `translateY(${mockupTranslateY}px) scale(${mockupScale})`,
            opacity: mockupOpacity,
          }}
        >
          <HeroPhoneMockup />
        </div>

        <p
          className={`${backdropTextClass} pointer-events-none justify-self-start select-none`}
          style={backdropStyle}
          aria-hidden
        >
          FOX
        </p>
      </div>
    </div>
  );
}
