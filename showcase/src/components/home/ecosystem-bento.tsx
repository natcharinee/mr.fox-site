import { ArrowRight } from "lucide-react";
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

type EcosystemBentoProps = {
  title: string;
  description: string;
  includesLabel: string;
  viewPlatformLabel: string;
  viewAllLabel: string;
  categories: Category[];
  platformTypes: PlatformType[];
};

const COLUMN_LAYOUT: { slugs: readonly string[]; rowCount: 2 | 3 }[] = [
  { slugs: ["creator", "company"], rowCount: 2 },
  { slugs: ["community", "contest", "exhibition"], rowCount: 3 },
];

const ITEM_HOVER =
  "hover:border-[var(--vulpine-primary-container)]/30 hover:bg-[var(--vulpine-primary-container)]/6";
const CARD_GLOW = "from-[var(--vulpine-primary-container)]/8";

const DARK_THEME: Record<
  string,
  { iconWrap: string; accent: string; itemHover: string; glow: string }
> = {
  creator: {
    iconWrap: "bg-[var(--fox-gold)]/15 text-[var(--fox-gold)]",
    accent: "text-[var(--fox-gold)]",
    itemHover: ITEM_HOVER,
    glow: CARD_GLOW,
  },
  community: {
    iconWrap: "bg-[var(--vulpine-primary-container)]/12 text-[var(--vulpine-primary-container)]",
    accent: "text-[var(--vulpine-primary-container)]",
    itemHover: ITEM_HOVER,
    glow: CARD_GLOW,
  },
  company: {
    iconWrap: "bg-[var(--vulpine-primary-container)]/12 text-[var(--vulpine-primary-container)]",
    accent: "text-[var(--vulpine-primary-container)]",
    itemHover: ITEM_HOVER,
    glow: CARD_GLOW,
  },
  contest: {
    iconWrap: "bg-[var(--vulpine-primary-container)]/12 text-[var(--vulpine-primary-container)]",
    accent: "text-[var(--vulpine-primary-container)]",
    itemHover: ITEM_HOVER,
    glow: CARD_GLOW,
  },
  exhibition: {
    iconWrap: "bg-[var(--vulpine-primary-container)]/12 text-[var(--vulpine-primary-container)]",
    accent: "text-[var(--vulpine-primary-container)]",
    itemHover: ITEM_HOVER,
    glow: CARD_GLOW,
  },
};

function categoryTypes(types: PlatformType[], slug: string) {
  return types.filter((t) => t.categorySlug === slug);
}

function CategoryCard({
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
  const theme = CATEGORY_THEME[slug];
  const dark = DARK_THEME[slug];
  const Icon = theme?.icon;

  return (
    <article
      className={cn(
        "vulpine-glow-hover relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgba(18,20,20,0.55)] shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent",
          dark.glow,
        )}
        aria-hidden
      />

      <div className="relative border-b border-white/8 px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-5">
          {Icon ? (
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/10",
                dark.iconWrap,
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
                  dark.iconWrap,
                )}
              >
                {types.length} MODULES
              </span>
            </div>
            <p className="mt-3 text-base leading-relaxed text-white/65 sm:text-[17px]">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col px-6 py-5 sm:px-8 sm:py-6">
        <p
          className={cn(
            "vulpine-label text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm",
            dark.accent,
          )}
        >
          {includesLabel}
        </p>
        <ul className="mt-4 flex flex-1 flex-col gap-3">
          {types.map((pt) => (
            <li key={pt.slug}>
              <Link
                href={`/platforms/${pt.slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all sm:p-5",
                  dark.itemHover,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-white sm:text-lg">{pt.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">
                      {pt.shortDescription ?? pt.concept}
                    </p>
                    {pt.concept && pt.shortDescription ? (
                      <p className="mt-2 text-sm leading-relaxed text-white/40">
                        {pt.concept}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "vulpine-label mt-1 inline-flex shrink-0 items-center gap-1.5 text-xs opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:text-sm",
                      dark.accent,
                    )}
                  >
                    {viewPlatformLabel}
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CategoryColumn({
  slugs,
  bySlug,
  platformTypes,
  includesLabel,
  viewPlatformLabel,
  rowCount,
}: {
  slugs: readonly string[];
  bySlug: Record<string, Category>;
  platformTypes: PlatformType[];
  includesLabel: string;
  viewPlatformLabel: string;
  rowCount: 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        rowCount === 2 && "lg:grid-rows-2 lg:h-full",
        rowCount === 3 && "lg:grid-rows-3 lg:h-full",
      )}
    >
      {slugs.map((slug) => {
        const category = bySlug[slug];
        if (!category) return null;

        return (
          <CategoryCard
            key={slug}
            slug={slug}
            category={category}
            types={categoryTypes(platformTypes, slug)}
            includesLabel={includesLabel}
            viewPlatformLabel={viewPlatformLabel}
          />
        );
      })}
    </div>
  );
}

export function EcosystemBento({
  title,
  description,
  includesLabel,
  viewPlatformLabel,
  viewAllLabel,
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
        <div className="mb-10 border-l-4 border-[var(--vulpine-primary-container)] pl-6 sm:mb-12 sm:pl-8">
          <p className="vulpine-label mb-3 text-sm text-[var(--vulpine-primary-container)] sm:text-base">
            System Architecture
          </p>
          <h2 className="font-display text-3xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase sm:text-4xl md:text-[2.75rem] md:leading-tight">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-lg">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {CATEGORY_ORDER.map((slug) => {
              const theme = CATEGORY_THEME[slug];
              const count = categoryCounts[slug] ?? 0;
              const category = bySlug[slug];
              if (!theme || !category || count === 0) return null;
              const Icon = theme.icon;

              return (
                <span
                  key={slug}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium",
                    theme.pill,
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {category.name}
                  <span className="rounded-full bg-[var(--vulpine-primary-container)] px-1.5 text-xs font-bold tabular-nums text-[var(--vulpine-on-primary)]">
                    {count}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-7">
          {COLUMN_LAYOUT.map(({ slugs, rowCount }) => (
            <CategoryColumn
              key={slugs.join("-")}
              slugs={slugs}
              bySlug={bySlug}
              platformTypes={platformTypes}
              includesLabel={includesLabel}
              viewPlatformLabel={viewPlatformLabel}
              rowCount={rowCount}
            />
          ))}
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
