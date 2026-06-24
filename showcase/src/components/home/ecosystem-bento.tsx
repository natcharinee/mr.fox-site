import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CATEGORY_THEME } from "@/components/platforms/platform-category-theme";
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

const LEFT_COLUMN = ["creator", "company"] as const;
const RIGHT_COLUMN = ["community", "contest", "exhibition"] as const;

const DARK_THEME: Record<
  string,
  { card: string; iconWrap: string; accent: string; itemHover: string }
> = {
  creator: {
    card: "border-[var(--fox-gold)]/20",
    iconWrap: "bg-[var(--fox-gold)]/15 text-[var(--fox-gold)]",
    accent: "text-[var(--fox-gold)]",
    itemHover: "hover:border-[var(--fox-gold)]/35 hover:bg-[var(--fox-gold)]/5",
  },
  community: {
    card: "border-teal-500/20",
    iconWrap: "bg-teal-500/15 text-teal-300",
    accent: "text-teal-300",
    itemHover: "hover:border-teal-500/35 hover:bg-teal-500/5",
  },
  company: {
    card: "border-slate-400/20",
    iconWrap: "bg-slate-400/15 text-slate-200",
    accent: "text-slate-200",
    itemHover: "hover:border-slate-400/35 hover:bg-white/5",
  },
  contest: {
    card: "border-rose-500/20",
    iconWrap: "bg-rose-500/15 text-rose-300",
    accent: "text-rose-300",
    itemHover: "hover:border-rose-500/35 hover:bg-rose-500/5",
  },
  exhibition: {
    card: "border-violet-500/20",
    iconWrap: "bg-violet-500/15 text-violet-300",
    accent: "text-violet-300",
    itemHover: "hover:border-violet-500/35 hover:bg-violet-500/5",
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
        "vulpine-hud-border vulpine-glow-hover flex h-full min-h-0 flex-col rounded-lg border border-white/8 bg-[rgba(18,20,20,0.4)] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all sm:p-8",
        dark.card,
      )}
    >
      <div className="flex items-start gap-4">
        {Icon ? (
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              dark.iconWrap,
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-bold uppercase text-[var(--vulpine-on-surface)]">
            {category.name}
          </h3>
            <span
              className={cn(
                "vulpine-label rounded-sm border px-3 py-1 text-[10px] tabular-nums",
                dark.iconWrap,
              )}
            >
              {types.length} MODULES
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            {category.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            dark.accent,
          )}
        >
          {includesLabel}
        </p>
        <ul className="mt-3 flex flex-1 flex-col gap-2">
          {types.map((pt) => (
            <li key={pt.slug} className="flex-1">
              <Link
                href={`/platforms/${pt.slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors",
                  dark.itemHover,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{pt.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/50">
                      {pt.shortDescription ?? pt.concept}
                    </p>
                    {pt.concept && pt.shortDescription ? (
                      <p className="mt-2 text-xs leading-relaxed text-white/35">
                        {pt.concept}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "vulpine-label mt-0.5 inline-flex shrink-0 items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100",
                      dark.accent,
                    )}
                  >
                    {viewPlatformLabel}
                    <ArrowRight className="size-3.5" aria-hidden />
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
        "grid gap-5",
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

  return (
    <section className="px-4 py-16 md:px-16 md:py-24" id="ecosystem">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 border-l-2 border-[var(--vulpine-primary-container)] pl-6">
          <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
            System Architecture
          </p>
          <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--vulpine-on-surface-variant)]">{description}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          <CategoryColumn
            slugs={LEFT_COLUMN}
            bySlug={bySlug}
            platformTypes={platformTypes}
            includesLabel={includesLabel}
            viewPlatformLabel={viewPlatformLabel}
            rowCount={2}
          />
          <CategoryColumn
            slugs={RIGHT_COLUMN}
            bySlug={bySlug}
            platformTypes={platformTypes}
            includesLabel={includesLabel}
            viewPlatformLabel={viewPlatformLabel}
            rowCount={3}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/platforms"
            className="vulpine-label inline-flex items-center gap-2 text-[var(--vulpine-primary-container)] transition-all hover:translate-x-1"
          >
            {viewAllLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
