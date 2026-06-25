"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import {
  CATEGORY_ORDER,
  CATEGORY_THEME,
} from "@/components/platforms/platform-category-theme";
import { cn } from "@/lib/utils";

type Category = {
  name: string;
  slug: string;
  description: string | null;
};

type PlatformType = {
  slug: string;
  name: string;
  categorySlug: string;
  concept: string | null;
  shortDescription: string | null;
};

type FlowLabels = {
  mrfox: string;
  category: string;
  platformType: string;
  application: string;
  feature: string;
  download: string;
};

type EcosystemBentoProps = {
  title: string;
  description: ReactNode;
  architectureLabel: string;
  includesLabel: string;
  viewPlatformLabel: string;
  viewAllLabel: string;
  flowLabels: FlowLabels;
  categories: Category[];
  platformTypes: PlatformType[];
};

function categoryTypes(types: PlatformType[], slug: string) {
  return types.filter((t) => t.categorySlug === slug);
}

function ArchitectureFlow({ labels }: { labels: FlowLabels }) {
  const steps = [
    labels.mrfox,
    labels.category,
    labels.platformType,
    labels.application,
    labels.feature,
    labels.download,
  ];

  return (
    <div
      className="mt-6 overflow-x-auto rounded-xl border border-white/8 bg-black/20 px-4 py-3 backdrop-blur-sm"
      aria-label="Ecosystem architecture"
    >
      <ol className="flex min-w-max items-center gap-1.5 text-xs sm:text-sm">
        {steps.map((label, index) => (
          <li key={label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1 font-medium",
                index === 0
                  ? "bg-[var(--vulpine-primary-container)]/20 text-[var(--vulpine-primary)]"
                  : "bg-white/5 text-white/70",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 ? (
              <ChevronRight
                className="size-3.5 shrink-0 text-white/25"
                aria-hidden
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function CategoryTabs({
  categories,
  categoryCounts,
  activeSlug,
  onSelect,
}: {
  categories: Record<string, Category>;
  categoryCounts: Record<string, number>;
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  const indicatorClass: Record<string, string> = {
    creator: "bg-[var(--vulpine-primary-container)]",
    community: "bg-teal-400",
    company: "bg-slate-300",
    contest: "bg-rose-400",
    exhibition: "bg-violet-400",
  };

  return (
    <div className="relative mt-8">
      <div
        className={cn(
          "absolute -left-4 top-2 bottom-2 w-1 rounded-full transition-colors duration-300 sm:-left-6",
          indicatorClass[activeSlug] ?? "bg-[var(--vulpine-primary-container)]",
        )}
        aria-hidden
      />

      <div
        role="tablist"
        aria-label="Platform categories"
        className="flex flex-wrap gap-2.5"
      >
        {CATEGORY_ORDER.map((slug) => {
          const theme = CATEGORY_THEME[slug];
          const category = categories[slug];
          const count = categoryCounts[slug] ?? 0;
          if (!theme || !category || count === 0) return null;

          const Icon = theme.icon;
          const isActive = slug === activeSlug;

          return (
            <button
              key={slug}
              type="button"
              role="tab"
              id={`ecosystem-tab-${slug}`}
              aria-selected={isActive}
              aria-controls={`ecosystem-panel-${slug}`}
              onClick={() => onSelect(slug)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                isActive
                  ? cn(theme.pill, "shadow-[0_0_20px_rgba(255,184,0,0.12)]")
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/80",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {category.name}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs font-bold tabular-nums",
                  isActive
                    ? "bg-[var(--vulpine-primary-container)] text-[var(--vulpine-on-primary)]"
                    : "bg-white/10 text-white/70",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPanel({
  slug,
  category,
  types,
  includesLabel,
  viewPlatformLabel,
}: {
  slug: string;
  category: Category;
  types: PlatformType[];
  includesLabel: string;
  viewPlatformLabel: string;
}) {
  const t = useTranslations("home");
  const theme = CATEGORY_THEME[slug];
  const Icon = theme?.icon;

  return (
    <article
      id={`ecosystem-panel-${slug}`}
      role="tabpanel"
      aria-labelledby={`ecosystem-tab-${slug}`}
      className="vulpine-glow-hover relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(18,20,20,0.55)] shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent",
          theme?.header,
        )}
        aria-hidden
      />

      <div className="relative border-b border-white/8 px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-5">
          {Icon ? (
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/10",
                theme?.iconWrap,
              )}
            >
              <Icon className="size-7" aria-hidden />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-2xl">
                {category.name}
              </h3>
              <span
                className={cn(
                  "vulpine-label rounded-lg border px-3 py-1.5 text-[11px] tabular-nums sm:text-xs",
                  theme?.iconWrap,
                )}
              >
                {t("ecosystemModules", { count: types.length })}
              </span>
            </div>
            {category.description ? (
              <p className="mt-3 text-base leading-relaxed text-white/65 sm:text-[17px]">
                {category.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative px-6 py-5 sm:px-8 sm:py-6">
        <p
          className={cn(
            "vulpine-label text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm",
            theme?.accent,
          )}
        >
          {includesLabel}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {types.map((pt) => (
            <li key={pt.slug}>
              <Link
                href={`/platforms/${pt.slug}`}
                className={cn(
                  "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all sm:p-5",
                  theme?.cardHover,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-base font-bold text-white sm:text-lg">
                    {pt.name}
                  </p>
                  <span
                    className={cn(
                      "vulpine-label inline-flex shrink-0 items-center gap-1.5 text-xs opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:text-sm",
                      theme?.accent,
                    )}
                  >
                    {viewPlatformLabel}
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
                {pt.shortDescription ? (
                  <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">
                    {pt.shortDescription}
                  </p>
                ) : null}
                {pt.concept ? (
                  <p className="mt-2 text-sm leading-relaxed text-white/40">
                    {pt.concept}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function EcosystemBento({
  title,
  description,
  architectureLabel,
  includesLabel,
  viewPlatformLabel,
  viewAllLabel,
  flowLabels,
  categories,
  platformTypes,
}: EcosystemBentoProps) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const categoryCounts = Object.fromEntries(
    CATEGORY_ORDER.map((slug) => [
      slug,
      categoryTypes(platformTypes, slug).length,
    ]),
  );

  const firstAvailable =
    CATEGORY_ORDER.find((slug) => (categoryCounts[slug] ?? 0) > 0 && bySlug[slug]) ??
    CATEGORY_ORDER[0];

  const [activeSlug, setActiveSlug] = useState(firstAvailable);
  const activeCategory = bySlug[activeSlug];
  const activeTypes = categoryTypes(platformTypes, activeSlug);

  return (
    <section
      className="relative overflow-hidden border-y border-white/5 bg-[var(--vulpine-surface-container-low)]/20 px-4 py-16 md:px-16 md:py-24"
      id="ecosystem"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,184,0,0.08),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,184,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,184,0,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="border-l-4 border-[var(--vulpine-primary-container)] pl-6 sm:pl-8">
          <p className="vulpine-label mb-3 text-sm text-[var(--vulpine-primary-container)] sm:text-base">
            {architectureLabel}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase sm:text-4xl md:text-[2.75rem] md:leading-tight">
            {title}
          </h2>
          <div className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-lg">
            {description}
          </div>

          <ArchitectureFlow labels={flowLabels} />
        </div>

        <CategoryTabs
          categories={bySlug}
          categoryCounts={categoryCounts}
          activeSlug={activeSlug}
          onSelect={setActiveSlug}
        />

        {activeCategory && activeTypes.length > 0 ? (
          <div className="mt-6 animate-in fade-in duration-300">
            <CategoryPanel
              key={activeSlug}
              slug={activeSlug}
              category={activeCategory}
              types={activeTypes}
              includesLabel={includesLabel}
              viewPlatformLabel={viewPlatformLabel}
            />
          </div>
        ) : null}

        <div className="mt-10 flex justify-center sm:mt-12">
          <LinkButton
            href="/platforms"
            variant="outline"
            className="vulpine-label gap-2 border-[var(--vulpine-primary-container)]/40 px-6 py-2.5 text-sm text-[var(--vulpine-primary-container)] hover:bg-[var(--vulpine-primary-container)]/10 sm:text-base"
          >
            {viewAllLabel}
            <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
