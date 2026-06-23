import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
  typeCountLabel: string;
  viewPlatformLabel: string;
  viewAllLabel: string;
  categories: Category[];
  platformTypes: PlatformType[];
};

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

export function EcosystemBento({
  title,
  description,
  includesLabel,
  typeCountLabel,
  viewPlatformLabel,
  viewAllLabel,
  categories,
  platformTypes,
}: EcosystemBentoProps) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  return (
    <section className="bg-[var(--fox-charcoal)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CATEGORY_ORDER.map((slug) => {
            const category = bySlug[slug];
            const types = categoryTypes(platformTypes, slug);
            const theme = CATEGORY_THEME[slug];
            const dark = DARK_THEME[slug];
            const Icon = theme?.icon;

            if (!category) return null;

            return (
              <article
                key={slug}
                className={cn(
                  "flex flex-col rounded-3xl border bg-[#1c1c1c] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6",
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
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                          dark.iconWrap,
                        )}
                      >
                        {typeCountLabel.replace("{count}", String(types.length))}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex-1">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      dark.accent,
                    )}
                  >
                    {includesLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {types.map((pt) => (
                      <li key={pt.slug}>
                        <Link
                          href={`/platforms/${pt.slug}`}
                          className={cn(
                            "group block rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors",
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
                                "mt-0.5 inline-flex shrink-0 items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100",
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
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fox-gold)] transition-colors hover:text-[var(--fox-gold)]/80"
          >
            {viewAllLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
