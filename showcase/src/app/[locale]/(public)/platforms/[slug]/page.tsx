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
import { FeatureMatrix } from "@/components/platforms/feature-matrix";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeApp, localizePlatform } from "@/lib/content-i18n";
import { buildMetadata } from "@/lib/metadata";
import {
  getAppsByPlatformType,
  getCategoryRevenue,
  getDownloadLinks,
  getPlatformFeatureMatrix,
  getPlatformPermissions,
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

  const [matrix, permissions, revenues, apps] = await Promise.all([
    getPlatformFeatureMatrix(platformRow.id),
    getPlatformPermissions(platformRow.id),
    getCategoryRevenue(platformRow.categoryId),
    getAppsByPlatformType(platformRow.id),
  ]);

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
      <PageHero title={platform.name} description={platform.concept ?? undefined}>
        <Badge variant="outline" className={publicTheme.heroBadge}>
          {platform.categoryName}
        </Badge>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("creatorModel")}</CardTitle>
              <CardDescription className="text-foreground">{platform.creatorModel}</CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("visitorModel")}</CardTitle>
              <CardDescription className="text-foreground">{platform.visitorModel}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-10">
          <FeatureMatrix locale={locale} rows={matrix} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("permissionMatrix")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {permissions.map((p) => (
                  <div key={p.key} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {t.has(`perm.${p.key}`) ? t(`perm.${p.key}`) : p.key}
                    </dt>
                    <dd className="font-medium text-[var(--fox-charcoal)]">
                      {t.has(`permValue.${p.value}`)
                        ? t(`permValue.${p.value}`)
                        : p.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-[var(--fox-charcoal)]">{t("revenueModel")}</CardTitle>
              <CardDescription>
                {t("revenueCategoryNote")} — {platform.categoryName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {revenues.map((r) => (
                  <div key={r.revenueFeature} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {t.has(`revenue.${r.revenueFeature}`)
                        ? t(`revenue.${r.revenueFeature}`)
                        : r.revenueFeature}
                    </dt>
                    <dd className="font-medium text-[var(--fox-charcoal)]">
                      {t.has(`permValue.${r.value}`)
                        ? t(`permValue.${r.value}`)
                        : r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        {appsWithLinks.length > 0 ? (
          <section className="mt-12">
            <SectionHeading title={t("exampleApps")} />
            <div className="grid gap-4 sm:grid-cols-2">
              {appsWithLinks.map((app) => (
                <Card key={app.slug} className={themedCard()}>
                  <CardHeader>
                    <CardTitle className="text-base text-[var(--fox-charcoal)]">{app.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{app.description}</CardDescription>
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
