import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LinkButton } from "@/components/ui/link-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoreFeaturesGrid } from "@/components/home/core-features-grid";
import { HomePlatformTypesSection } from "@/components/home/home-platform-types-section";
import { FeaturedAppCard } from "@/components/apps/featured-app-card";
import { HomeHero } from "@/components/home/home-hero";
import { HomeStats } from "@/components/home/home-stats";
import { EcosystemBento } from "@/components/home/ecosystem-bento";
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
      getFeaturedApplications(4),
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
    <div className="bg-[var(--fox-cream)]">
      <HomeHero
        badge={t("badge")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        titleSuffix={t("titleSuffix")}
        subtitle={t("subtitle")}
        explorePlatforms={t("explorePlatforms")}
        downloadApps={t("downloadApps")}
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
          <div>
            <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{t("featuredApps")}</h2>
            <p className="mt-1 text-muted-foreground">{t("featuredAppsDesc")}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {appsWithLinks.map((app) => (
            <FeaturedAppCard
              key={app.slug}
              app={app}
              featuredLabel={tc("featured")}
              downloadLabel={t("downloadApps")}
              links={app.links}
            />
          ))}
        </div>
      </section>

      <CoreFeaturesGrid
        title={t("coreFeatures")}
        exploreLabel={t("exploreFeature")}
        features={localizedFeatures}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-1 rounded-full bg-[var(--fox-gold)]" />
            <h2 className="text-2xl font-bold text-[var(--fox-charcoal)]">{t("latestNews")}</h2>
          </div>
          <LinkButton href="/news" variant="ghost" className="text-[var(--fox-charcoal)]">
            {t("viewAll")} →
          </LinkButton>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {localizedNews.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`}>
              <Card className="h-full border-[#f0e4c3] bg-white/85 transition-all hover:-translate-y-0.5 hover:border-[var(--fox-gold)]/40 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
