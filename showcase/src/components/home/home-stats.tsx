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
  icon,
  active,
  delayMs,
}: HomeStatItem & { active: boolean; delayMs: number }) {
  const count = useCountUp(value, active, delayMs);
  const Icon: LucideIcon = ICONS[icon];

  return (
    <div className="rounded-2xl border border-[#f0e4c3] bg-[var(--fox-cream)] px-4 py-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#fff4cc] text-[var(--fox-gold-dark)]">
        <Icon className="size-5" />
      </div>
      <p className="text-3xl font-bold tabular-nums text-[var(--fox-charcoal)]">
        {count.toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function HomeStats({ items }: HomeStatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-[#f0e4c3] bg-white/70">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 lg:gap-6 lg:px-8"
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
