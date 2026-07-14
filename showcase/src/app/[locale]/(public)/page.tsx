import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { CoreFeaturesGrid } from "@/components/home/core-features-grid";
import { FeaturedAppCard } from "@/components/apps/featured-app-card";
import { HomeHero } from "@/components/home/home-hero";
import { EcosystemBento } from "@/components/home/ecosystem-bento";
import { NewsMedia } from "@/components/news/news-media";
import { GlassCard } from "@/components/vulpine/vulpine-primitives";
import type { Locale } from "@/i18n/routing";
import {
  localizeApp,
  localizeCategory,
  localizeFeature,
  localizeNews,
  localizePlatform,
} from "@/lib/content-i18n";
import { compareAppsByPosterPriority } from "@/lib/app-poster";
import {
  getApplications,
  getCategories,
  getCoreFeatures,
  getDownloadLinks,
  getLatestNews,
  getPlatformTypes,
} from "@/lib/queries";
import { CATEGORY_ORDER } from "@/components/platforms/platform-category-theme";
import { pageWidth } from "@/components/layout/public-theme";

export const dynamic = "force-dynamic";

const HOMEPAGE_APPS_LIMIT = 12;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tNews = await getTranslations("news");
  const tPlatforms = await getTranslations("platforms");
  const platformsOverview = tPlatforms.raw("overview") as {
    types: Array<{
      slug: string;
      categorySlug: string;
      example: string;
      permissions: Array<{
        label: string;
        value: "yes" | "no" | "optional" | "contestant";
      }>;
    }>;
    valueLabels: {
      yes: string;
      no: string;
      optional: string;
      contestant: string;
    };
  };
  const [categories, platformTypes, allApps, coreFeatures, latestNews, ...categoryApps] =
    await Promise.all([
      getCategories(),
      getPlatformTypes(),
      getApplications(),
      getCoreFeatures(),
      getLatestNews(3),
      ...CATEGORY_ORDER.map((slug) => getApplications({ categorySlug: slug })),
    ]);

  const sampleAppsByCategory = Object.fromEntries(
    CATEGORY_ORDER.map((slug, index) => [
      slug,
      categoryApps[index]!.slice(0, 6).map((app) => ({
        slug: app.slug,
        name: app.name,
      })),
    ]),
  );

  const localizedCategories = categories.map((c) => localizeCategory(locale, c));
  const localizedPlatforms = platformTypes.map((p) => localizePlatform(locale, p));
  const localizedApps = allApps.map((a) => localizeApp(locale, a));
  const localizedFeatures = coreFeatures.map((f) => localizeFeature(locale, f));
  const localizedNews = latestNews.map((n) => localizeNews(locale, n));

  const appsWithLinks = (
    await Promise.all(
      localizedApps.map(async (app) => ({
        ...app,
        links: await getDownloadLinks(app.id),
      })),
    )
  )
    .sort((a, b) => {
      const posterOrder = compareAppsByPosterPriority(a, b);
      if (posterOrder !== 0) return posterOrder;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.sortOrder - b.sortOrder;
    })
    .slice(0, HOMEPAGE_APPS_LIMIT);

  return (
    <>
      <HomeHero
        badge={t("badge")}
        brandName={t("brandName")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        titleSuffix={t("titleSuffix")}
        subtitle={t("subtitle")}
        pillars={[t("pillarPlatforms"), t("pillarFeatures"), t("pillarApps")]}
        explorePlatforms={t("explorePlatforms")}
        downloadApps={t("downloadApps")}
      />

      <EcosystemBento
        title={t("ecosystem")}
        description={t.rich("ecosystemDesc", {
          br: () => <br />,
        })}
        architectureLabel={t("ecosystemArchitecture")}
        includesLabel={t("ecosystemIncludes")}
        viewPlatformLabel={t("ecosystemViewPlatform")}
        viewAllLabel={t("ecosystemViewAll")}
        sampleAppsLabel={t("ecosystemSampleApps")}
        modulesLabelFor={(count) => t("ecosystemModules", { count })}
        categories={localizedCategories}
        platformTypes={localizedPlatforms}
        catalogTypes={platformsOverview.types}
        sampleAppsByCategory={sampleAppsByCategory}
      />

      <section className="py-16 md:py-24">
        <div className={pageWidth}>
          <div className="mb-12 border-l-2 border-[var(--vulpine-primary-container)] pl-6">
            <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
              Deployed Modules
            </p>
            <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
              {t("featuredApps")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {appsWithLinks.length > 0 ? (
              appsWithLinks.map((app) => (
                <FeaturedAppCard
                  key={app.slug}
                  app={app}
                  featuredLabel={app.featured ? tc("featured") : undefined}
                  downloadLabel={t("downloadApps")}
                  links={app.links}
                  compactBelowLg
                />
              ))
            ) : (
              <p className="text-[var(--vulpine-on-surface-variant)] lg:col-span-3">
                {t("featuredAppsEmpty")}
              </p>
            )}
          </div>
        </div>
      </section>

      <CoreFeaturesGrid
        title={t("coreFeatures")}
        exploreLabel={t("exploreFeature")}
        features={localizedFeatures}
      />

      <section className="py-16 md:py-24">
        <div className={pageWidth}>
          <div className="mb-12 flex items-end justify-between gap-4 border-b border-white/5 pb-4">
            <h2 className="font-display text-2xl font-bold tracking-wider text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
              {t("latestNews")}
            </h2>
            <LinkButton
              href="/news"
              variant="ghost"
              className="vulpine-label h-auto rounded-lg border border-[var(--vulpine-primary-container)]/40 bg-white/[0.04] px-3.5 py-2 text-base font-semibold text-[var(--vulpine-primary-container)] hover:bg-[var(--vulpine-primary-container)]/10 hover:text-[var(--vulpine-primary-container)] sm:text-lg"
            >
              {t("viewAll")} →
            </LinkButton>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {localizedNews.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="group block">
                <article>
                  <GlassCard className="mb-6 overflow-hidden border-white/10 p-0">
                    <NewsMedia
                      thumbnailUrl={item.thumbnailUrl}
                      title={item.title}
                      className="aspect-video"
                    />
                  </GlassCard>
                  <h4 className="font-display text-lg font-bold text-[var(--vulpine-on-surface)] uppercase transition-colors group-hover:text-[var(--vulpine-primary)] line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-base text-[var(--vulpine-on-surface-variant)] opacity-90 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--vulpine-primary-container)]/40 bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-[var(--vulpine-primary-container)] transition-all group-hover:border-[var(--vulpine-primary-container)]/60 group-hover:bg-[var(--vulpine-primary-container)]/10">
                    {tNews("readMore")}
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
