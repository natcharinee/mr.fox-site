import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { CoreFeaturesGrid } from "@/components/home/core-features-grid";
import { HomePlatformTypesSection } from "@/components/home/home-platform-types-section";
import { FeaturedAppCard } from "@/components/apps/featured-app-card";
import { HomeHero } from "@/components/home/home-hero";
import { HomeStats } from "@/components/home/home-stats";
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
  getSiteStats,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [stats, categories, platformTypes, featuredApps, coreFeatures, latestNews] =
    await Promise.all([
      getSiteStats(),
      getCategories(),
      getPlatformTypes(),
      getFeaturedApplications(),
      getCoreFeatures(6),
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

      <HomeStats
        items={[
          {
            label: t("stats.platformTypes"),
            value: stats.platformTypes,
            icon: "layers",
          },
          {
            label: t("stats.applications"),
            value: stats.applications,
            icon: "zap",
          },
          {
            label: t("stats.features"),
            value: stats.features,
            icon: "sparkles",
          },
          {
            label: t("stats.downloads"),
            value: stats.downloads,
            icon: "download",
          },
        ]}
      />

      <EcosystemBento
        title={t("ecosystem")}
        description={t("ecosystemDesc")}
        includesLabel={t("ecosystemIncludes")}
        typeCountLabel={t("ecosystemTypeCount")}
        viewPlatformLabel={t("ecosystemViewPlatform")}
        viewAllLabel={t("viewAll")}
        categories={localizedCategories}
        platformTypes={localizedPlatforms}
      />

      <HomePlatformTypesSection
        title={t("platformTypes")}
        description={t("platformTypesDesc")}
        viewAllLabel={t("viewAll")}
        exploreLabel={t("exploreFeature")}
        moreTypesLabel={t("morePlatformTypes", {
          count: Math.max(localizedPlatforms.length - 6, 0),
        })}
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {appsWithLinks.length > 0 ? (
              appsWithLinks.map((app) => (
                <FeaturedAppCard
                  key={app.slug}
                  app={app}
                  featuredLabel={tc("featured")}
                  downloadLabel={t("downloadApps")}
                  links={app.links}
                />
              ))
            ) : (
              <p className="text-[var(--vulpine-on-surface-variant)] sm:col-span-2 xl:col-span-4">
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
                  <GlassCard className="mb-6 overflow-hidden rounded-sm border-white/10 p-0">
                    <NewsMedia
                      thumbnailUrl={item.thumbnailUrl}
                      title={item.title}
                      className="aspect-video"
                    />
                  </GlassCard>
                  <h4 className="font-display text-lg font-bold text-[var(--vulpine-on-surface)] uppercase transition-colors group-hover:text-[var(--vulpine-primary)] line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-sm text-[var(--vulpine-on-surface-variant)] opacity-80 line-clamp-2">
                    {item.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-16 md:pb-24">
        <GlassCard hud className="vulpine-hud-border mx-auto max-w-4xl border-[var(--vulpine-primary-container)]/30 p-10 text-center md:p-12">
          <span className="vulpine-label mb-4 inline-block text-[var(--vulpine-primary-container)]">
            INITIALIZE_CONNECTION &gt;&gt;&gt;
          </span>
          <h2 className="font-display text-2xl font-bold tracking-wider text-[var(--vulpine-on-surface)] uppercase md:text-4xl">
            Mr.FOX Ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--vulpine-on-surface-variant)]">
            {t("ecosystemDesc")}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton
              href="/contact"
              className="vulpine-label vulpine-btn-glow rounded-sm bg-[var(--vulpine-primary-container)] px-10 py-4 font-black text-[var(--vulpine-on-primary)] hover:brightness-110"
            >
              Contact
            </LinkButton>
            <LinkButton
              href="/apps"
              variant="outline"
              className="vulpine-label rounded-sm border-white/20 bg-white/5 px-10 py-4 text-[var(--vulpine-on-surface)] hover:bg-white/10"
            >
              {t("viewAll")} Apps
            </LinkButton>
          </div>
        </GlassCard>
      </section>
    </>
  );
}
