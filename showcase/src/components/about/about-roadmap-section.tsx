import Image from "next/image";
import { Check, Globe2, Rocket, Sprout, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

export type RoadmapPhaseStatus = "done" | "active" | "upcoming";

export type RoadmapPhase = {
  era: string;
  phase: string;
  title: string;
  summary: string;
  items: string[];
  status: RoadmapPhaseStatus;
};

type AboutRoadmapSectionProps = {
  title: string;
  phasesTitle: string;
  phasesSubtitle: string;
  visualTitle: string;
  visualCaption: string;
  statusLabels: Record<RoadmapPhaseStatus, string>;
  phases: RoadmapPhase[];
};

const PHASE_ICONS = [Sprout, Rocket, Globe2] as const;
const STATUS_STYLES: Record<
  RoadmapPhaseStatus,
  { badge: string; dot: string; ring: string }
> = {
  done: {
    badge:
      "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
    ring: "border-emerald-400/30",
  },
  active: {
    badge:
      "border-[var(--vulpine-primary-container)]/45 bg-[var(--vulpine-primary-container)]/15 text-[var(--vulpine-primary-container)]",
    dot: "bg-[var(--vulpine-primary-container)] shadow-[0_0_14px_rgba(255,184,0,0.7)]",
    ring: "border-[var(--vulpine-primary-container)]/50",
  },
  upcoming: {
    badge: "border-white/15 bg-white/5 text-[var(--vulpine-on-surface-variant)]",
    dot: "bg-white/35",
    ring: "border-white/10",
  },
};

function PhaseCard({
  phase,
  statusLabel,
  icon: Icon,
  elevated = false,
}: {
  phase: RoadmapPhase;
  statusLabel: string;
  icon: LucideIcon;
  elevated?: boolean;
}) {
  const styles = STATUS_STYLES[phase.status];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-[var(--vulpine-surface-container)] p-5 shadow-sm backdrop-blur-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        styles.ring,
        elevated &&
          "lg:-translate-y-2 lg:shadow-[0_24px_60px_rgba(255,184,0,0.08)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-[var(--vulpine-primary-container)]/18 to-transparent"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border",
                "border-[var(--vulpine-primary-container)]/25 bg-[var(--vulpine-primary-container)]/10",
                "text-[var(--vulpine-primary-container)]",
              )}
            >
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-[var(--vulpine-primary-container)] sm:text-3xl">
              {phase.era}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide uppercase sm:text-sm",
              styles.badge,
            )}
          >
            {statusLabel}
          </span>
        </div>

        <span className="mt-4 inline-flex rounded-full border border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/10 px-3 py-1 text-xs font-bold tracking-wide text-[var(--vulpine-primary)] uppercase sm:text-sm">
          {phase.phase}
        </span>

        <h4 className={`mt-3 text-lg font-bold ${publicTheme.cardTitle}`}>
          {phase.title}
        </h4>
        <p className={`mt-2 text-sm leading-relaxed ${publicTheme.muted}`}>
          {phase.summary}
        </p>

        <ul className="mt-4 space-y-2.5 border-t border-white/8 pt-4">
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
      </div>
    </article>
  );
}

export function AboutRoadmapSection({
  title,
  phasesTitle,
  phasesSubtitle,
  visualTitle,
  visualCaption,
  statusLabels,
  phases,
}: AboutRoadmapSectionProps) {
  return (
    <section className="mt-16">
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
          <p className="text-center text-sm font-semibold tracking-[0.28em] text-[#ffc20e]/80 uppercase">
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

      <div className="mt-10">
        <div className="mb-6 max-w-2xl">
          <h3 className={`font-display text-lg font-bold tracking-wide uppercase ${publicTheme.cardTitle}`}>
            {phasesTitle}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed sm:text-base ${publicTheme.muted}`}>
            {phasesSubtitle}
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute top-12 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-[var(--vulpine-primary-container)]/35 to-transparent lg:block"
          />

          <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {phases.map((phase, index) => {
              const Icon = PHASE_ICONS[index] ?? Rocket;
              return (
                <div key={phase.phase} className="relative">
                  <div
                    aria-hidden
                    className={cn(
                      "absolute top-12 left-1/2 z-10 hidden size-3 -translate-x-1/2 rounded-full lg:block",
                      STATUS_STYLES[phase.status].dot,
                    )}
                  />
                  <PhaseCard
                    phase={phase}
                    statusLabel={statusLabels[phase.status]}
                    icon={Icon}
                    elevated={phase.status === "active"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
