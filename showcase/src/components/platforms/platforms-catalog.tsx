import {
  ArrowRight,
  Building2,
  CalendarRange,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = [
  "creator",
  "community",
  "company",
  "contest",
  "exhibition",
] as const;

type CategoryTheme = {
  icon: LucideIcon;
  header: string;
  iconWrap: string;
  pill: string;
  cardHover: string;
  accent: string;
};

const CATEGORY_THEME: Record<string, CategoryTheme> = {
  creator: {
    icon: Sparkles,
    header: "border-[#e8d49a] bg-gradient-to-br from-[#fff8e1] to-white",
    iconWrap: "bg-[#fff4cc] text-[var(--fox-gold-dark)]",
    pill: "border-[#e8d49a] bg-[#fff4cc]/80 text-[var(--fox-gold-dark)]",
    cardHover: "hover:border-[var(--fox-gold)]/45 hover:shadow-[var(--fox-gold)]/10",
    accent: "text-[var(--fox-gold-dark)]",
  },
  community: {
    icon: Users,
    header: "border-teal-200 bg-gradient-to-br from-teal-50 to-white",
    iconWrap: "bg-teal-100 text-teal-800",
    pill: "border-teal-200 bg-teal-50 text-teal-800",
    cardHover: "hover:border-teal-300 hover:shadow-teal-100",
    accent: "text-teal-700",
  },
  company: {
    icon: Building2,
    header: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
    iconWrap: "bg-slate-100 text-slate-700",
    pill: "border-slate-200 bg-slate-50 text-slate-700",
    cardHover: "hover:border-slate-300 hover:shadow-slate-100",
    accent: "text-slate-700",
  },
  contest: {
    icon: Trophy,
    header: "border-rose-200 bg-gradient-to-br from-rose-50 to-white",
    iconWrap: "bg-rose-100 text-rose-800",
    pill: "border-rose-200 bg-rose-50 text-rose-800",
    cardHover: "hover:border-rose-300 hover:shadow-rose-100",
    accent: "text-rose-700",
  },
  exhibition: {
    icon: CalendarRange,
    header: "border-violet-200 bg-gradient-to-br from-violet-50 to-white",
    iconWrap: "bg-violet-100 text-violet-800",
    pill: "border-violet-200 bg-violet-50 text-violet-800",
    cardHover: "hover:border-violet-300 hover:shadow-violet-100",
    accent: "text-violet-700",
  },
};

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
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                theme.pill,
                "hover:brightness-95",
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {category.name}
              <span className="rounded-full bg-white/70 px-1.5 text-xs font-semibold tabular-nums">
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
                    <p className={cn("text-xs font-semibold uppercase tracking-wider", theme.accent)}>
                      {typeCountLabel(types.length)}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-[var(--fox-charcoal)] sm:text-2xl">
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
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
                        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#f0e4c3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                        theme.cardHover,
                      )}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-1 -top-2 text-5xl font-black tabular-nums text-[var(--fox-charcoal)]/[0.04]"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            theme.pill,
                          )}
                        >
                          {pt.categoryName}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold leading-snug text-[var(--fox-charcoal)]">
                        {pt.name}
                      </h3>

                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {pt.shortDescription ?? pt.concept}
                      </p>

                      {pt.shortDescription && pt.concept ? (
                        <p className="mt-3 rounded-xl border border-[#f0e4c3] bg-[var(--fox-cream)]/80 px-3 py-2 text-xs leading-relaxed text-[var(--fox-charcoal)]/75">
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
