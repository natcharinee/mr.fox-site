"use client";

import { ArrowRight, Download, Layers, Smartphone, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { VulpineEyebrow } from "@/components/vulpine/vulpine-primitives";
import { HeroScrollVideo } from "@/components/home/hero-scroll-video";
import { MRFOX_APP_DOWNLOAD_URL } from "@/lib/app-download";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  badge: string;
  brandName: string;
  title: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  pillars: [string, string, string];
  explorePlatforms: string;
  downloadApps: string;
};

const pillarIcons = [Layers, Sparkles, Smartphone] as const;

export function HomeHero({
  badge,
  brandName,
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  pillars,
  explorePlatforms,
  downloadApps,
}: HomeHeroProps) {
  return (
    <section className="relative overflow-x-clip border-b border-white/5">
      <div className="vulpine-scanline" aria-hidden />

      <div className="relative">
        <HeroScrollVideo />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[var(--vulpine-background)] via-[var(--vulpine-background)]/85 to-transparent sm:h-36 lg:h-44"
        />
      </div>

      <div className="relative z-30 mx-auto max-w-4xl px-4 pb-16 pt-6 text-center sm:px-6 md:px-16 md:pt-4 lg:-mt-16 lg:pb-20">
        <VulpineEyebrow className="mb-6">{badge}</VulpineEyebrow>

        <p className="font-display text-3xl font-extrabold tracking-tight text-[var(--vulpine-primary-container)] drop-shadow-[0_0_8px_rgba(255,184,0,0.35)] sm:text-4xl lg:text-5xl">
          {brandName}
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-wide text-[var(--vulpine-on-surface)] uppercase sm:text-4xl lg:text-5xl">
          {title}{" "}
          <span className="text-[var(--vulpine-primary-container)] drop-shadow-[0_0_8px_rgba(255,184,0,0.45)]">
            {titleHighlight}
          </span>{" "}
          {titleSuffix}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--vulpine-on-surface-variant)] opacity-90 sm:text-lg">
          {subtitle}
        </p>

        <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[index];
            return (
              <li
                key={pillar}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-[var(--vulpine-on-surface)] sm:text-base"
              >
                <Icon
                  className="size-3.5 shrink-0 text-[var(--vulpine-primary-container)]"
                  aria-hidden
                />
                {pillar}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <LinkButton
            href="/platforms"
            size="lg"
            className="vulpine-label vulpine-btn-glow rounded-xl bg-[var(--vulpine-primary-container)] text-[var(--vulpine-on-primary)] hover:brightness-110"
          >
            {explorePlatforms}
            <ArrowRight className="ml-2 size-4" />
          </LinkButton>
          <a
            href={MRFOX_APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "vulpine-label rounded-xl border-white/10 bg-white/5 text-[var(--vulpine-on-surface)] hover:bg-white/10",
            )}
          >
            <Download className="mr-2 size-4" />
            {downloadApps}
          </a>
        </div>
      </div>
    </section>
  );
}
