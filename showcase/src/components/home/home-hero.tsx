"use client";

import { ArrowRight, Download } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ParticleHero } from "@/components/ui/particle-hero";
import { HeroScrollMockup } from "@/components/home/hero-scroll-mockup";

type HomeHeroProps = {
  badge: string;
  title: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  explorePlatforms: string;
  downloadApps: string;
};

export function HomeHero({
  badge,
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  explorePlatforms,
  downloadApps,
}: HomeHeroProps) {
  return (
    <section className="relative min-h-[115vh] overflow-x-clip border-b border-[#2a2418] sm:min-h-[110vh] lg:min-h-0 lg:overflow-x-hidden">
      <ParticleHero className="min-h-[inherit] lg:min-h-0 lg:overflow-visible lg:px-0">
        <HeroScrollMockup />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-24 lg:pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-[#5c4a12] bg-[#ffc20e]/15 text-[#ffe08a] hover:bg-[#ffc20e]/15">
              {badge}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-[#fff8e8] sm:text-5xl lg:text-6xl">
              {title}{" "}
              <span className="text-[var(--fox-gold)]">{titleHighlight}</span> {titleSuffix}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#c9b98a]">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton
                href="/platforms"
                size="lg"
                className="bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold)]/90"
              >
                {explorePlatforms}
                <ArrowRight className="ml-2 size-4" />
              </LinkButton>
              <a
                href="https://link.mrfox.app"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-[#5c4a12] bg-transparent text-[#fff4cc] hover:bg-[#ffc20e]/10",
                )}
              >
                <Download className="mr-2 size-4" />
                {downloadApps}
              </a>
            </div>
          </div>
        </div>
      </ParticleHero>
    </section>
  );
}
