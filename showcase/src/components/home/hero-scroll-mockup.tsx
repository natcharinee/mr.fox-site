"use client";

import { useEffect, useRef, useState } from "react";
import { HeroPhoneMockup } from "@/components/home/hero-phone-mockup";
import { cn } from "@/lib/utils";

function getScrollProgress(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const scrollRange = Math.max(rect.height * 0.7, 420);
  return Math.min(Math.max(-rect.top / scrollRange, 0), 1);
}

function HeroBackdropWord({
  children,
  align,
  style,
  wide = false,
}: {
  children: React.ReactNode;
  align: "left" | "right";
  style: React.CSSProperties;
  wide?: boolean;
}) {
  const sizeClass = wide
    ? "text-[clamp(3.25rem,13vw,10rem)] sm:text-[clamp(4rem,14vw,11rem)]"
    : "text-[clamp(2.75rem,10vw,7.5rem)] sm:text-[clamp(3.25rem,11vw,8.5rem)]";

  return (
    <div
      className={cn(
        "relative",
        align === "left" ? "justify-self-end text-right" : "justify-self-start text-left",
      )}
      style={style}
      aria-hidden
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 whitespace-nowrap font-black leading-[0.82] tracking-[-0.06em] text-[#ffc20e] opacity-50 blur-[20px] sm:blur-[32px]",
          sizeClass,
        )}
      >
        {children}
      </span>

      <span
        className={cn(
          "relative whitespace-nowrap font-black leading-[0.82] tracking-[-0.06em]",
          "bg-gradient-to-b from-[#fffdf5] via-[#ffd54f] to-[#b8860b] bg-clip-text text-transparent",
          "drop-shadow-[0_8px_32px_rgba(255,194,14,0.45)]",
          sizeClass,
        )}
        style={{
          WebkitTextStroke: "1.5px rgba(255, 214, 96, 0.22)",
        }}
      >
        {children}
      </span>

      <span
        className={cn(
          "pointer-events-none absolute inset-0 whitespace-nowrap font-black leading-[0.82] tracking-[-0.06em]",
          "bg-gradient-to-b from-white/50 via-white/10 to-transparent bg-clip-text text-transparent mix-blend-overlay",
          sizeClass,
        )}
      >
        {children}
      </span>
    </div>
  );
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
  const textOpacity = 0.78 + activeProgress * 0.22;
  const textScale = 0.94 + activeProgress * 0.1;
  const parallax = activeProgress * 24;

  const wordMotion = (side: "left" | "right") =>
    ({
      opacity: textOpacity,
      transform: `scale(${textScale}) translateX(${side === "left" ? -parallax : parallax}px)`,
    }) as const;

  return (
    <div ref={containerRef} className="relative w-full overflow-visible py-2 sm:py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,194,14,0.22)_0%,rgba(255,194,14,0.06)_42%,transparent_72%)] blur-2xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5 lg:gap-8">
        <HeroBackdropWord align="left" style={wordMotion("left")}>
          Mr.
        </HeroBackdropWord>

        <div
          className="relative z-10 justify-self-center will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{
            transform: `translateY(${mockupTranslateY}px) scale(${mockupScale})`,
            opacity: mockupOpacity,
          }}
        >
          <HeroPhoneMockup />
        </div>

        <HeroBackdropWord align="right" style={wordMotion("right")} wide>
          FOX
        </HeroBackdropWord>
      </div>
    </div>
  );
}
