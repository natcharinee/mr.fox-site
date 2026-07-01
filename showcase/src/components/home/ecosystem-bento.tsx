import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import {
  CATEGORY_IMAGE,
  CATEGORY_ORDER,
  CATEGORY_THEME,
} from "@/components/platforms/platform-category-theme";
import { ContentImage } from "@/components/ui/content-image";
import { isActivePlatformTypeSlug } from "@/lib/platform-type-slugs";
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

type SampleApp = { slug: string; name: string };

type CatalogType = {
  slug: string;
  categorySlug: string;
  example: string;
};

type TypeDetailSnippet = {
  suitableFor?: string[];
};

type EcosystemBentoProps = {
  title: string;
  description: ReactNode;
  architectureLabel: string;
  includesLabel: string;
  viewPlatformLabel: string;
  viewAllLabel: string;
  suitableForLabel: string;
  sampleAppsLabel: string;
  categories: Category[];
  platformTypes: PlatformType[];
  catalogTypes: CatalogType[];
  typeDetails: Record<string, TypeDetailSnippet>;
  sampleAppsByCategory: Record<string, SampleApp[]>;
  modulesLabelFor: (count: number) => string;
};

function categoryTypes(types: PlatformType[], slug: string) {
  return types.filter(
    (t) => t.categorySlug === slug && isActivePlatformTypeSlug(t.slug),
  );
}

function CategoryLegend({
  categories,
  categoryCounts,
}: {
  categories: Record<string, Category>;
  categoryCounts: Record<string, number>;
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-3" aria-label="Ecosystem categories overview">
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
              "inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-semibold sm:text-base",
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
  suitableForLabel,
  sampleAppsLabel,
  catalogType,
  typeDetail,
  sampleApps,
}: {
  slug: string;
  category: Category;
  types: PlatformType[];
  includesLabel: string;
  viewPlatformLabel: string;
  modulesLabel: string;
  suitableForLabel: string;
  sampleAppsLabel: string;
  catalogType?: CatalogType;
  typeDetail?: TypeDetailSnippet;
  sampleApps: SampleApp[];
}) {
  const theme = CATEGORY_THEME[slug];
  const Icon = theme?.icon;
  const imageSrc = CATEGORY_IMAGE[slug as keyof typeof CATEGORY_IMAGE];

  return (
    <article
      id={`ecosystem-${slug}`}
      className={cn(
        "vulpine-glow-hover relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/12 bg-[rgba(22,24,24,0.72)] shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:flex-row md:items-start",
        "border-l-4",
        theme?.borderAccent,
        theme?.cardHover,
      )}
    >
      <div
        className={cn(
          "relative flex min-h-0 flex-col",
          "order-2 border-b border-white/10 md:order-1 md:w-[min(100%,380px)] md:shrink-0 md:self-stretch md:border-b-0 md:border-r md:border-white/10 lg:w-[420px]",
          theme?.header,
        )}
      >
        <div className="flex flex-1 flex-col justify-center px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3.5 sm:gap-4">
            {Icon ? (
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/15 sm:size-14 sm:rounded-2xl",
                  theme?.iconWrap,
                )}
              >
                <Icon className="size-6 sm:size-7" aria-hidden />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-2xl">
                  {category.name}
                </h3>
                <span
                  className={cn(
                    "vulpine-label rounded-lg border px-2.5 py-1 text-[11px] tabular-nums sm:text-xs",
                    theme?.iconWrap,
                  )}
                >
                  {modulesLabel}
                </span>
              </div>
              {category.description ? (
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--vulpine-on-surface)]/85 sm:text-base">
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative mt-auto aspect-[16/10] w-full min-h-[148px] overflow-hidden sm:min-h-[168px]">
          <ContentImage
            src={imageSrc}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            fit="cover"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(12,14,14,0.92)] via-[rgba(12,14,14,0.15)] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
            aria-hidden
          />
        </div>
      </div>

      <div className="relative order-1 flex min-h-0 min-w-0 flex-1 flex-col bg-black/10 px-5 py-5 sm:px-6 sm:py-6 md:order-2">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(255,184,0,0.07),transparent_55%)]"
          aria-hidden
        />
        <div className="relative">
          <p
            className={cn(
              "vulpine-label text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm",
              theme?.accent,
            )}
          >
            {includesLabel}
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {types.map((pt) => (
              <li key={pt.slug} className="min-w-0">
                <Link
                  href={`/platforms/${pt.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-xl border border-white/12 bg-white/[0.06] p-4 transition-all sm:p-5",
                    "hover:border-[var(--vulpine-primary-container)]/40 hover:bg-white/[0.09]",
                    theme?.cardHover,
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-bold text-[var(--vulpine-on-surface)] sm:text-lg">
                      {pt.name}
                    </p>
                  </div>
                  {pt.shortDescription ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-base line-clamp-3">
                      {pt.shortDescription}
                    </p>
                  ) : null}
                  <span
                    className={cn(
                      "vulpine-label mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-80 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:text-sm",
                      theme?.accent,
                    )}
                  >
                    {viewPlatformLabel}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {typeDetail?.suitableFor && typeDetail.suitableFor.length > 0 ? (
            <div className="mt-4">
              <p
                className={cn(
                  "vulpine-label text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs",
                  theme?.accent,
                )}
              >
                {suitableForLabel}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {typeDetail.suitableFor.slice(0, 6).map((item) => (
                  <span
                    key={item}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] sm:text-xs",
                      theme?.pill,
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {sampleApps.length > 0 ? (
            <div className="mt-4">
              <p
                className={cn(
                  "vulpine-label text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs",
                  theme?.accent,
                )}
              >
                {sampleAppsLabel}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {sampleApps.map((app) => (
                  <Link
                    key={app.slug}
                    href={`/apps/${app.slug}`}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1 text-xs font-medium text-[var(--vulpine-on-surface)] transition-colors hover:border-[var(--vulpine-primary-container)]/40 hover:text-[var(--vulpine-primary-container)] sm:text-sm"
                  >
                    {app.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : catalogType?.example ? (
            <p className="mt-4 text-sm text-[var(--vulpine-on-surface-variant)]">
              <span className="font-semibold text-[var(--vulpine-primary-container)]">
                {sampleAppsLabel}:
              </span>{" "}
              {catalogType.example}
            </p>
          ) : null}
        </div>
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
  suitableForLabel,
  sampleAppsLabel,
  categories,
  platformTypes,
  catalogTypes,
  typeDetails,
  sampleAppsByCategory,
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

        <div className="mt-10 flex flex-col gap-6 sm:gap-7">
          {CATEGORY_ORDER.map((slug) => {
            const category = bySlug[slug];
            if (!category) return null;

            const types = categoryTypes(platformTypes, slug);
            if (types.length === 0) return null;

            const primaryType = types[0]!;
            const catalogType = catalogTypes.find((item) => item.slug === primaryType.slug);
            const typeDetail = typeDetails[primaryType.slug];

            return (
              <CategoryCard
                key={slug}
                slug={slug}
                category={category}
                types={types}
                includesLabel={includesLabel}
                viewPlatformLabel={viewPlatformLabel}
                modulesLabel={modulesLabelFor(types.length)}
                suitableForLabel={suitableForLabel}
                sampleAppsLabel={sampleAppsLabel}
                catalogType={catalogType}
                typeDetail={typeDetail}
                sampleApps={sampleAppsByCategory[slug] ?? []}
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
