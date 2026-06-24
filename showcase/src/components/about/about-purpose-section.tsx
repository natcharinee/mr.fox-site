import { Compass, Eye, Layers, Sparkles, Target, Users, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

export type AboutPurposeBlock = {
  label: string;
  headline: string;
  body: string;
  highlights: string[];
};

export type AboutValueItem = {
  title: string;
  description: string;
};

export type AboutPurposeContent = {
  eyebrow: string;
  sectionTitle: string;
  vision: AboutPurposeBlock;
  mission: AboutPurposeBlock;
  valuesTitle: string;
  values: AboutValueItem[];
};

const VALUE_ICONS = [Users, Layers, Sparkles] as const;

type PurposePanelProps = AboutPurposeBlock & {
  index: string;
  icon: LucideIcon;
  featured?: boolean;
};

function PurposePanel({
  index,
  label,
  headline,
  body,
  highlights,
  icon: Icon,
  featured = false,
}: PurposePanelProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-6 sm:p-8",
        "border-[var(--vulpine-outline-variant)]/45 bg-[var(--vulpine-surface-container)]/80",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm",
        "transition-all duration-300 hover:border-[var(--vulpine-primary-container)]/45 hover:shadow-[0_24px_70px_rgba(255,184,0,0.08)]",
        featured ? "w-full" : "h-full w-full",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300",
          featured
            ? "bg-[var(--vulpine-primary-container)]/25 opacity-100 group-hover:opacity-100"
            : "bg-[var(--vulpine-primary-container)]/15 opacity-70 group-hover:opacity-100",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,194,14,0.06)_0%,transparent_42%)]"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-2xl border",
                "border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/12",
                "text-[var(--vulpine-primary-container)] shadow-[0_0_20px_rgba(255,184,0,0.12)]",
              )}
            >
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="vulpine-label text-[var(--vulpine-primary-container)]">{label}</p>
              <p className="mt-0.5 font-display text-4xl font-bold leading-none text-white/10">
                {index}
              </p>
            </div>
          </div>
        </div>

        <h3
          className={cn(
            "mt-6 font-display font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase",
            featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
          )}
        >
          {headline}
        </h3>

        <p
          className={cn(
            "mt-4 leading-relaxed text-[var(--vulpine-on-surface-variant)]",
            featured ? "text-base sm:text-lg" : "text-sm sm:text-base",
          )}
        >
          {body}
        </p>

        <ul className="mt-6 space-y-3">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-relaxed text-[var(--vulpine-on-surface)]"
            >
              <span
                aria-hidden
                className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--vulpine-primary-container)] shadow-[0_0_8px_rgba(255,184,0,0.65)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function AboutPurposeSection({ content }: { content: AboutPurposeContent }) {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--vulpine-primary-container)]/50 to-transparent"
      />

      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.sectionTitle}
        className="mb-8"
      />

      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <PurposePanel index="01" icon={Eye} featured {...content.vision} />
        </div>
        <div className="flex lg:col-span-5">
          <PurposePanel index="02" icon={Target} {...content.mission} />
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <Compass className="size-4 text-[var(--vulpine-primary-container)]" aria-hidden />
          <h3 className={`font-display text-sm font-bold tracking-[0.2em] uppercase ${publicTheme.cardTitle}`}>
            {content.valuesTitle}
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {content.values.map((value, index) => {
            const Icon = VALUE_ICONS[index] ?? Sparkles;
            return (
              <article
                key={value.title}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5",
                  "transition-all hover:border-[var(--vulpine-primary-container)]/30 hover:bg-white/[0.05]",
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-[var(--vulpine-primary-container)]/10 blur-2xl"
                />
                <Icon
                  className="size-5 text-[var(--vulpine-primary-container)]"
                  aria-hidden
                />
                <h4 className={`mt-4 text-base font-bold ${publicTheme.cardTitle}`}>
                  {value.title}
                </h4>
                <p className={`mt-2 text-sm leading-relaxed ${publicTheme.muted}`}>
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
