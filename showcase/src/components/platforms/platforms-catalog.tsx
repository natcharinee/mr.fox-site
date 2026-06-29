import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { publicTheme } from "@/components/layout/public-theme";
import {
  CATEGORY_ORDER,
  CATEGORY_THEME,
} from "@/components/platforms/platform-category-theme";
import {
  PlatformTypeOverview,
  type PlatformTypeDetailContent,
} from "@/components/platforms/platform-type-overview";
import { isActivePlatformTypeSlug } from "@/lib/platform-type-slugs";
import { cn } from "@/lib/utils";

type PlatformType = {
  slug: string;
  name: string;
  concept: string | null;
  shortDescription: string | null;
  categorySlug: string;
  categoryName: string;
};

type Category = {
  slug: string;
  name: string;
  description: string | null;
};

type PlatformsCatalogProps = {
  categories: Category[];
  platformTypes: PlatformType[];
  typeDetails: Record<string, PlatformTypeDetailContent>;
  viewDetailsLabel: string;
  typeCountLabel: (count: number) => string;
};

function groupByCategory(platformTypes: PlatformType[]) {
  const map = new Map<string, PlatformType[]>();
  for (const pt of platformTypes) {
    if (!isActivePlatformTypeSlug(pt.slug)) continue;
    const list = map.get(pt.categorySlug) ?? [];
    list.push(pt);
    map.set(pt.categorySlug, list);
  }
  return map;
}

export function PlatformsCatalog({
  categories,
  platformTypes,
  typeDetails,
  viewDetailsLabel,
  typeCountLabel,
}: PlatformsCatalogProps) {
  const byCategory = groupByCategory(platformTypes);
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const orderedCategories = CATEGORY_ORDER.map((slug) => categoryBySlug[slug]).filter(
    Boolean,
  ) as Category[];

  return (
    <div className={cn(publicTheme.content, "scroll-smooth")}>
      <nav
        aria-label="Platform categories"
        className="mb-10 flex flex-wrap gap-2"
      >
        {orderedCategories.map((category) => {
          const theme = CATEGORY_THEME[category.slug] ?? CATEGORY_THEME.creator;
          const Icon = theme.icon;
          const count = byCategory.get(category.slug)?.length ?? 0;
          if (count === 0) return null;

          return (
            <a
              key={category.slug}
              href={`#category-${category.slug}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors hover:brightness-110",
                theme.pill,
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {category.name}
              <span className="rounded-full bg-[var(--vulpine-primary-container)] px-1.5 text-xs font-semibold tabular-nums text-[var(--vulpine-on-primary)]">
                {count}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="space-y-16 sm:space-y-20">
        {orderedCategories.map((category) => {
          const types = byCategory.get(category.slug) ?? [];
          if (types.length === 0) return null;

          const theme = CATEGORY_THEME[category.slug] ?? CATEGORY_THEME.creator;
          const Icon = theme.icon;

          return (
            <section
              key={category.slug}
              id={`category-${category.slug}`}
              className="scroll-mt-24 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(18,20,20,0.45)] shadow-[0_12px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            >
              <header
                className={cn(
                  "relative overflow-hidden border-b border-white/8 p-6 sm:p-8",
                  theme.header,
                )}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[var(--vulpine-primary-container)]/12 blur-3xl"
                  aria-hidden
                />
                <div className="relative flex items-start gap-5">
                  <div
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-2xl sm:size-16",
                      theme.iconWrap,
                    )}
                  >
                    <Icon className="size-7 sm:size-8" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "vulpine-label text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm",
                        theme.accent,
                      )}
                    >
                      {typeCountLabel(types.length)}
                    </p>
                    <h2 className="font-display mt-2 text-2xl font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-3xl">
                      {category.name}
                    </h2>
                    {types[0]?.name ? (
                      <p className={cn("mt-2 text-lg font-semibold sm:text-xl", theme.accent)}>
                        {types[0].name}
                      </p>
                    ) : null}
                    {category.description ? (
                      <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--vulpine-on-surface)] sm:text-lg">
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </header>

              <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
                {types.map((pt) => {
                  const detail = typeDetails[pt.slug];

                  if (detail) {
                    return (
                      <div key={pt.slug}>
                        <PlatformTypeOverview
                          content={detail}
                          categorySlug={category.slug}
                          variant="catalog"
                        />
                        <Link
                          href={`/platforms/${pt.slug}`}
                          className={cn(
                            "mt-8 inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all",
                            "border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/10",
                            theme.accent,
                            "hover:border-[var(--vulpine-primary-container)]/55 hover:bg-[var(--vulpine-primary-container)]/16 hover:gap-2.5",
                          )}
                        >
                          {viewDetailsLabel}
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={pt.slug}
                      href={`/platforms/${pt.slug}`}
                      className="block"
                    >
                      <article
                        className={cn(
                          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[rgba(18,20,20,0.4)] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all hover:-translate-y-0.5 vulpine-glow-hover",
                          theme.cardHover,
                        )}
                      >
                        <h3 className={`text-lg leading-snug ${publicTheme.cardTitle}`}>
                          {pt.name}
                        </h3>
                        <p className={`mt-2 flex-1 text-sm leading-relaxed ${publicTheme.muted}`}>
                          {pt.shortDescription ?? pt.concept}
                        </p>
                        <p
                          className={cn(
                            "mt-4 flex items-center gap-1.5 text-sm font-medium transition-colors",
                            theme.accent,
                            "group-hover:gap-2.5",
                          )}
                        >
                          {viewDetailsLabel}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </p>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
