import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadButtons } from "@/components/apps/download-buttons";
import {
  PlatformTypeOverview,
  type PlatformTypeDetailContent,
} from "@/components/platforms/platform-type-overview";
import { PlatformTypeBanner } from "@/components/platforms/platform-type-banner";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeApp, localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import {
  getAppsByPlatformType,
  getDownloadLinks,
  getPlatformTypeBySlug,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const platform = await getPlatformTypeBySlug(slug);
  if (!platform) return {};
  const localized = localizePlatform(locale, platform);
  return buildMetadata({
    title: localized.name,
    description: localized.shortDescription ?? localized.concept ?? "",
    path: `/platforms/${slug}`,
    locale,
  });
}

export default async function PlatformDetailPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations("platforms");
  const platformRow = await getPlatformTypeBySlug(slug);
  if (!platformRow) notFound();
  const platform = localizePlatform(locale, platformRow);
  const typeDetails = t.raw("typeDetails") as Record<string, PlatformTypeDetailContent>;
  const typeDetail = typeDetails[slug];
  const heroDescription =
    typeDetail?.subtitle ?? platform.concept ?? platform.shortDescription ?? undefined;

  const apps = await getAppsByPlatformType(platformRow.id);

  const appsWithLinks = await Promise.all(
    apps.map(async (app) => {
      const localized = localizeApp(locale, app);
      return {
        ...localized,
        links: await getDownloadLinks(app.id),
      };
    }),
  );

  return (
    <PageShell>
      <PageHero title={platform.name} description={heroDescription}>
        <Badge variant="outline" className={publicTheme.heroBadge}>
          {platform.categoryName}
        </Badge>
      </PageHero>

      <div className={publicTheme.pageGrid}>
        {typeDetail ? (
          <section className="mb-10">
            <PlatformTypeBanner alt={t("typeDetailBannerAlt")} className="mb-6 sm:mb-8" />
            <PlatformTypeOverview
              content={typeDetail}
              categorySlug={platformRow.categorySlug}
            />
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={publicTheme.cardTitle}>{t("creatorModel")}</CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {platform.creatorModel}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={publicTheme.cardTitle}>{t("visitorModel")}</CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {platform.visitorModel}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {appsWithLinks.length > 0 ? (
          <section className="mt-12">
            <SectionHeading title={t("exampleApps")} />
            <div className="grid gap-4 sm:grid-cols-2">
              {appsWithLinks.map((app) => (
                <Card key={app.slug} className={themedCard()}>
                  <CardHeader>
                    <CardTitle className={`text-base ${publicTheme.cardTitle}`}>{app.name}</CardTitle>
                    <CardDescription className={`line-clamp-2 text-base ${publicTheme.cardDescription}`}>
                      {app.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DownloadButtons appSlug={app.slug} appId={app.id} links={app.links} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <Link href="/platforms" className={`text-sm ${publicTheme.link}`}>
            ← {t("backToPlatforms")}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
