import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import {
  CATEGORY_ORDER,
  CATEGORY_THEME,
} from "@/components/platforms/platform-category-theme";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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

type EcosystemBentoProps = {
  title: string;
  description: ReactNode;
  architectureLabel: string;
  includesLabel: string;
  viewPlatformLabel: string;
  viewAllLabel: string;
  categories: Category[];
  platformTypes: PlatformType[];
  modulesLabelFor: (count: number) => string;
};

function categoryTypes(types: PlatformType[], slug: string) {
  return types.filter((t) => t.categorySlug === slug);
}

function CategoryLegend({
  categories,
  categoryCounts,
}: {
  categories: Record<string, Category>;
  categoryCounts: Record<string, number>;
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-2.5" aria-label="Ecosystem categories overview">
      {CATEGORY_ORDER.map((slug) => {
        const theme = CATEGORY_THEME[slug];
        const category = categories[slug];
        const count = categoryCounts[slug] ?? 0;
        if (!theme || !category || count === 0) return null;

        const Icon = theme.icon;

        return (
          <div
            key={slug}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium",
              theme.pill,
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {category.name}
            <span className="rounded-full bg-black/20 px-1.5 text-xs font-bold tabular-nums">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CategoryCard({
  slug,
  category,
  types,
  includesLabel,
  viewPlatformLabel,
  modulesLabel,
}: {
  slug: string;
  category: Category;
  types: PlatformType[];
  includesLabel: string;
  viewPlatformLabel: string;
  modulesLabel: string;
}) {
  const theme = CATEGORY_THEME[slug];
  const Icon = theme?.icon;

  return (
    <article
      id={`ecosystem-${slug}`}
      className={cn(
        "vulpine-glow-hover relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgba(18,20,20,0.55)] shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl md:flex-row md:items-stretch",
        theme?.cardHover,
      )}
    >
      <div
        className={cn(
          "relative px-5 py-5 sm:px-6 sm:py-6",
          "border-b border-white/8 md:w-[min(100%,280px)] md:shrink-0 md:self-stretch md:border-b-0 md:border-r md:border-white/8 lg:w-72",
          theme?.header,
        )}
      >
        <div className="flex items-start gap-4">
          {Icon ? (
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 sm:size-14 sm:rounded-2xl",
                theme?.iconWrap,
              )}
            >
              <Icon className="size-6 sm:size-7" aria-hidden />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-xl">
                {category.name}
              </h3>
              <span
                className={cn(
                  "vulpine-label rounded-lg border px-2.5 py-1 text-xs tabular-nums sm:text-sm",
                  theme?.iconWrap,
                )}
              >
                {modulesLabel}
              </span>
            </div>
            {category.description ? (
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-base">
                {category.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col px-5 py-4 sm:px-6 sm:py-5">
        <p
          className={cn(
            "vulpine-label text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm",
            theme?.accent,
          )}
        >
          {includesLabel}
        </p>
        <ul className="mt-3 flex flex-1 flex-col gap-2.5">
          {types.map((pt) => (
            <li key={pt.slug} className="min-w-0">
              <Link
                href={`/platforms/${pt.slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-all sm:p-4",
                  theme?.cardHover,
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--vulpine-on-surface)] sm:text-base">
                    {pt.name}
                  </p>
                  <span
                    className={cn(
                      "vulpine-label inline-flex shrink-0 items-center gap-1 text-xs opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:text-sm",
                      theme?.accent,
                    )}
                  >
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </div>
                {pt.shortDescription ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] line-clamp-3">
                    {pt.shortDescription}
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
  categories,
  platformTypes,
  modulesLabelFor,
}: EcosystemBentoProps) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const categoryCounts = Object.fromEntries(
    CATEGORY_ORDER.map((slug) => [
      slug,
      categoryTypes(platformTypes, slug).length,
    ]),
  );

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

          <CategoryLegend categories={bySlug} categoryCounts={categoryCounts} />
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:gap-6">
          {CATEGORY_ORDER.map((slug) => {
            const category = bySlug[slug];
            if (!category) return null;

            const types = categoryTypes(platformTypes, slug);
            if (types.length === 0) return null;

            return (
              <CategoryCard
                key={slug}
                slug={slug}
                category={category}
                types={types}
                includesLabel={includesLabel}
                viewPlatformLabel={viewPlatformLabel}
                modulesLabel={modulesLabelFor(types.length)}
              />
            );
          })}
        </div>

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
