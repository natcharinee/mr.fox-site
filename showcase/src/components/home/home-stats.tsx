"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Layers,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  layers: Layers,
  zap: Zap,
  sparkles: Sparkles,
  download: Download,
} as const;

export type HomeStatItem = {
  label: string;
  value: number;
  icon: keyof typeof ICONS;
  display?: string;
};

type HomeStatsProps = {
  items: HomeStatItem[];
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, active: boolean, delayMs = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const duration = 1200;
    const startAt = performance.now() + delayMs;

    const tick = (now: number) => {
      if (now < startAt) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - startAt) / duration, 1);
      setCount(Math.round(easeOutCubic(progress) * target));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, delayMs]);

  return count;
}

function StatCard({
  label,
  value,
  display,
  active,
  delayMs,
}: HomeStatItem & { active: boolean; delayMs: number }) {
  const count = useCountUp(display ? 0 : value, active && !display, delayMs);

  const shown =
    display ??
    `${count.toLocaleString()}${label.toLowerCase().includes("download") && count >= 1000 ? "+" : ""}`;

  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold tabular-nums text-[var(--vulpine-primary-container)] drop-shadow-[0_0_5px_rgba(255,184,0,0.3)] md:text-4xl">
        {shown}
      </div>
      <div className="vulpine-label mt-2 text-[var(--vulpine-on-surface-variant)]">
        {label}
      </div>
    </div>
  );
}

export function HomeStats({ items }: HomeStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => setActive(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        start();
        observer.disconnect();
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative border-y border-white/5 bg-[var(--vulpine-surface-container-lowest)]/50 py-12 md:py-16">
      <div
        ref={ref}
        className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-4 md:grid-cols-4 md:gap-8 md:px-16"
      >
        {items.map((item, index) => (
          <StatCard
            key={item.label}
            {...item}
            active={active}
            delayMs={index * 80}
          />
        ))}
      </div>
    </section>
  );
}
