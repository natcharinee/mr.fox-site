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
import {
  getCategories,
  getCoreFeatures,
  getDownloadLinks,
  getFeaturedApplications,
  getLatestNews,
  getPlatformTypes,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tNews = await getTranslations("news");

  const [categories, platformTypes, featuredApps, coreFeatures, latestNews] =
    await Promise.all([
      getCategories(),
      getPlatformTypes(),
      getFeaturedApplications(),
      getCoreFeatures(),
      getLatestNews(3),
    ]);

  const localizedCategories = categories.map((c) => localizeCategory(locale, c));
  const localizedPlatforms = platformTypes.map((p) => localizePlatform(locale, p));
  const localizedApps = featuredApps.map((a) => localizeApp(locale, a));
  const localizedFeatures = coreFeatures.map((f) => localizeFeature(locale, f));
  const localizedNews = latestNews.map((n) => localizeNews(locale, n));

  const appsWithLinks = await Promise.all(
    localizedApps.map(async (app) => ({
      ...app,
      links: await getDownloadLinks(app.id),
    })),
  );

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
        viewAllLabel={t("viewAll")}
        modulesLabelFor={(count) => t("ecosystemModules", { count })}
        categories={localizedCategories}
        platformTypes={localizedPlatforms}
      />

      <section className="px-4 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 border-l-2 border-[var(--vulpine-primary-container)] pl-6">
            <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
              Deployed Modules
            </p>
            <h2 className="font-display text-2xl font-bold tracking-wide text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
              {t("featuredApps")}
            </h2>
            <p className="mt-2 text-[var(--vulpine-on-surface-variant)]">{t("featuredAppsDesc")}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {appsWithLinks.length > 0 ? (
              appsWithLinks.map((app) => (
                <FeaturedAppCard
                  key={app.slug}
                  app={app}
                  featuredLabel={tc("featured")}
                  downloadLabel={t("downloadApps")}
                  links={app.links}
                  compactBelowLg
                />
              ))
            ) : (
              <p className="text-[var(--vulpine-on-surface-variant)] lg:col-span-2">
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

      <section className="px-4 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 flex items-end justify-between gap-4 border-b border-white/5 pb-4">
            <h2 className="font-display text-2xl font-bold tracking-wider text-[var(--vulpine-on-surface)] uppercase md:text-3xl">
              {t("latestNews")}
            </h2>
            <LinkButton
              href="/news"
              variant="ghost"
              className="vulpine-label text-[var(--vulpine-primary-container)]"
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
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--vulpine-primary-container)] transition-all group-hover:gap-2.5">
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
