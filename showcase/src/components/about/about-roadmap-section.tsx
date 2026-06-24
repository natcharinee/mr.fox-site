import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

export type RoadmapPhase = {
  phase: string;
  title: string;
  items: string[];
};

type AboutRoadmapSectionProps = {
  title: string;
  visualTitle: string;
  visualCaption: string;
  phases: RoadmapPhase[];
};

export function AboutRoadmapSection({
  title,
  visualTitle,
  visualCaption,
  phases,
}: AboutRoadmapSectionProps) {
  return (
    <section className="mt-12">
      <SectionHeading title={title} className="mb-6" />

      <div className="relative overflow-hidden rounded-3xl border border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-surface-container-lowest)] shadow-[0_24px_80px_rgba(42,36,24,0.18)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,194,14,0.14)_0%,transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 rounded-2xl border border-[#ffc20e]/15 sm:inset-5"
        />

        <div className="relative px-4 py-8 sm:px-8 sm:py-10">
          <p className="text-center text-xs font-semibold tracking-[0.28em] text-[#ffc20e]/80 uppercase">
            Mr.FOX
          </p>
          <h3 className="mt-2 text-center text-3xl font-extrabold tracking-[0.18em] sm:text-4xl">
            <span className="bg-gradient-to-r from-[var(--vulpine-primary-container)] via-[#ffb000] to-[#ff8c00] bg-clip-text font-display text-transparent">
              {visualTitle}
            </span>
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-base">
            {visualCaption}
          </p>

          <div className="relative mx-auto mt-8 max-w-md sm:max-w-lg lg:max-w-xl">
            <div className="overflow-hidden rounded-2xl border border-[#ffc20e]/25 bg-[#16120c] p-2 shadow-[inset_0_0_0_1px_rgba(255,194,14,0.08)]">
              <Image
                src="/about/mrfox-roadmap.jpg"
                alt={visualTitle}
                width={1200}
                height={9864}
                quality={95}
                priority
                className="h-auto w-full rounded-xl"
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 560px, 640px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {phases.map((phase, index) => (
          <article
            key={phase.phase}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-[var(--vulpine-outline-variant)]/50 bg-[var(--vulpine-surface-container)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--vulpine-primary-container)]/40 hover:shadow-md",
              index === 1 && "lg:-mt-1",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[var(--vulpine-primary-container)]/20 to-transparent"
            />
            <span className="inline-flex rounded-full border border-[var(--vulpine-primary-container)]/40 bg-[var(--vulpine-primary-container)]/15 px-3 py-1 text-xs font-bold tracking-wide text-[var(--vulpine-primary)] uppercase">
              {phase.phase}
            </span>
            <h4 className={`mt-3 text-lg font-bold ${publicTheme.cardTitle}`}>
              {phase.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className={`flex items-start gap-2.5 text-sm leading-relaxed ${publicTheme.muted}`}
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--vulpine-primary-container)]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
