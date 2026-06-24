import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
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

type Category = {
  slug: string;
  name: string;
  description: string | null;
};

type PlatformsCatalogProps = {
  categories: Category[];
  platformTypes: PlatformType[];
  viewDetailsLabel: string;
  typeCountLabel: (count: number) => string;
};

function groupByCategory(platformTypes: PlatformType[]) {
  const map = new Map<string, PlatformType[]>();
  for (const pt of platformTypes) {
    const list = map.get(pt.categorySlug) ?? [];
    list.push(pt);
    map.set(pt.categorySlug, list);
  }
  return map;
}

function gridClass(count: number) {
  if (count === 1) return "max-w-xl";
  if (count === 2) return "grid gap-4 sm:grid-cols-2";
  return "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";
}

export function PlatformsCatalog({
  categories,
  platformTypes,
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
              <span className="rounded-full bg-white/10 px-1.5 text-xs font-semibold tabular-nums">
                {count}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="space-y-14">
        {orderedCategories.map((category) => {
          const types = byCategory.get(category.slug) ?? [];
          if (types.length === 0) return null;

          const theme = CATEGORY_THEME[category.slug] ?? CATEGORY_THEME.creator;
          const Icon = theme.icon;

          return (
            <section
              key={category.slug}
              id={`category-${category.slug}`}
              className="scroll-mt-24"
            >
              <header
                className={cn(
                  "mb-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
                  theme.header,
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                      theme.iconWrap,
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className={cn("vulpine-label text-[10px]", theme.accent)}>
                      {typeCountLabel(types.length)}
                    </p>
                    <h2 className={`mt-1 text-xl sm:text-2xl ${publicTheme.cardTitle}`}>
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${publicTheme.muted}`}>
                        {category.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </header>

              <div className={gridClass(types.length)}>
                {types.map((pt, index) => (
                  <Link
                    key={pt.slug}
                    href={`/platforms/${pt.slug}`}
                    className={cn(types.length === 1 && "block")}
                  >
                    <article
                      className={cn(
                        themedCard(),
                        "group relative flex h-full flex-col overflow-hidden p-5",
                        theme.cardHover,
                      )}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-2 -right-1 text-5xl font-black tabular-nums text-white/[0.04]"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                            theme.pill,
                          )}
                        >
                          {pt.categoryName}
                        </span>
                      </div>

                      <h3 className={`mt-3 text-lg leading-snug ${publicTheme.cardTitle}`}>
                        {pt.name}
                      </h3>

                      <p className={`mt-2 flex-1 text-sm leading-relaxed ${publicTheme.muted}`}>
                        {pt.shortDescription ?? pt.concept}
                      </p>

                      {pt.shortDescription && pt.concept ? (
                        <p className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                          {pt.concept}
                        </p>
                      ) : null}

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
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
