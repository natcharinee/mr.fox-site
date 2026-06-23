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
    <section className="border-t border-[#f0e4c3] bg-gradient-to-b from-white/90 to-[var(--fox-cream)]/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-9 w-1 shrink-0 rounded-full bg-[var(--fox-gold)]" />
            <div>
              <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{title}</h2>
              <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
            </div>
          </div>
          <LinkButton
            href="/platforms"
            variant="ghost"
            className="shrink-0 text-[var(--fox-charcoal)]"
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
                    "flex h-full flex-col rounded-2xl border border-[#f0e4c3] border-l-4 bg-white p-5 shadow-sm transition-all duration-300",
                    theme.border,
                    theme.cardHover,
                    "hover:-translate-y-1 hover:shadow-lg",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        theme.iconWrap,
                      )}
                    >
                      <Icon className="size-5" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          theme.pill,
                        )}
                      >
                        {pt.categoryName}
                      </span>
                      <h3 className="mt-2 text-base font-bold leading-snug text-[var(--fox-charcoal)]">
                        {pt.name}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {pt.shortDescription ?? pt.concept}
                  </p>

                  <p
                    className={cn(
                      "mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider opacity-70 transition-all group-hover:gap-2 group-hover:opacity-100",
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
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e8d49a] bg-gradient-to-r from-[#fff8e1]/90 to-white px-5 py-4 sm:flex-row">
            <p className="text-sm font-medium text-[var(--fox-charcoal)]">
              {moreTypesLabel}
            </p>
            <Link
              href="/platforms"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fox-gold-dark)] transition-colors hover:text-[var(--fox-gold)]"
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
