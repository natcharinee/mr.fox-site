import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import {
  CATEGORY_ORDER,
  CATEGORY_THEME,
} from "@/components/platforms/platform-category-theme";
import { cn } from "@/lib/utils";

type PlatformType = {
  slug: string;
  name: string;
  concept: string | null;
  shortDescription: string | null;
  categorySlug: string;
  categoryName: string;
};

type HomePlatformTypesSectionProps = {
  title: string;
  description: string;
  viewAllLabel: string;
  exploreLabel: string;
  moreTypesLabel: string;
  categories: { slug: string; name: string }[];
  platformTypes: PlatformType[];
  previewCount?: number;
};

function countByCategory(platformTypes: PlatformType[]) {
  const counts: Record<string, number> = {};
  for (const pt of platformTypes) {
    counts[pt.categorySlug] = (counts[pt.categorySlug] ?? 0) + 1;
  }
  return counts;
}

export function HomePlatformTypesSection({
  title,
  description,
  viewAllLabel,
  exploreLabel,
  moreTypesLabel,
  categories,
  platformTypes,
  previewCount = 6,
}: HomePlatformTypesSectionProps) {
  const preview = platformTypes.slice(0, previewCount);
  const remaining = platformTypes.length - preview.length;
  const categoryCounts = countByCategory(platformTypes);
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  return (
    <section className="border-y border-white/5 bg-[var(--vulpine-surface-container-low)]/30 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-16">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="border-l-2 border-[var(--vulpine-primary-container)] pl-6">
            <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
              Standard Templates
            </p>
            <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--vulpine-on-surface-variant)]">{description}</p>
          </div>
          <LinkButton
            href="/platforms"
            variant="ghost"
            className="vulpine-label shrink-0 text-[var(--vulpine-primary-container)]"
          >
            {viewAllLabel} →
          </LinkButton>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((slug) => {
            const theme = CATEGORY_THEME[slug];
            const count = categoryCounts[slug] ?? 0;
            if (!theme || count === 0) return null;
            const Icon = theme.icon;

            return (
              <Link
                key={slug}
                href={`/platforms#category-${slug}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5",
                  theme.pill,
                )}
              >
                <Icon className="size-3.5" />
                {categoryBySlug[slug]?.name ?? slug}
                <span className="rounded-full bg-white/80 px-1.5 text-xs font-bold tabular-nums">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((pt) => {
            const theme = CATEGORY_THEME[pt.categorySlug] ?? CATEGORY_THEME.creator;
            const Icon = theme.icon;

            return (
              <Link key={pt.slug} href={`/platforms/${pt.slug}`} className="group block h-full">
                <article
                  className={cn(
                    "vulpine-hud-border vulpine-glow-hover relative flex h-full flex-col rounded-lg border border-white/8 bg-[rgba(18,20,20,0.4)] p-6 backdrop-blur-2xl transition-all hover:-translate-y-0.5",
                  )}
                >
                  <span className="vulpine-label mb-2 block text-[10px] text-[var(--vulpine-primary-container)] opacity-70">
                    DATA_TYPE: {pt.slug.replace(/-/g, "_").toUpperCase()}
                  </span>
                  <div className="absolute -top-1 -right-1 size-2 bg-[var(--vulpine-primary-container)] opacity-50" />
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                        theme.iconWrap,
                      )}
                    >
                      <Icon className="size-5" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-bold text-[var(--vulpine-on-surface)]">
                        {pt.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 flex-1 text-xs leading-relaxed text-[var(--vulpine-on-surface-variant)] opacity-80 line-clamp-2">
                    {pt.shortDescription ?? pt.concept}
                  </p>

                  <p
                    className={cn(
                      "vulpine-label mt-4 flex items-center gap-1 text-xs opacity-70 transition-all group-hover:gap-2 group-hover:opacity-100",
                      theme.accent,
                    )}
                  >
                    {exploreLabel}
                    <ArrowRight className="size-3.5" />
                  </p>
                </article>
              </Link>
            );
          })}
        </div>

        {remaining > 0 ? (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-5 py-4 sm:flex-row">
            <p className="text-sm text-[var(--vulpine-on-surface-variant)]">{moreTypesLabel}</p>
            <Link
              href="/platforms"
              className="vulpine-label inline-flex items-center gap-2 text-[var(--vulpine-primary-container)] transition-all hover:translate-x-1"
            >
              {viewAllLabel}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
